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
        try {
            return await this.enviaProcessor.executar(documento);
        }
        catch (ex) {
            return {
                success: false,
                error: ex,
            };
        }
    }
    async NFCeAssinaTransmite(xml) {
        try {
            return await this.enviaProcessor.NFCeAssinaTransmite(xml);
        }
        catch (ex) {
            return {
                success: false,
                error: ex,
            };
        }
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
