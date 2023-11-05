"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCeProcessor = void 0;
const fs_1 = require("fs");
const handlebars_1 = require("handlebars");
const formata_1 = require("../utils/formata");
const xmlHelper_1 = require("../xmlHelper");
const danfeProcessor_1 = require("./danfeProcessor");
const path = require("path");
const TEMPLATE_CCE = path.join(__dirname, "..", "templates/cce.hbs");
/**
 * Classe para processamento da CCe em HTML
 */
class CCeProcessor {
    async xmlStringToHtml({ cceXml, nfeXml, }) {
        const template = (0, fs_1.readFileSync)(TEMPLATE_CCE, "utf-8");
        const cceXmlObject = xmlHelper_1.XmlHelper.deserializeXml(cceXml);
        const nfeXmlObject = xmlHelper_1.XmlHelper.deserializeXml(nfeXml);
        const html = (0, handlebars_1.compile)(template)(this.getTemplateData({
            cceXmlObject,
            nfeXmlObject: nfeXmlObject.nfeProc,
        }));
        return html;
    }
    getTemplateData({ cceXmlObject, nfeXmlObject, }) {
        const danfeProcessor = new danfeProcessor_1.DanfeProcessor();
        const emitente = danfeProcessor.getEmitente(nfeXmlObject);
        const destinatario = danfeProcessor.getDestinatario(nfeXmlObject);
        return {
            chaveAcesso: cceXmlObject.procEventoNFe.retEvento.infEvento.chNFe,
            correcao: cceXmlObject.procEventoNFe.evento.infEvento.detEvento.xCorrecao,
            destinatario: {
                nome: destinatario.nome,
                cnpj: (0, formata_1.mascaraCNPJ)(cceXmlObject.procEventoNFe.retEvento.infEvento.CNPJDest),
            },
            emitente: {
                bairro: emitente.bairro,
                cep: emitente.cep,
                cnpj: (0, formata_1.mascaraCNPJ)(cceXmlObject.procEventoNFe.evento.infEvento.CNPJ),
                endereco: emitente.endereco,
                fantasia: emitente.fantasia,
                ie: emitente.ie,
                municipio: emitente.municipio,
                numero: emitente.numero,
                uf: emitente.uf,
            },
            numeroSequencia: cceXmlObject.procEventoNFe.retEvento.infEvento.nSeqEvento,
            versaoEvento: cceXmlObject.procEventoNFe.evento.infEvento.verEvento,
        };
    }
}
exports.CCeProcessor = CCeProcessor;
