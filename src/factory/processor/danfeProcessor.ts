import { TNfeProc } from "../schema";
import {
  formataCEP,
  formataChave,
  formataData,
  formataHora,
  formataInscricaoNacional,
  formataMoeda,
  formataTelefone,
} from "../utils/formata";
import { XmlHelper } from "../xmlHelper";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

const TEMPLATE_DANFE = path.join(__dirname, "..", "templates/danfe.hbs");

/**
 * Classe para processamento do DANFE em HTML
 */
export class DanfeProcessor {
  constructor() {}

  async xmlStringToHtml(xml: string, emitenteImageUrl: string) {
    const xmlAsJson: any = XmlHelper.deserializeXml(xml);
    const nfeProc: TNfeProc = xmlAsJson.nfeProc;
    const template = fs.readFileSync(TEMPLATE_DANFE, "utf8");
    const templateData = this.getTemplateData(nfeProc, emitenteImageUrl);
    const html = handlebars.compile(template)(templateData);
    return html;
  }

  getTemplateData(nfeProc: TNfeProc, emitenteImageUrl: string) {
    const ide = nfeProc.NFe.infNFe.ide;
    const transp = nfeProc.NFe.infNFe.transp;
    const ICMSTot = nfeProc.NFe.infNFe.total.ICMSTot;
    const infProt = nfeProc.protNFe.infProt;
    const infAdic = nfeProc.NFe.infNFe.infAdic;

    var data = {
      emitenteImageUrl,
      operacao: ide.tpNF,
      natureza: ide.natOp,
      numero: ide.nNF,
      serie: ide.serie,
      chave: formataChave(infProt.chNFe),
      codigo_barras: infProt.chNFe,
      protocolo: infProt.nProt,
      data_protocolo:
        formataData(infProt.dhRecbto) + " " + formataHora(infProt.dhRecbto),
      emitente: this.getEmitente(nfeProc),
      destinatario: this.getDestinatario(nfeProc),
      data_emissao: formataData(ide.dhEmi),
      data_saida: formataData(ide.dhSaiEnt),
      hora_saida: formataHora(ide.dhSaiEnt),
      base_calculo_icms: formataMoeda(ICMSTot.vBC, 2),
      imposto_icms: formataMoeda(ICMSTot.vICMS, 2),
      base_calculo_icms_st: formataMoeda(ICMSTot.vBCST, 2),
      imposto_icms_st: formataMoeda(ICMSTot.vST, 2),
      imposto_tributos: formataMoeda(ICMSTot.vTotTrib, 2),
      total_produtos: formataMoeda(ICMSTot.vProd, 2),
      total_frete: formataMoeda(ICMSTot.vFrete, 2),
      total_seguro: formataMoeda(ICMSTot.vSeg, 2),
      total_desconto: formataMoeda(ICMSTot.vDesc, 2),
      total_despesas: formataMoeda(ICMSTot.vOutro, 2),
      total_ipi: formataMoeda(ICMSTot.vIPI, 2),
      total_nota: formataMoeda(ICMSTot.vNF, 2),
      transportador: this.getTransportador(nfeProc),
      volume: this.getVolume(nfeProc),

      informacoes_fisco: infAdic.infAdFisco,
      informacoes_complementares: infAdic.infCpl,
      modalidade_frete: transp.modFrete,
      modalidade_frete_texto:
        transp.modFrete === "0"
          ? "EMITENTE"
          : transp.modFrete === "1"
          ? "DESTINATÁRIO"
          : "",
      itens: this.getItens(nfeProc),
      exibe_ipi: this.getExibeIPI(nfeProc),
      duplicatas: this.getDuplicatas(nfeProc),
    };

    return data;
  }

  getEmitente(nfeProc: TNfeProc) {
    const emit = nfeProc.NFe.infNFe.emit;
    return {
      inscricao_nacional: formataInscricaoNacional(emit.CNPJ),
      ie: emit.IE,
      ie_st: emit.iEST,
      nome: emit.xNome,
      fantasia: emit.xFant,
      endereco: emit.enderEmit.xLgr,
      numero: emit.enderEmit.nro,
      complemento: emit.enderEmit.xCpl,
      bairro: emit.enderEmit.xBairro,
      municipio: emit.enderEmit.xMun,
      uf: emit.enderEmit.UF,
      cep: formataCEP(emit.enderEmit.CEP),
      telefone: formataTelefone(emit.enderEmit.fone),
    };
  }

