"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCeProcessor = void 0;
const fs_1 = require("fs");
const handlebars_1 = require("handlebars");
const xmlHelper_1 = require("../xmlHelper");
const danfeProcessor_1 = require("./danfeProcessor");
const path = require("path");
const TEMPLATE_CCE = path.join(__dirname, "..", "templates/cce.hbs");
/**
 * Classe para processamento da CCe em HTML
 */
class CCeProcessor {
    async xmlStringToHtml(cceXml, nfeXml, emitenteImageUrl) {
        const template = (0, fs_1.readFileSync)(TEMPLATE_CCE, "utf-8");
        const cceXmlObject = xmlHelper_1.XmlHelper.deserializeXml(cceXml);
        const nfeXmlObject = xmlHelper_1.XmlHelper.deserializeXml(nfeXml);
        const html = (0, handlebars_1.compile)(template)(this.getTemplateData(cceXmlObject, nfeXmlObject.nfeProc, emitenteImageUrl));
        return html;
    }
    getTemplateData(cceXmlObject, nfeXmlObject, emitenteImageUrl) {
        const danfeProcessor = new danfeProcessor_1.DanfeProcessor();
        const baseCCeData = cceXmlObject.procEventoNFe;
        const danfeData = danfeProcessor.getTemplateData(nfeXmlObject, emitenteImageUrl, false);
        return {
            emitenteImageUrl,
            numero: danfeData.numero,
            serie: danfeData.serie,
            chave: danfeData.chave,
            codigo_barras: danfeData.codigo_barras,
            correcao: baseCCeData.evento.infEvento.detEvento.xCorrecao,
            destinatario: danfeData.destinatario,
            emitente: danfeData.emitente,
            numeroSequencia: baseCCeData.retEvento.infEvento.nSeqEvento,
            versaoEvento: baseCCeData.evento.infEvento.verEvento,
        };
    }
}
exports.CCeProcessor = CCeProcessor;
