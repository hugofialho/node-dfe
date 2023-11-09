import { TEnviNFe, TNFe } from "../schema";
import { Configuracoes, NFeDocumento } from "../interface";
/**
 * Classe para processamento do DANFE em HTML a partir do XML do Lote
 * Gera o DANFE com a marca dagua 'SEM VALOR FISCAL'
 */
export declare class DanfeSemValorFiscalProcessor {
    private configuracoes;
    private enviaProcessor;
    constructor(configuracoes: Configuracoes);
    DocumentoToHtml(documento: NFeDocumento, emitenteImageUrl: string): Promise<string>;
    getTemplateData(enviNFe: TEnviNFe, emitenteImageUrl: string): {
        valor_fiscal: boolean;
        marca_dagua: string;
        emitenteImageUrl: string;
        operacao: import("../schema").TNFeInfNFeIdeTpNF;
        natureza: string;
        numero: string;
        serie: string;
        chave: string;
        codigo_barras: string;
        protocolo: string;
        data_protocolo: string;
        emitente: {
            inscricao_nacional: string | undefined;
            ie: string;
            ie_st: string;
            nome: string;
            fantasia: string;
            endereco: string;
            numero: string;
            complemento: string;
            bairro: string;
            municipio: string;
            uf: import("../schema").TUfEmi;
            cep: string;
            telefone: string;
        };
        destinatario: {
            inscricao_nacional: string | undefined;
            ie: string;
            nome: string;
            endereco: string;
            numero: string;
            complemento: string;
            bairro: string;
            municipio: string;
            uf: import("../schema").TUf;
            cep: string;
            telefone: string;
        };
        data_emissao: string;
        data_saida: string;
        hora_saida: string;
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
        transportador: {
            nome: string;
            inscricao_nacional: string;
            endereco: string;
            municipio: string;
            uf: import("../schema").TUf;
            ie: string;
        } | null;
        volume: {
            quantidade: string;
            especie: string;
            marca: string;
            numeracao: string;
            pesoBruto: string;
            pesoLiquido: string;
        } | null;
        informacoes_fisco: string;
        informacoes_complementares: string;
        modalidade_frete: import("../schema").TNFeInfNFeTranspModFrete;
        modalidade_frete_texto: string;
        itens: {
            codigo: string;
            descricao: string;
            ncm: string;
            cst: any;
            cfop: string;
            unidade: string;
            quantidade: string;
            valor: string;
            total: string;
            base_calculo: string;
            icms: string;
            porcentagem_icms: string;
            ipi: string;
            porcentagem_ipi: string;
            informacoes_produto: string;
        }[];
        exibe_ipi: boolean;
        duplicatas: {
            numero: string;
            vencimento: string;
            valor: string;
        }[] | null;
    };
    getEmitente(nfe: TNFe): {
        inscricao_nacional: string | undefined;
        ie: string;
        ie_st: string;
        nome: string;
        fantasia: string;
        endereco: string;
        numero: string;
        complemento: string;
        bairro: string;
        municipio: string;
        uf: import("../schema").TUfEmi;
        cep: string;
        telefone: string;
    };
    getDestinatario(nfe: TNFe): {
        inscricao_nacional: string | undefined;
        ie: string;
        nome: string;
        endereco: string;
        numero: string;
        complemento: string;
        bairro: string;
        municipio: string;
        uf: import("../schema").TUf;
        cep: string;
        telefone: string;
    };
    getTransportador(nfe: TNFe): {
        nome: string;
        inscricao_nacional: string;
        endereco: string;
        municipio: string;
        uf: import("../schema").TUf;
        ie: string;
    } | null;
    getVolume(nfe: TNFe): {
        quantidade: string;
        especie: string;
        marca: string;
        numeracao: string;
        pesoBruto: string;
        pesoLiquido: string;
    } | null;
    getItens(nfe: TNFe): {
        codigo: string;
        descricao: string;
        ncm: string;
        cst: any;
        cfop: string;
        unidade: string;
        quantidade: string;
        valor: string;
        total: string;
        base_calculo: string;
        icms: string;
        porcentagem_icms: string;
        ipi: string;
        porcentagem_ipi: string;
        informacoes_produto: string;
    }[];
    getExibeIPI(nfe: TNFe): boolean;
    getDuplicatas(nfe: TNFe): {
        numero: string;
        vencimento: string;
        valor: string;
    }[] | null;
    getValueByTag(theObject: any, tag: string): any;
}
