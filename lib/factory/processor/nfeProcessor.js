"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFeProcessor = void 0;
const Utils = require("../utils/utils");
const retornoProcessor_1 = require("./retornoProcessor");
const enviaProcessor_1 = require("./enviaProcessor");
const eventoProcessor_1 = require("./eventoProcessor");
const inutilizaProcessor_1 = require("./inutilizaProcessor");
/**
 * Classe para processamento de NFe/NFCe
 */
class NFeProcessor {
    constructor(configuracoes) {
        this.configuracoes = configuracoes;
        this.retornoProcessor = null;
        this.enviaProcessor = null;
        this.eventoProcessor = null;
        this.inutlizacaoProcessor = null;
        Utils.setConfigDefaultValues(this.configuracoes);
        this.retornoProcessor = new retornoProcessor_1.RetornoProcessor(this.configuracoes);
        this.enviaProcessor = new enviaProcessor_1.EnviaProcessor(this.configuracoes);
        this.eventoProcessor = new eventoProcessor_1.EventoProcessor(this.configuracoes);
        this.inutlizacaoProcessor = new inutilizaProcessor_1.InutilizaProcessor(this.configuracoes);
    }
    /**
     * Metodo para realizar o processamento de documento(s) do tipo 55 ou 65 de forma sincrona
     * @param documento Array de documentos modelo 55 ou 1 documento modelo 65
     */
    async processarDocumento(documento) {
        let result = await this.executar(documento);
        return result;
    }
    async executar(documento) {
        const { geral } = this.configuracoes;
        let result = {};
        try {
            result = (await this.enviaProcessor.executar(documento));
            let retEnviNFe = null;
            let retConsReciNFe = null;
            if (result.envioNF && result.envioNF.data) {
                const data = Object(result.envioNF.data);
                if (data.retEnviNFe && data.retEnviNFe.infRec && geral.modelo == "55") {
                    retEnviNFe = data.retEnviNFe;
                    const recibo = retEnviNFe.infRec.nRec;
                    result.consultaProc = (await this.retornoProcessor.executar(recibo));
                    retConsReciNFe = Object(result.consultaProc.data).retConsReciNFe;
                }
                if (retEnviNFe &&
                    retConsReciNFe &&
                    retEnviNFe.cStat == "103" &&
                    retConsReciNFe.cStat == "104") {
                    result.confirmada = true;
                    result.success = true;
                }
            }
            else if (result.retornoContingenciaOffline && result.success) {
                return result;
            }
            else if (!result.error) {
                throw new Error("Erro ao realizar requisição. Campo envioNF vazio.");
            }
        }
        catch (ex) {
            result.success = false;
            result.error = ex;
        }
        return result;
    }
    async inutilizarNumeracao(dados) {
        return await this.inutlizacaoProcessor.executar(dados);
    }
    async gerarEvento(evento) {
        return await this.eventoProcessor.executar(evento);
    }
    async processarXmlContingencia(xml) {
        return await this.enviaProcessor.transmitirXml(xml);
    }
}
exports.NFeProcessor = NFeProcessor;
