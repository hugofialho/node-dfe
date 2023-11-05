import { readFileSync, writeFileSync } from "fs";
import { CCeXml } from "../src/factory/interface/cce";
import { CCeProcessor } from "../src/factory/processor/cceProcessor";
import { TNfeProc } from "../src/factory/schema";
describe("Test coverage for the 'Carta de Correção' module", () => {
  const cceXml = readFileSync("tests/assets/cce-example.xml", "utf8");
  const nfeXml = readFileSync("tests/assets/nfe-example.xml", "utf-8");
  const cceProcessor = new CCeProcessor();

  const mockCCeXmlObject: CCeXml = {
    procEventoNFe: {
      evento: {
        infEvento: {
          chNFe: "",
          CNPJ: "00.000.000/0000-00",
          cOrgao: "1",
          detEvento: {
            descEvento: "Carta de Correcao",
            xCorrecao:
              "No Item 3 Onde esta Serie 000214624-02 leia-se Serie 000214618-56",
            xCondUso: "",
          },
          dhEvento: "2023-11-02T10:46:22-03:00",
          nSeqEvento: "1",
          tpAmb: "1",
          tpEvento: "110110",
          verEvento: "1.00",
        },
      },
      retEvento: {
        infEvento: {
          CNPJDest: "00.000.000/0000-00",
          chNFe: "35170202500781000109550010000002881000000005",
          cOrgao: "35",
          cStat: "135",
          dhRegEvento: "2023-11-02T10:46:22-03:00",
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

  const mockNfeXmlObject = {
    NFe: {
      infNFe: {
        dest: {
          xNome: "Mock Company",
          enderDest: {},
        },
        emit: {
          enderEmit: {
            CEP: "12345-678",
            nro: "10",
            xBairro: "Mock neighborhood",
            xLgr: "Mock address",
            xMun: "Mock city",
            UF: "SP",
          },
          IE: "123456789",
          xFant: "Mock Company",
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
      cnpj: mockCCeXmlObject.procEventoNFe.retEvento.infEvento.CNPJDest,
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
    writeFileSync("cce.html", html);
  });
});
