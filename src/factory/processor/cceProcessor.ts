import { readFileSync } from "fs";
import { CCeTemplateData, CCeXml } from "../interface/cce";
import { XmlHelper } from "../xmlHelper";
import { compile } from "handlebars";
import path = require("path");

const TEMPLATE_CCE = path.join(__dirname, "..", "templates/cce.hbs");

export class CCeProcessor {
  async xmlToHtml(xml: string): Promise<string> {
    const template = readFileSync(TEMPLATE_CCE, "utf-8");
    const xmlObject = XmlHelper.deserializeXml(xml) as unknown as CCeXml;
    const html = compile(template)(this.getTemplateData(xmlObject));

    return html;
  }

  private getTemplateData(xmlObject: CCeXml): CCeTemplateData {
    const info = xmlObject.procEventoNFe.evento.infEvento;
    return {
      cnpj: info.CNPJ,
      correction: info.detEvento.xCorrecao,
      sequenceNumber: info.nSeqEvento,
      ie: "",
      receiver: {
        cnpj: "",
        name: "",
      },
    };
  }
}
