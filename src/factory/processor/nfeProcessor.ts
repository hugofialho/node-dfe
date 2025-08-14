import {
  RetornoProcessamentoNF,
  NFCeDocumento,
  NFeDocumento,
  Configuracoes,
} from "../interface/nfe";
import { Evento } from "../interface";

import * as Utils from "../utils/utils";
import { RetornoProcessor } from "./retornoProcessor";
import { EnviaProcessor } from "./enviaProcessor";
import { EventoProcessor } from "./eventoProcessor";
import { InutilizaProcessor } from "./inutilizaProcessor";
import { Inutilizar } from "../interface/inutilizacao";

/**
 * Classe para processamento de NFe/NFCe
 */
export class NFeProcessor {
  private retornoProcessor: any = null;
  private enviaProcessor: any = null;
  private eventoProcessor: any = null;
  private inutlizacaoProcessor: any = null;

  constructor(private configuracoes: Configuracoes) {
    Utils.setConfigDefaultValues(this.configuracoes);
    this.retornoProcessor = new RetornoProcessor(this.configuracoes);
    this.enviaProcessor = new EnviaProcessor(this.configuracoes);
    this.eventoProcessor = new EventoProcessor(this.configuracoes);
    this.inutlizacaoProcessor = new InutilizaProcessor(this.configuracoes);
  }

  /**
   * Metodo para realizar o processamento de documento(s) do tipo 55 ou 65 de forma sincrona
   * @param documento Array de documentos modelo 55 ou 1 documento modelo 65
   */
  public async processarDocumento(documento: NFeDocumento | NFCeDocumento) {
    let result = <RetornoProcessamentoNF>await this.executar(documento);
    return result;
  }

  public async executar(documento: NFeDocumento | NFCeDocumento) {
    try {
      return await this.enviaProcessor.executar(documento);
    } catch (ex: any) {
      return <RetornoProcessamentoNF>{
        success: false,
        error: ex,
      };
    }
  }

  public async NFCeTransmite(xmlLote: string) {
    try {
      return await this.enviaProcessor.NFCeTransmite(xmlLote);
    } catch (ex: any) {
      return <RetornoProcessamentoNF>{
        success: false,
        error: ex,
      };
    }
  }

  public async NFCeAssinaTransmite(xml: string) {
    try {
      return await this.enviaProcessor.NFCeAssinaTransmite(xml);
    } catch (ex: any) {
      return <RetornoProcessamentoNF>{
        success: false,
        error: ex,
      };
    }
  }

  public async inutilizarNumeracao(dados: Inutilizar) {
    return await this.inutlizacaoProcessor.executar(dados);
  }

  public async gerarEvento(evento: Evento) {
    return await this.eventoProcessor.executar(evento);
  }

  public async processarXmlContingencia(xml: string) {
    return await this.enviaProcessor.transmitirXml(xml);
  }
}
