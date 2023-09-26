import { TNfeProc } from "../../schema";
import { formataChave, formataData, formataHora, formataInscricaoNacional, formataMoeda } from "./formata";
import { XmlHelper } from '../../xmlHelper';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

const TEMPLATE_DANFE = __dirname + '/danfe-template.hbs'

/**
 * Classe para processamento do DANFE em PDF
 */
export class DanfeProcessor {

  constructor() { }

  async xmlStringToPdf(xml: string) {
    const xmlAsJson:any = XmlHelper.deserializeXml(xml);
    const nfeProc: TNfeProc = xmlAsJson.nfeProc;
    const templateData = this.getTemplateData(nfeProc);
    const html = this.renderHtml(templateData);
    return html;
  }

  renderHtml(data: any) {
    handlebars.registerHelper('ifCond', function (v1: any, v2: any, options: any) {
      if (v1.length > v2) {
        return options.fn()
      }
      return options.inverse()
    })

    const template = fs.readFileSync(TEMPLATE_DANFE, 'utf8')
    return handlebars.compile(template)(data)
  }

  getTemplateData(nfeProc: TNfeProc) {
    const ide = nfeProc.NFe.infNFe.ide;
    const emit = nfeProc.NFe.infNFe.emit;
    const dest = nfeProc.NFe.infNFe.dest;
    const ICMSTot =nfeProc.NFe.infNFe.total.ICMSTot;
    const infProt = nfeProc.protNFe.infProt;

    var data = {
      operacao: ide.tpNF,
      natureza: ide.natOp,
      numero: ide.nNF,
      serie: ide.serie,
      chave: formataChave(infProt.chNFe),
      protocolo: infProt.nProt,
      data_protocolo: formataData(infProt.dhRecbto) + ' ' + formataHora(infProt.dhRecbto),
      emitente: {
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
        cep: emit.enderEmit.CEP,
        telefone: emit.enderEmit.fone,
      },
      destinatario: {
        inscricao_nacional: formataInscricaoNacional(dest.CPF || dest.CNPJ),
        ie: dest.IE,
        nome: dest.xNome,
        endereco: dest.enderDest.xLgr,
        numero: dest.enderDest.nro,
        complemento: dest.enderDest.xCpl,
        bairro: dest.enderDest.xBairro,
        municipio: dest.enderDest.xMun,
        uf: dest.enderDest.UF,
        cep: dest.enderDest.CEP,
        telefone: dest.enderDest.fone,
      },
      data_emissao: formataData(ide.dhEmi),
      data_saida: formataData(ide.dhSaiEnt),
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
      // transportador: Object.assign(dadosEntidade(nfe.transportador()), endereco(nfe.transportador())),
      // informacoes_fisco: nfe.informacoesFisco(),
      // informacoes_complementares: nfe.informacoesComplementares(),
      // observacao: observacoes(nfe),
      // modalidade_frete: nfe.modalidadeFrete(),
      // modalidade_frete_texto: nfe.modalidadeFreteTexto(),
      // itens: itens(nfe),
      // duplicatas: duplicatas(nfe),
      // valor_ii: formataMoeda(nfe.valorII(), 2),
      // valor_pis: formataMoeda(nfe.valorPIS(), 2),
      // valor_cofins: formataMoeda(nfe.valorCOFINS(), 2),
      // codigo_barras: nfe.chave(),
      // valor_combate_pobreza: formataMoeda(nfe.valorCombatePobreza(), 2),
      // valor_icms_uf_remetente: formataMoeda(nfe.valorIcmsUfRemetente(), 2),
      // valor_icms_uf_destinatario: formataMoeda(nfe.valorIcmsUfDestinatario(), 2),
      // storeID
    }

    // if (nfe.transporte().volume()) {
    //   let volume = nfe.transporte().volume()
    //   data.volume_quantidade = formataMoeda(volume.quantidadeVolumes())
    //   data.volume_especie = volume.especie()
    //   data.volume_marca = volume.marca()
    //   data.volume_numeracao = volume.numeracao()
    //   data.volume_pesoBruto = formataMoeda(volume.pesoBruto())
    //   data.volume_pesoLiquido = formataMoeda(volume.pesoLiquido())
    // }

    // if (nfe.transporte().veiculo()) {
    //   data.veiculo_placa = nfe.transporte().veiculo().placa()
    //   data.veiculo_placa_uf = nfe.transporte().veiculo().uf()
    //   data.veiculo_antt = nfe.transporte().veiculo().antt()
    // }

    // if (nfe.servico()) {
    //   data.total_servico = formataMoeda(nfe.servico().valorTotalServicoNaoIncidente())
    //   data.total_issqn = formataMoeda(nfe.servico().valorTotalISS())
    //   data.base_calculo_issqn = formataMoeda(nfe.servico().baseCalculo())
    // }

    return data
  }

}