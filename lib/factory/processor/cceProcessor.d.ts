/**
 * Classe para processamento da CCe em HTML
 */
export declare class CCeProcessor {
    xmlStringToHtml(cceXml: string, nfeXml: string, emitenteImageUrl: string): Promise<string>;
    private getTemplateData;
}
