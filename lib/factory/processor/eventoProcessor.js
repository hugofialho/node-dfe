"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventoProcessor = void 0;
const schema = require("../schema/index");
const xmlHelper_1 = require("../xmlHelper");
const webserviceHelper_1 = require("../webservices/webserviceHelper");
const nfe_1 = require("../interface/nfe");
const Utils = require("../utils/utils");
const sefazNfce_1 = require("../webservices/sefazNfce");
const sefazNfe_1 = require("../webservices/sefazNfe");
const signature_1 = require("../signature");
let soapEvento = null;
/**
 * Classe para processamento de Eventos ( Cancelamento / Inutilização )
 */
class EventoProcessor {
    constructor(configuracoes) {
        this.configuracoes = configuracoes;
        Utils.setConfigDefaultValues(this.configuracoes);
    }
    async executar(evento) {
        let result = {
            success: false
        };
        switch (evento.tpEvento) {
            case '110111':
                evento.detEvento.descEvento = 'Cancelamento';
                break;
            case '110110':
                evento.detEvento.descEvento = 'Carta de Correcao';
                evento.detEvento.xCondUso = `A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.`;
                break;
            case '210200':
                evento.detEvento.descEvento = 'Confirmacao da Operacao';
                break;
            case '210210':
                evento.detEvento.descEvento = 'Ciencia da Operacao';
                break;
            case '210220':
                evento.detEvento.descEvento = 'Desconhecimento da Operacao';
                break;
            case '210240':
                evento.detEvento.descEvento = 'Operacao nao Realizada';
                break;
            case '110140':
                evento.detEvento.descEvento = 'EPEC';
                break;
        }
        try {
            const { geral: { modelo, ambiente }, empresa } = this.configuracoes;
            const Sefaz = modelo == '65' ? sefazNfce_1.SefazNFCe : sefazNfe_1.SefazNFe;
            soapEvento = Sefaz.getSoapInfo(empresa.endereco.uf, ambiente, nfe_1.ServicosSefaz.evento);
            const xml = this.gerarXml(evento);
            const xmlAssinado = signature_1.Signature.signXmlX509(xml, 'infEvento', this.configuracoes.certificado);
            let xmlLote = this.gerarXmlLote(xmlAssinado);
            result = await this.transmitirXml(xmlLote);
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
        const soap = Sefaz.getSoapInfo(empresa.endereco.uf, ambiente, nfe_1.ServicosSefaz.evento);
        return await webserviceHelper_1.WebServiceHelper.makeSoapRequest(xml, certificado, soap, webProxy);
    }
    getInfEvento(evento) {
        const { geral: { ambiente }, empresa } = this.configuracoes;
        const _ID = `ID${evento.tpEvento}${evento.chNFe}${("00" + evento.nSeqEvento).slice(-2)}`;
        if (_ID.length < 54)
            throw 'ID de Evento inválido';
        return {
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
    getDetEvento(evento) {
        //TODO: transformar tpEvento em enum
        const result = {
            $: { versao: '1.00' },
            descEvento: evento.detEvento.descEvento,
        };
        if (evento.tpEvento == '110110') {
            result.xCorrecao = evento.detEvento.xCorrecao;
            result.xCondUso = evento.detEvento.xCondUso;
        }
        ;
        if (evento.tpEvento == '110111') { //cancelamento
            result.nProt = evento.detEvento.nProt;
            result.xJust = evento.detEvento.xJust;
        }
        ;
        if (evento.tpEvento == 'cancSubst') {
            result.cOrgaoAutor = evento.detEvento.cOrgaoAutor;
            result.tpAutor = '001';
            result.verAplic = evento.detEvento.verAplic;
            result.nProt = evento.detEvento.nProt;
            result.xJust = evento.detEvento.xJust;
            result.chNFeRef = evento.detEvento.chNFeRef;
        }
        ;
        if (evento.tpEvento == 'manifDestOperNaoRealizada') {
            result.xJust = evento.detEvento.xJust;
        }
        ;
        return result;
    }
    gerarXml(evento) {
        const xmlEvento = {
            $: {
                versao: '1.00',
                xmlns: 'http://www.portalfiscal.inf.br/nfe'
            },
            infEvento: this.getInfEvento(evento)
        };
        Utils.removeSelfClosedFields(xmlEvento);
        return xmlHelper_1.XmlHelper.serializeXml(xmlEvento, 'evento');
    }
    gerarXmlLote(xml) {
        //TODO: ajustar para receber uma lista de xmls...
        const { geral: { versao } } = this.configuracoes;
        const loteId = Utils.randomInt(1, 999999999999999).toString();
        const envEvento = {
            $: { versao: '1.00', xmlns: 'http://www.portalfiscal.inf.br/nfe' },
            idLote: loteId,
            _: '[XMLS]'
        };
        const xmlLote = xmlHelper_1.XmlHelper.serializeXml(envEvento, 'envEvento');
        return xmlLote.replace('[XMLS]', xml);
    }
}
exports.EventoProcessor = EventoProcessor;
