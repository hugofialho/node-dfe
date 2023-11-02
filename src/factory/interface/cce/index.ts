export type CCeXml = {
  procEventoNFe: {
    evento: {
      infEvento: {
        chNFe: string;
        CNPJ: string;
        cOrgao: string;
        detEvento: {
          descEvento: string;
          xCorrecao: string;
          xCondUso: string;
        };
        dhEvento: string;
        nSeqEvento: string;
        tpAmb: string;
        tpEvento: string;
        verEvento: string;
      };
    };
    retEvento?: {
      infEvento: {
        tpAmb: string;
        verAplic: string;
        cOrgao: string;
        cStat: string;
        xMotivo: string;
        chNFe: string;
        tpEvento: string;
        xEvento: string;
        nSeqEvento: string;
        CNPJDest: string;
        dhRegEvento: string;
        nProt: string;
      };
    };
  };
};

export type CCeTemplateData = {
  cnpj: string;
  correction: string;
  sequenceNumber: string;
  ie: string;
  receiver: {
    cnpj: string;
    name: string;
  };
};
