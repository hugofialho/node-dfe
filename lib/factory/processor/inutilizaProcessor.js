"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InutilizaProcessor = void 0;
const xmlHelper_1 = require("../xmlHelper");
const webserviceHelper_1 = require("../webservices/webserviceHelper");
const sefazNfce_1 = require("../webservices/sefazNfce");
const sefazNfe_1 = require("../webservices/sefazNfe");
const nfe_1 = require("../interface/nfe");
const Utils = require("../utils/utils");
const signature_1 = require("../signature");
let soapInutilizacao = null;
/**
 * Classe para processamento de Inutilização de numeração
 */
class InutilizaProcessor {
    constructor(configuracoes) {
        this.configuracoes = configuracoes;
        Utils.setConfigDefaultValues(this.configuracoes);
    }
    async executar(dados) {
        let result = {
            success: false
        };
        try {
            const { geral: { modelo, ambiente }, empresa } = this.configuracoes;
            const Sefaz = modelo == '65' ? sefazNfce_1.SefazNFCe : sefazNfe_1.SefazNFe;
            soapInutilizacao = Sefaz.getSoapInfo(empresa.endereco.uf, ambiente, nfe_1.ServicosSefaz.inutilizacao);
            const xml = this.gerarXml(dados);
            result = await this.transmitirXml(xml);
        }
        catch (ex) {
            result.success = false;
            result.error = ex;
        }
        return result;
    }
    async transmitirXml(xml) {
        const { geral: { modelo, ambiente }, empresa, certificado, webProxy } = this.configuracoes;
        const Sefaz = modelo == '65' ? sefazNfce_1.SefazNFCe : sefazNfe_1.SefazNFe;
        const soap = Sefaz.getSoapInfo(empresa.endereco.uf, ambiente, nfe_1.ServicosSefaz.inutilizacao);
        return await webserviceHelper_1.WebServiceHelper.makeSoapRequest(xml, certificado, soap, webProxy);
    }
    gerarInfInut(dados) {
        const { geral: { ambiente }, empresa } = this.configuracoes;
        const _ID = `ID${empresa.endereco.cUf}${dados.ano}${empresa.cnpj}${("00" + dados.modelo).slice(-2)}${("000" + dados.serie).slice(-3)}${("000000000" + dados.numeroInicial).slice(-9)}${("000000000" + dados.numeroFinal).slice(-9)}`;
        if (_ID.length < 43)
            throw 'ID de Inutilização inválido';
        const infInut = {
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
    gerarXml(dados) {
        const { geral: { versao } } = this.configuracoes;
        if (dados.ano > 2000)
            dados.ano = dados.ano - 2000;
        if (dados.numeroInicial > dados.numeroFinal)
            throw 'O numero final não pode ser menor que o inicial.';
        const infInut = this.gerarInfInut(dados);
        const inutNFe = {
            $: { versao, xmlns: 'http://www.portalfiscal.inf.br/nfe' },
            infInut
        };
        Utils.removeSelfClosedFields(inutNFe);
        const xml = xmlHelper_1.XmlHelper.serializeXml(inutNFe, 'inutNFe');
        const xmlAssinado = signature_1.Signature.signXmlX509(xml, 'infInut', this.configuracoes.certificado);
        return xmlAssinado;
    }
}
exports.InutilizaProcessor = InutilizaProcessor;
