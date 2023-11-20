export declare type CCeXml = {
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
        retEvento: {
            infEvento: {
                CNPJDest: string;
                chNFe: string;
                cOrgao: string;
                cStat: string;
                dhRegEvento: string;
                nProt: string;
                nSeqEvento: string;
                tpAmb: string;
                tpEvento: string;
                verAplic: string;
                xEvento: string;
                xMotivo: string;
            };
        };
    };
};
export declare type CCeTemplateData = {
    emitenteImageUrl: string;
    numero: string;
    serie: string;
    chave: string;
    codigo_barras: string;
    correcao: string;
    destinatario: any;
    emitente: any;
    numeroSequencia: string;
    versaoEvento: string;
};
