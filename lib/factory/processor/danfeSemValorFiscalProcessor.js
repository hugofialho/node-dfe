"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanfeSemValorFiscalProcessor = void 0;
const formata_1 = require("../utils/formata");
const xmlHelper_1 = require("../xmlHelper");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const enviaProcessor_1 = require("./enviaProcessor");
const TEMPLATE_DANFE = path.join(__dirname, "..", "templates/danfe.hbs");
/**
 * Classe para processamento do DANFE em HTML a partir do XML do Lote
 * Gera o DANFE com a marca dagua 'SEM VALOR FISCAL'
 */
class DanfeSemValorFiscalProcessor {
    constructor(configuracoes) {
        this.configuracoes = configuracoes;
        this.enviaProcessor = null;
        this.enviaProcessor = new enviaProcessor_1.EnviaProcessor(this.configuracoes);
    }
    async DocumentoToHtml(documento, emitenteImageUrl) {
        documento.docFiscal.isContingenciaOffline = true;
        const result = await this.enviaProcessor.geraLoteXML(documento);
        if (!result.success) {
            throw result.error;
        }
        const xml = result.retornoContingenciaOffline.xml_gerado;
        const xmlAsJson = xmlHelper_1.XmlHelper.deserializeXml(xml);
        const enviNFe = xmlAsJson.enviNFe;
        const template = fs.readFileSync(TEMPLATE_DANFE, "utf8");
        const templateData = this.getTemplateData(enviNFe, emitenteImageUrl);
        const html = handlebars.compile(template)(templateData);
        return html;
    }
    getTemplateData(enviNFe, emitenteImageUrl) {
        const nfe = Array.isArray(enviNFe.NFe) ? enviNFe.NFe[0] : enviNFe.NFe;
        const ide = nfe.infNFe.ide;
        const transp = nfe.infNFe.transp;
        const ICMSTot = nfe.infNFe.total.ICMSTot;
        const infAdic = nfe.infNFe.infAdic;
        var data = {
            valor_fiscal: false,
            marca_dagua: 'SEM VALOR FISCAL',
            emitenteImageUrl,
            operacao: ide.tpNF,
            natureza: ide.natOp,
            numero: ide.nNF,
            serie: ide.serie,
            chave: '',
            codigo_barras: '',
            protocolo: '',
            data_protocolo: '',
            emitente: this.getEmitente(nfe),
            destinatario: this.getDestinatario(nfe),
            data_emissao: (0, formata_1.formataData)(ide.dhEmi),
            data_saida: (0, formata_1.formataData)(ide.dhSaiEnt),
            hora_saida: (0, formata_1.formataHora)(ide.dhSaiEnt),
            base_calculo_icms: (0, formata_1.formataMoeda)(ICMSTot.vBC, 2),
            imposto_icms: (0, formata_1.formataMoeda)(ICMSTot.vICMS, 2),
            base_calculo_icms_st: (0, formata_1.formataMoeda)(ICMSTot.vBCST, 2),
            imposto_icms_st: (0, formata_1.formataMoeda)(ICMSTot.vST, 2),
            imposto_tributos: (0, formata_1.formataMoeda)(ICMSTot.vTotTrib, 2),
            total_produtos: (0, formata_1.formataMoeda)(ICMSTot.vProd, 2),
            total_frete: (0, formata_1.formataMoeda)(ICMSTot.vFrete, 2),
            total_seguro: (0, formata_1.formataMoeda)(ICMSTot.vSeg, 2),
            total_desconto: (0, formata_1.formataMoeda)(ICMSTot.vDesc, 2),
            total_despesas: (0, formata_1.formataMoeda)(ICMSTot.vOutro, 2),
            total_ipi: (0, formata_1.formataMoeda)(ICMSTot.vIPI, 2),
            total_nota: (0, formata_1.formataMoeda)(ICMSTot.vNF, 2),
            transportador: this.getTransportador(nfe),
            volume: this.getVolume(nfe),
            informacoes_fisco: infAdic.infAdFisco,
            informacoes_complementares: infAdic.infCpl,
            modalidade_frete: transp.modFrete,
            modalidade_frete_texto: transp.modFrete === "0"
                ? "EMITENTE"
                : transp.modFrete === "1"
                    ? "DESTINATÁRIO"
                    : "",
            itens: this.getItens(nfe),
            exibe_ipi: this.getExibeIPI(nfe),
            duplicatas: this.getDuplicatas(nfe),
        };
        return data;
    }
    getEmitente(nfe) {
        const emit = nfe.infNFe.emit;
        return {
            inscricao_nacional: (0, formata_1.formataInscricaoNacional)(emit.CNPJ),
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
            cep: (0, formata_1.formataCEP)(emit.enderEmit.CEP),
            telefone: (0, formata_1.formataTelefone)(emit.enderEmit.fone),
        };
    }
    getDestinatario(nfe) {
        const dest = nfe.infNFe.dest;
        return {
            inscricao_nacional: (0, formata_1.formataInscricaoNacional)(dest.CPF || dest.CNPJ),
            ie: dest.IE,
            nome: dest.xNome,
            endereco: dest.enderDest.xLgr,
            numero: dest.enderDest.nro,
            complemento: dest.enderDest.xCpl,
            bairro: dest.enderDest.xBairro,
            municipio: dest.enderDest.xMun,
            uf: dest.enderDest.UF,
            cep: (0, formata_1.formataCEP)(dest.enderDest.CEP),
            telefone: (0, formata_1.formataTelefone)(dest.enderDest.fone),
        };
    }
    getTransportador(nfe) {
        const transporta = nfe.infNFe.transp.transporta;
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
    getVolume(nfe) {
        const vol = nfe.infNFe.transp.vol;
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
    getItens(nfe) {
        const det = nfe.infNFe.det;
        const dets = det instanceof Array ? det : [det];
        return dets.map((i) => ({
            codigo: i.prod.cProd,
            descricao: i.prod.xProd,
            ncm: i.prod.NCM,
            cst: this.getValueByTag(i.imposto.ICMS, "CSOSN") ||
                this.getValueByTag(i.imposto.ICMS, "CST"),
            cfop: i.prod.CFOP,
            unidade: i.prod.uCom,
            quantidade: (0, formata_1.formataMoeda)(i.prod.qCom, 2),
            valor: (0, formata_1.formataMoeda)(i.prod.vUnCom, 2),
            total: (0, formata_1.formataMoeda)(i.prod.vProd, 2),
            base_calculo: (0, formata_1.formataMoeda)(this.getValueByTag(i.imposto.ICMS, "vBC"), 2),
            icms: (0, formata_1.formataMoeda)(this.getValueByTag(i.imposto.ICMS, "vICMS"), 2),
            porcentagem_icms: (0, formata_1.formataMoeda)(this.getValueByTag(i.imposto.ICMS, "pICMS"), 2),
            ipi: (0, formata_1.formataMoeda)(this.getValueByTag(i.imposto.IPI, "vIPI"), 2),
            porcentagem_ipi: (0, formata_1.formataMoeda)(this.getValueByTag(i.imposto.IPI, "pIPI"), 2),
            informacoes_produto: i.infAdProd,
        }));
    }
    getExibeIPI(nfe) {
        const det = nfe.infNFe.det;
        const dets = det instanceof Array ? det : [det];
        return dets
            .map((i) => !!this.getValueByTag(i.imposto.IPI, "vIPI"))
            .reduce((oculta, vIPI) => oculta || vIPI, false);
    }
    getDuplicatas(nfe) {
        var _a;
        let dup = (_a = nfe.infNFe.cobr) === null || _a === void 0 ? void 0 : _a.dup;
        if (!dup)
            return null;
        if (!(dup instanceof Array)) {
            dup = [dup];
        }
        return dup.map((d) => ({
            numero: d.nDup,
            vencimento: d.dVenc,
            valor: d.vDup,
        }));
    }
    getValueByTag(theObject, tag) {
        if (theObject instanceof Array) {
            for (var i = 0; i < theObject.length; i++) {
                const result = this.getValueByTag(theObject[i], tag);
                if (result) {
                    return result;
                }
            }
        }
        else if (theObject instanceof Object) {
            for (var prop in theObject) {
                const value = theObject[prop];
                if (value instanceof Object || value instanceof Array) {
                    const result = this.getValueByTag(value, tag);
                    if (result) {
                        return result;
                    }
                }
                else if (prop === tag) {
                    return value;
                }
            }
        }
    }
}
exports.DanfeSemValorFiscalProcessor = DanfeSemValorFiscalProcessor;
