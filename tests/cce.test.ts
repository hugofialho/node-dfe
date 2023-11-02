import { readFileSync } from "fs";
import { CCeProcessor } from "../src/factory/processor/cceProcessor";
import { CCeXml } from "../src/factory/interface/cce";
describe("Test coverage for the 'Carta de Correção' module", () => {
  const xml = readFileSync("./assets/cce1.xml", "utf8");
  const cceProcessor = new CCeProcessor();

  it("should correctly format the template data", () => {
    const mockXmlObject: CCeXml = {
      procEventoNFe: {
        evento: {
          infEvento: {
            chNFe: "",
            CNPJ: "00000000000000",
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
      },
    };
    const mockInfo = mockXmlObject.procEventoNFe.evento.infEvento;

    const templateData = cceProcessor["getTemplateData"](mockXmlObject);
    expect(templateData.cnpj).toBe(mockInfo.CNPJ);
    expect(templateData.correction).toBe(mockInfo.detEvento.xCorrecao);
    expect(templateData.ie).toBe("1234");
    expect(templateData.receiver.cnpj).toBe("1234");
    expect(templateData.receiver.name).toBe("Name");
    expect(templateData.sequenceNumber).toBe("1");
  });
  it("should correctly convert the XML to HTML", async () => {
    const html = await cceProcessor.xmlToHtml(xml);
    console.log(html);
  });
});
