import { RetornoProcessamentoNF, NFCeDocumento, NFeDocumento, Configuracoes } from "../interface/nfe";
import { Evento } from "../interface";
import { Inutilizar } from "../interface/inutilizacao";
/**
 * Classe para processamento de NFe/NFCe
 */
export declare class NFeProcessor {
    private configuracoes;
    private retornoProcessor;
    private enviaProcessor;
    private eventoProcessor;
    private inutlizacaoProcessor;
    constructor(configuracoes: Configuracoes);
    /**
     * Metodo para realizar o processamento de documento(s) do tipo 55 ou 65 de forma sincrona
     * @param documento Array de documentos modelo 55 ou 1 documento modelo 65
     */
    processarDocumento(documento: NFeDocumento | NFCeDocumento): Promise<RetornoProcessamentoNF>;
    executar(documento: NFeDocumento | NFCeDocumento): Promise<any>;
    NFCeAssinaTransmite(xml: string): Promise<any>;
    inutilizarNumeracao(dados: Inutilizar): Promise<any>;
    gerarEvento(evento: Evento): Promise<any>;
    processarXmlContingencia(xml: string): Promise<any>;
}
