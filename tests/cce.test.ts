import { readFileSync, writeFileSync } from "fs";
import { CCeXml } from "../src/factory/interface/cce";
import { CCeProcessor } from "../src/factory/processor/cceProcessor";
import { TNfeProc } from "../src/factory/schema";
describe("Test coverage for the 'Carta de Correção' module", () => {
  const cceXml = readFileSync("tests/assets/cce-example.xml", "utf8");
  const nfeXml = readFileSync("tests/assets/nfe-example.xml", "utf-8");
  const cceProcessor = new CCeProcessor();

  // data retrieved from the cce-example.xml fil;
  const mockCCeXmlObject: CCeXml = {
    procEventoNFe: {
      evento: {
        infEvento: {
          chNFe: "35170202500781000109550010000002881000000005",
          CNPJ: "02.500.781/0001-09",
          cOrgao: "35",
          detEvento: {
            descEvento: "Carta de Correcao",
            xCorrecao:
              "No Item 3 Onde esta Serie 000214624-02 leia-se Serie 000214618-56",
            xCondUso: "A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.",
          },
          dhEvento: "2017-02-28T10:46:22-03:00",
          nSeqEvento: "1",
          tpAmb: "1",
          tpEvento: "110110",
          verEvento: "1.00",
        },
      },
      retEvento: {
        infEvento: {
          CNPJDest: "53.485.215/0001-06",
          chNFe: "35170202500781000109550010000002881000000005",
          cOrgao: "35",
          cStat: "135",
          dhRegEvento: "2017-02-28T10:46:25-03:00",
          nProt: "135170128223566",
          nSeqEvento: "1",
          tpAmb: "1",
          tpEvento: "110110",
          verAplic: "SP_EVENTOS_PL_100",
          xEvento: "Carta de Correção registrada",
          xMotivo: "Evento registrado e vinculado a NF-e",
        },
      },
    },
  };

  // data retrieved from the nfe-example.xml;
  const mockNfeXmlObject = {
    NFe: {
      infNFe: {
        dest: {
          xNome: "DISTRIB. RIBEIRO E ROSA EIRELI - ME",
          enderDest: {},
        },
        emit: {
          enderEmit: {
            CEP: "38414-314",
            nro: "580",
            xBairro: "LUIZOTE",
            xLgr: "RUA PAULO LUIS ROTELLE",
            xMun: "UBERLANDIA",
            UF: "MG",
          },
          IE: "7023103750022",
          xFant: "DISTRIBUIDORA VITORIA",
        },
      },
    },
  } as TNfeProc;

  it("should correctly format the template data", () => {


    const templateData = cceProcessor["getTemplateData"]({
      cceXmlObject: mockCCeXmlObject,
      nfeXmlObject: mockNfeXmlObject,
    });
    expect(templateData.chaveAcesso).toBe(
      mockCCeXmlObject.procEventoNFe.retEvento.infEvento.chNFe
    );
    expect(templateData.correcao).toBe(
      mockCCeXmlObject.procEventoNFe.evento.infEvento.detEvento.xCorrecao
    );
    expect(templateData.destinatario).toEqual({
      cnpj: mockCCeXmlObject.procEventoNFe.retEvento.infEvento.CNPJDest,
      nome: mockNfeXmlObject.NFe.infNFe.dest.xNome,
    });
    expect(templateData.emitente).toEqual({
      bairro: mockNfeXmlObject.NFe.infNFe.emit.enderEmit.xBairro,
      cep: mockNfeXmlObject.NFe.infNFe.emit.enderEmit.CEP,
      cnpj: mockCCeXmlObject.procEventoNFe.evento.infEvento.CNPJ,
      endereco: mockNfeXmlObject.NFe.infNFe.emit.enderEmit.xLgr,
      fantasia: mockNfeXmlObject.NFe.infNFe.emit.xFant,
      ie: mockNfeXmlObject.NFe.infNFe.emit.IE,
      municipio: mockNfeXmlObject.NFe.infNFe.emit.enderEmit.xMun,
      numero: mockNfeXmlObject.NFe.infNFe.emit.enderEmit.nro,
      uf: mockNfeXmlObject.NFe.infNFe.emit.enderEmit.UF,
    });
    expect(templateData.numeroSequencia).toBe(
      mockCCeXmlObject.procEventoNFe.evento.infEvento.nSeqEvento
    );
  });
  it("should correctly convert the XML to HTML", async () => {
    const html = await cceProcessor.xmlStringToHtml({
      cceXml,
      nfeXml,
    });

    expect(html).toMatch(/35170202500781000109550010000002881000000005/);
    expect(html).toMatch(/02.500.781\/0001-09/);
    expect(html).toMatch(/o Item 3 Onde esta Serie 000214624-02  leia-se  Serie  000214618-56/)
    expect(html).toMatch(new RegExp("53.485.215/0001-06"));
    expect(html).toMatch(/DISTRIBUIDORA VITORIA/);
    expect(html).toMatch(/7023103750022/);
  });
});
