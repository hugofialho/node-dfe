import * as schema from '../schema/index'
import { XmlHelper } from "../xmlHelper";
import { WebServiceHelper } from "../webservices/webserviceHelper";
import { SefazNFCe } from "../webservices/sefazNfce";
import { SefazNFe } from "../webservices/sefazNfe";
import { ServicosSefaz, Configuracoes, RetornoProcessamento } from "../interface/nfe";
import { Inutilizar } from '../interface/inutilizacao';
import * as Utils from "../utils/utils";
import { Signature } from '../signature';

let soapInutilizacao: any = null;

/**
 * Classe para processamento de Inutilização de numeração
 */
export class InutilizaProcessor {

    constructor(private configuracoes: Configuracoes) {
        Utils.setConfigDefaultValues(this.configuracoes);
    }

    public async executar(dados: Inutilizar) {
        let result = <RetornoProcessamento>{
            success: false
        };

        try {
            const { geral: { modelo, ambiente }, empresa } = this.configuracoes
            const Sefaz = modelo == '65' ? SefazNFCe : SefazNFe;

            soapInutilizacao = Sefaz.getSoapInfo(empresa.endereco.uf, ambiente, ServicosSefaz.inutilizacao);

            const xml = this.gerarXml(dados);
            result = await this.transmitirXml(xml);

        } catch (ex: any) {
            result.success = false;
            result.error = ex;
        }

        return result;
    }

    private async transmitirXml(xml: string) {
        const { geral: { modelo, ambiente }, empresa, certificado, webProxy } = this.configuracoes;

        const Sefaz = modelo == '65' ? SefazNFCe : SefazNFe;
        const soap = Sefaz.getSoapInfo(empresa.endereco.uf, ambiente, ServicosSefaz.inutilizacao);
        return await WebServiceHelper.makeSoapRequest(xml, certificado, soap, webProxy);
    }

    private gerarInfInut ( dados: Inutilizar) {
        const { geral: { ambiente }, empresa } = this.configuracoes;
        const _ID = `ID${empresa.endereco.cUf}${dados.ano}${empresa.cnpj}${("00"+dados.modelo).slice(-2)}${("000" + dados.serie).slice(-3)}${("000000000" + dados.numeroInicial).slice(-9)}${("000000000" + dados.numeroFinal).slice(-9)}`;

        if (_ID.length < 43) throw 'ID de Inutilização inválido';

        const infInut = <schema.TInutNFeInfInut>{
            $: { Id: _ID },
            tpAmb: ambiente,
            xServ: 'INUTILIZAR',
            cUF: empresa.endereco.cUf,
            ano: dados.ano,
            CNPJ: empresa.cnpj,
            mod: dados.modelo,
            serie: dados.serie,
            nNFIni: dados.numeroInicial,
            nNFFin: dados.numeroFinal,
            xJust: dados.xJustificativa,
        };
        return infInut;
    }

    private gerarXml(dados: Inutilizar) {
        const { geral: { versao } } = this.configuracoes;
        if (dados.ano > 2000) dados.ano = dados.ano - 2000;
        if (dados.numeroInicial > dados.numeroFinal) throw 'O numero final não pode ser menor que o inicial.';
        
        const infInut = this.gerarInfInut(dados);
        const inutNFe = <schema.TInutNFe>{
            $: { versao, xmlns: 'http://www.portalfiscal.inf.br/nfe' },
            infInut
        };
        Utils.removeSelfClosedFields(inutNFe);
        const xml = XmlHelper.serializeXml(inutNFe, 'inutNFe');
        const xmlAssinado = Signature.signXmlX509(xml, 'infInut', this.configuracoes.certificado);
        return xmlAssinado;        
    }
}