import { readFileSync } from "fs";
import { compile } from "handlebars";
import { CCeTemplateData, CCeXml } from "../interface/cce";
import { TNfeProc } from "../schema";
import { mascaraCNPJ } from "../utils/formata";
import { XmlHelper } from "../xmlHelper";
import { DanfeProcessor } from "./danfeProcessor";
import path = require("path");

const TEMPLATE_CCE = path.join(__dirname, "..", "templates/cce.hbs");

/**
 * Classe para processamento da CCe em HTML
 */
export class CCeProcessor {
  public async xmlStringToHtml({
    cceXml,
    nfeXml,
  }: {
    cceXml: string;
    nfeXml: string;
  }): Promise<string> {
    const template = readFileSync(TEMPLATE_CCE, "utf-8");
    const cceXmlObject = XmlHelper.deserializeXml(cceXml) as unknown as CCeXml;
    const nfeXmlObject = XmlHelper.deserializeXml(nfeXml) as unknown as {
      nfeProc: TNfeProc;
    };
    const html = compile(template)(
      this.getTemplateData({
        cceXmlObject,
        nfeXmlObject: nfeXmlObject.nfeProc,
      })
    );

    return html;
  }

  private getTemplateData({
    cceXmlObject,
    nfeXmlObject,
  }: {
    cceXmlObject: CCeXml;
    nfeXmlObject: TNfeProc;
  }): CCeTemplateData {
    const danfeProcessor = new DanfeProcessor();

    const baseCCeData = cceXmlObject.procEventoNFe;

    const emitente = danfeProcessor.getEmitente(nfeXmlObject);
    const destinatario = danfeProcessor.getDestinatario(nfeXmlObject);
    return {
      chaveAcesso: baseCCeData.retEvento.infEvento.chNFe,
      correcao: baseCCeData.evento.infEvento.detEvento.xCorrecao,
      destinatario: {
        nome: destinatario.nome,
        cnpj: mascaraCNPJ(baseCCeData.retEvento.infEvento.CNPJDest),
      },
      emitente: {
        bairro: emitente.bairro,
        cep: emitente.cep,
        cnpj: mascaraCNPJ(baseCCeData.evento.infEvento.CNPJ),
        endereco: emitente.endereco,
        fantasia: emitente.fantasia,
        ie: emitente.ie,
        municipio: emitente.municipio,
        numero: emitente.numero,
        uf: emitente.uf,
      },
      numeroSequencia:
        baseCCeData.retEvento.infEvento.nSeqEvento,
      versaoEvento: baseCCeData.evento.infEvento.verEvento,
    };
  }
}
