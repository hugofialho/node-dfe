import { RetornoProcessamentoNF, Configuracoes, NFeBase } from "../interface/nfe";
/**
 * Classe para processamento de NFe/NFCe
 */
export declare class EnviaProcessor {
    private configuracoes;
    private soapAutorizacao;
    private schemaXsdLote;
    constructor(configuracoes: Configuracoes);
    /**
     * Metodo para realizar o processamento de documento(s) do tipo 55 ou 65
     * @param documento Array de documentos modelo 55 ou 1 documento modelo 65
     * @param assincrono Boolean para definir se a execução sera sincrona ou assincrona, por padrao === sincrona!
     */
    executar(documento: NFeBase, assincrono?: boolean): Promise<RetornoProcessamentoNF>;
    /**
     * Metodo para gerar o XML do lote da NFe tipo 55
     * @param documento Array de documentos modelo 55
     */
    geraLoteXML(documento: NFeBase): Promise<RetornoProcessamentoNF>;
    private configuraUrlsSefaz;
    private appendQRCodeXML;
    transmitirXml(xmlLote: string, nfeObj: Object): Promise<RetornoProcessamentoNF>;
    private enviarNF;
    private gerarXmlLote;
    private gerarXml;
    private gerarChaveNF;
    private obterDigitoVerificador;
    private gerarQRCodeNFCeOnline;
    private gerarQRCodeNFCeOffline;
    private gerarNFe;
    private gerarNFCe;
    private getIde;
    private getNFref;
    private getEmit;
    private getEnderEmit;
    private getEnderDest;
    private getDest;
    private getDet;
    private getDetProd;
    private getDetImposto;
    private getImpostoIcms;
    private getImpostoISSQN;
    private getImpostoIPI;
    private getImpostoII;
    private getImpostoPIS;
    private getImpostoCOFINS;
    private getImpostoPISST;
    private getImpostoCOFINSST;
    private getImpostoDevolucao;
    private getIcmsUfDest;
    private getTotal;
    private getTransp;
    private getTransportadora;
    private getVolumes;
    private getCobr;
    private getDetalheCobranca;
    private getPag;
    private getDetalhamentoPagamentos;
    private getDetalhamentoCartao;
    private getIntermediador;
    private getInfoAdic;
    private getResponsavelTecnico;
    private gerarHashCSRT;
}
