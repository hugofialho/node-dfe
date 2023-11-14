"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCeProcessor = void 0;
const fs_1 = require("fs");
const handlebars_1 = require("handlebars");
const formata_1 = require("../../src/factory/utils/formata");
const xmlHelper_1 = require("../../src/factory/xmlHelper");
const danfeProcessor_1 = require("../../src/factory/processor/danfeProcessor");
const path = require("path");
const TEMPLATE_CCE = path.join(__dirname, "..", "templates/cce.hbs");
/**
 * Classe para processamento da CCe em HTML
 */
class CCeProcessor {
  async xmlStringToHtml({ cceXml, nfeXml }) {
    const template = (0, fs_1.readFileSync)(TEMPLATE_CCE, "utf-8");
    const cceXmlObject = xmlHelper_1.XmlHelper.deserializeXml(cceXml);
    const nfeXmlObject = xmlHelper_1.XmlHelper.deserializeXml(nfeXml);
    const html = (0, handlebars_1.compile)(template)(
      this.getTemplateData({
        cceXmlObject,
        nfeXmlObject: nfeXmlObject.nfeProc,
      })
    );
    return html;
  }
  getTemplateData({ cceXmlObject, nfeXmlObject }) {
    const danfeProcessor = new danfeProcessor_1.DanfeProcessor();
    const baseCCeData = cceXmlObject.procEventoNFe;
    const emitter = danfeProcessor.getEmitente(nfeXmlObject);
    const receiver = danfeProcessor.getDestinatario(nfeXmlObject);
    return {
      chaveAcesso: baseCCeData.retEvento.infEvento.chNFe,
      correcao: baseCCeData.evento.infEvento.detEvento.xCorrecao,
      destinatario: {
        nome: receiver.nome,
        cnpj: (0, formata_1.mascaraCNPJ)(
          baseCCeData.retEvento.infEvento.CNPJDest
        ),
      },
      emitente: {
        bairro: emitter.bairro,
        cep: emitter.cep,
        cnpj: (0, formata_1.mascaraCNPJ)(baseCCeData.evento.infEvento.CNPJ),
        endereco: emitter.endereco,
        fantasia: emitter.fantasia,
        ie: emitter.ie,
        municipio: emitter.municipio,
        nome: emitter.nome,
        numero: emitter.numero,
        telefone: emitter.telefone,
        uf: emitter.uf,
      },
      numeroSequencia: baseCCeData.retEvento.infEvento.nSeqEvento,
      versaoEvento: baseCCeData.evento.infEvento.verEvento,
    };
  }
}
exports.CCeProcessor = CCeProcessor;
