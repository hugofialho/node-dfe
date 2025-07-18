import fetch, { RequestInit } from 'node-fetch'
import * as https from 'https';
import { XmlHelper } from '../xmlHelper'
import { RetornoProcessamento } from '../interface/nfe'
import { findKey } from '../utils/utils';

export interface WebProxy {
    host: string
    port: string
    isHttps?: boolean
    auth?: {
        username: string
        password: string
    }
}

function proxyToUrl(pr: WebProxy): string {
    const server = `${pr.host}:${pr.port}`
    let auth = null;
    let final = pr.isHttps ? 'https://' : 'http://'
    if(pr.auth) {
        final = `${final}${pr.auth.username}:${pr.auth.password}@`
    }

    return `${final}${server}`
}

export abstract class WebServiceHelper {

    public static buildSoapEnvelope(xml: string, soapMethod: string) {
        let soapEnvelopeObj = {
            '$': { 
                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                    'xmlns:soap12': 'http://www.w3.org/2003/05/soap-envelope',
                 },
                'soap12:Body': {
                    'nfeDadosMsg': {
                        '$': {
                            'xmlns': soapMethod
                        },
                        _: '[XML]'
                    }
                }
            };

        let soapEnvXml = XmlHelper.serializeXml(soapEnvelopeObj, 'soap12:Envelope');
        return soapEnvXml.replace('[XML]', xml);
    }

    public static async makeSoapRequest(xml: string, cert: any, soap: any,  proxy?: WebProxy) {
        let result = <RetornoProcessamento>{ xml_enviado: xml };
        try {
            const headers: HeadersInit = {
                "Content-Type": `application/soap+xml; charset=utf-8; action="${soap.action}"`
            };
            const agent = new https.Agent({
                rejectUnauthorized: false,
                cert: cert.pem,
                key: cert.key,
            });
            const opts: RequestInit = {
                method: 'POST',
                headers,
                agent,
                body: this.buildSoapEnvelope(xml, soap.method),
            };

            const res = await fetch(soap.url, opts);
            result.status = res.status;
            result.xml_recebido = await res.text();

            if (result.status == 200) {
                result.success = true;
                let retorno = XmlHelper.deserializeXml(result.xml_recebido, {explicitArray: false});
                if (retorno) {
                    result.data = findKey(retorno, 'nfeResultMsg');
                }
            }
            return result;

        } catch (err: any) {
            result.success = false;
            result.error = err;
            return result;
        }
    }
}
