import { TNfeProc } from "../../schema";
/**
 * Classe para processamento do DANFE em PDF
 */
export declare class DanfeProcessor {
    constructor();
    xmlStringToPdf(xml: string): Promise<string>;
    renderHtml(data: any): string;
    getTemplateData(nfeProc: TNfeProc): {
        operacao: import("../../schema").TNFeInfNFeIdeTpNF;
        natureza: string;
        numero: string;
        serie: string;
        chave: string;
        protocolo: string;
        data_protocolo: string;
        emitente: {
            inscricao_nacional: string;
            ie: string;
            ie_st: string;
            nome: string;
            fantasia: string;
            endereco: string;
            numero: string;
            complemento: string;
            bairro: string;
            municipio: string;
            uf: import("../../schema").TUfEmi;
            cep: string;
            telefone: string;
        };
        destinatario: {
            inscricao_nacional: string;
            ie: string;
            nome: string;
            endereco: string;
            numero: string;
            complemento: string;
            bairro: string;
            municipio: string;
            uf: import("../../schema").TUf;
            cep: string;
            telefone: string;
        };
        data_emissao: string;
        data_saida: string;
        base_calculo_icms: string;
        imposto_icms: string;
        base_calculo_icms_st: string;
        imposto_icms_st: string;
        imposto_tributos: string;
        total_produtos: string;
        total_frete: string;
        total_seguro: string;
        total_desconto: string;
        total_despesas: string;
        total_ipi: string;
        total_nota: string;
    };
}
