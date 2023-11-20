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
    chaveAcesso: string;
    correcao: string;
    destinatario: {
        cnpj: string;
        nome: string;
    };
    emitente: {
        bairro: string;
        cep: string;
        cnpj: string;
        endereco: string;
        fantasia: string;
        ie: string;
        municipio: string;
        nome: string;
        numero: string;
        telefone: string;
        uf: string;
    };
    numeroSequencia: string;
    versaoEvento: string;
};
