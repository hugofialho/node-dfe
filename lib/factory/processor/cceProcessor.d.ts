/**
 * Classe para processamento da CCe em HTML
 */
export declare class CCeProcessor {
    xmlStringToHtml({ cceXml, nfeXml, }: {
        cceXml: string;
        nfeXml: string;
    }): Promise<string>;
    private getTemplateData;
}
