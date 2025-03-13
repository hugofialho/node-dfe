import * as schema from '../schema/index'
import { XmlHelper } from "../xmlHelper";
import { WebServiceHelper } from "../webservices/webserviceHelper";
import { ServicosSefaz, Configuracoes, RetornoProcessamento } from "../interface/nfe";
import * as Utils from "../utils/utils";
import { SefazNFCe } from "../webservices/sefazNfce";
import { SefazNFe } from "../webservices/sefazNfe";
import { Evento } from '../interface';
import { Signature } from '../signature';

let soapEvento: any = null;

/**
 * Classe para processamento de Eventos ( Cancelamento / Inutilização )
 */
export class EventoProcessor {

    constructor(private configuracoes: Configuracoes) {
        Utils.setConfigDefaultValues(this.configuracoes);
    }

    public async executar(evento: Evento) {
        let result = <RetornoProcessamento>{
            success: false
        };

        switch (evento.tpEvento) {
            case '110111':
                evento.detEvento.descEvento = 'Cancelamento';
                break;
            case '110110':
                evento.detEvento.descEvento = 'Carta de Correcao';
                evento.detEvento.xCondUso = `A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.`;
                break
            case '210200':
                evento.detEvento.descEvento = 'Confirmacao da Operacao';
                break
            case '210210':
                evento.detEvento.descEvento = 'Ciencia da Operacao';
                break
            case '210220':
                evento.detEvento.descEvento = 'Desconhecimento da Operacao';
                break
            case '210240':
                evento.detEvento.descEvento = 'Operacao nao Realizada';
                break
            case '110140':
                evento.detEvento.descEvento = 'EPEC';
                break
        }

        try {
            const { geral: { modelo, ambiente }, empresa } = this.configuracoes
            const Sefaz = modelo == '65' ? SefazNFCe : SefazNFe;

            soapEvento = Sefaz.getSoapInfo(empresa.endereco.uf, ambiente, ServicosSefaz.evento);

            const xml = this.gerarXml(evento);
            const xmlAssinado = Signature.signXmlX509(xml, 'infEvento', this.configuracoes.certificado);

            let xmlLote = this.gerarXmlLote(xmlAssinado);

            result = await this.transmitirXml(xmlLote);
        } catch (ex: any) {
            result.success = false;
            result.error = ex;
        }

        return result;
    }

    private async transmitirXml(xml: string) {
        const { geral: { modelo, ambiente }, empresa, certificado, webProxy } = this.configuracoes;

        const Sefaz = modelo == '65' ? SefazNFCe : SefazNFe;
        const soap = Sefaz.getSoapInfo(empresa.endereco.uf, ambiente, ServicosSefaz.evento);
        return await WebServiceHelper.makeSoapRequest(xml, certificado, soap, webProxy);
    }

    private getInfEvento(evento: Evento) {
        const { geral: { ambiente }, empresa } = this.configuracoes;
        const _ID = `ID${evento.tpEvento}${evento.chNFe}${("00" + evento.nSeqEvento).slice(-2)}`;
        if (_ID.length < 54) throw 'ID de Evento inválido';

        return <schema.TEventoInfEvento>{
            $: { Id: _ID },
            cOrgao: empresa.endereco.cUf,
            tpAmb: Utils.getEnumByValue(schema.TAmb, ambiente),
            CNPJ: empresa.cnpj,
            chNFe: evento.chNFe,
            dhEvento: evento.dhEvento,
            tpEvento: evento.tpEvento,
            nSeqEvento: evento.nSeqEvento,
            verEvento: '1.00',
            detEvento: this.getDetEvento(evento)
        };
    }

    private getDetEvento(evento: Evento) {
        //TODO: transformar tpEvento em enum
        const result = <schema.TEventoInfEventoDetEvento>{
            $: { versao: '1.00' },
            descEvento: evento.detEvento.descEvento,
        };
        if (evento.tpEvento == '110110') {
            result.xCorrecao = evento.detEvento.xCorrecao;
            result.xCondUso = evento.detEvento.xCondUso;
        };
        if (evento.tpEvento == '110111') { //cancelamento
            result.nProt = evento.detEvento.nProt;
            result.xJust = evento.detEvento.xJust;
        };
        if (evento.tpEvento == 'cancSubst') {
            result.cOrgaoAutor = evento.detEvento.cOrgaoAutor;
            result.tpAutor = '001';
            result.verAplic = evento.detEvento.verAplic;
            result.nProt = evento.detEvento.nProt;
            result.xJust = evento.detEvento.xJust;
            result.chNFeRef = evento.detEvento.chNFeRef;
        };
        if (evento.tpEvento == 'manifDestOperNaoRealizada') {
            result.xJust = evento.detEvento.xJust;
        };

        return result;
    }

    private gerarXml(evento: Evento) {
        const xmlEvento = <schema.TEvento>{
            $: {
                versao: '1.00',
                xmlns: 'http://www.portalfiscal.inf.br/nfe'
            },
            infEvento: this.getInfEvento(evento)
        };

        Utils.removeSelfClosedFields(xmlEvento);
        return XmlHelper.serializeXml(xmlEvento, 'evento');
    }

    private gerarXmlLote(xml: string) {
        //TODO: ajustar para receber uma lista de xmls...
        const { geral: { versao } } = this.configuracoes;

        const loteId = Utils.randomInt(1, 999999999999999).toString();
        const envEvento = <schema.TEnviEvento>{
            $: { versao: '1.00', xmlns: 'http://www.portalfiscal.inf.br/nfe' },
            idLote: loteId,
            _: '[XMLS]'
        };

        const xmlLote = XmlHelper.serializeXml(envEvento, 'envEvento');
        return xmlLote.replace('[XMLS]', xml);
    }

}