  getDestinatario(nfeProc: TNfeProc) {
    const dest = nfeProc.NFe.infNFe.dest;
    return {
      inscricao_nacional: formataInscricaoNacional(dest.CPF || dest.CNPJ),
      ie: dest.IE,
      nome: dest.xNome,
      endereco: dest.enderDest.xLgr,
      numero: dest.enderDest.nro,
      complemento: dest.enderDest.xCpl,
      bairro: dest.enderDest.xBairro,
      municipio: dest.enderDest.xMun,
      uf: dest.enderDest.UF,
      cep: formataCEP(dest.enderDest.CEP),
      telefone: formataTelefone(dest.enderDest.fone),
    };
  }

  getTransportador(nfeProc: TNfeProc) {
    const transporta = nfeProc.NFe.infNFe.transp.transporta;
    return transporta
      ? {
          nome: transporta.xNome,
          inscricao_nacional: transporta.CNPJ,
          endereco: transporta.xEnder,
          municipio: transporta.xMun,
          uf: transporta.UF,
          ie: transporta.IE,
        }
      : null;
  }

  getVolume(nfeProc: TNfeProc) {
    const vol = nfeProc.NFe.infNFe.transp.vol;
    const vol0 = vol && vol.length > 0 ? vol[0] : null;
    return vol0
      ? {
          quantidade: vol0.qVol,
          especie: vol0.esp,
          marca: vol0.marca,
          numeracao: vol0.nVol,
          pesoBruto: vol0.pesoB,
          pesoLiquido: vol0.pesoL,
        }
      : null;
  }

  getItens(nfeProc: TNfeProc) {
    return nfeProc.NFe.infNFe.det.map((i) => ({
      codigo: i.prod.cProd,
      descricao: i.prod.xProd,
      ncm: i.prod.NCM,
      cst:
        this.getValueByTag(i.imposto.ICMS, "CSOSN") ||
        this.getValueByTag(i.imposto.ICMS, "CST"),
      cfop: i.prod.CFOP,
      unidade: i.prod.uCom,
      quantidade: formataMoeda(i.prod.qCom, 2),
      valor: formataMoeda(i.prod.vUnCom, 2),
      total: formataMoeda(i.prod.vProd, 2),
      base_calculo: formataMoeda(this.getValueByTag(i.imposto.ICMS, "vBC"), 2),
      icms: formataMoeda(this.getValueByTag(i.imposto.ICMS, "vICMS"), 2),
      porcentagem_icms: formataMoeda(
        this.getValueByTag(i.imposto.ICMS, "pICMS"),
        2
      ),
      ipi: formataMoeda(this.getValueByTag(i.imposto.IPI, "vIPI"), 2),
      porcentagem_ipi: formataMoeda(
        this.getValueByTag(i.imposto.IPI, "pIPI"),
        2
      ),
      informacoes_produto: i.infAdProd,
    }));
  }

  getExibeIPI(nfeProc: TNfeProc) {
    return nfeProc.NFe.infNFe.det
      .map((i) => !!this.getValueByTag(i.imposto.IPI, "vIPI"))
      .reduce((oculta, vIPI) => oculta || vIPI, false);
  }

  getDuplicatas(nfeProc: TNfeProc) {
    let dup = nfeProc.NFe.infNFe.cobr?.dup;
    if (!dup) return null;
    if (!(dup instanceof Array)) {
      dup = [dup];
    }

    return dup.map((d) => ({
      numero: d.nDup,
      vencimento: d.dVenc,
      valor: d.vDup,
    }));
  }

  getValueByTag(theObject: any, tag: string) {
    if (theObject instanceof Array) {
      for (var i = 0; i < theObject.length; i++) {
        const result: any = this.getValueByTag(theObject[i], tag);
        if (result) {
          return result;
        }
      }
    } else if (theObject instanceof Object) {
      for (var prop in theObject) {
        const value = theObject[prop];
        if (value instanceof Object || value instanceof Array) {
          const result: any = this.getValueByTag(value, tag);
          if (result) {
            return result;
          }
        } else if (prop === tag) {
          return value;
        }
      }
    }
  }
}
