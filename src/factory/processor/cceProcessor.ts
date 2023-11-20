import { readFileSync } from "fs";
import { compile } from "handlebars";
import { CCeTemplateData, CCeXml } from "../interface/cce";
import { TNfeProc } from "../schema";
import { XmlHelper } from "../xmlHelper";
import { DanfeProcessor } from "./danfeProcessor";
import * as path from "path";

const TEMPLATE_CCE = path.join(__dirname, "..", "templates/cce.hbs");

/**
 * Classe para processamento da CCe em HTML
 */
export class CCeProcessor {
  public async xmlStringToHtml(
    cceXml: string,
    nfeXml: string, 
    emitenteImageUrl: string
  ): Promise<string> {
    const template = readFileSync(TEMPLATE_CCE, "utf-8");
    const cceXmlObject = XmlHelper.deserializeXml(cceXml) as unknown as CCeXml;
    const nfeXmlObject = XmlHelper.deserializeXml(nfeXml) as unknown as {
      nfeProc: TNfeProc;
    };
    const html = compile(template)(
      this.getTemplateData(
        cceXmlObject,
        nfeXmlObject.nfeProc, 
        emitenteImageUrl
      )
    );

    return html;
  }

  private getTemplateData(
    cceXmlObject: CCeXml,
    nfeXmlObject: TNfeProc, 
    emitenteImageUrl: string
    ): CCeTemplateData {
    const danfeProcessor = new DanfeProcessor();
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
