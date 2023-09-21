"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebServiceHelper = void 0;
const node_fetch_1 = require("node-fetch");
const https = require("https");
const xmlHelper_1 = require("../xmlHelper");
const utils_1 = require("../utils/utils");
function proxyToUrl(pr) {
    const server = `${pr.host}:${pr.port}`;
    let auth = null;
    let final = pr.isHttps ? 'https://' : 'http://';
    if (pr.auth) {
        final = `${final}${pr.auth.username}:${pr.auth.password}@`;
    }
    return `${final}${server}`;
}
class WebServiceHelper {
    static buildSoapEnvelope(xml, soapMethod) {
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
        let soapEnvXml = xmlHelper_1.XmlHelper.serializeXml(soapEnvelopeObj, 'soap12:Envelope');
        return soapEnvXml.replace('[XML]', xml);
    }
    static async makeSoapRequest(xml, cert, soap, proxy) {
        let result = { xml_enviado: xml };
        try {
            const headers = {
                "Content-Type": `application/soap+xml; charset=utf-8`,
                "SAOPAction": soap.action,
            };
            const agent = new https.Agent({
                rejectUnauthorized: false,
                cert: cert.pem,
                key: cert.key,
            });
            const opts = {
                method: 'POST',
                headers,
                agent,
                body: this.buildSoapEnvelope(xml, soap.method),
            };
            const res = await (0, node_fetch_1.default)(soap.url, opts);
            result.status = res.status;
            result.xml_recebido = await res.text();
            if (result.status == 200) {
                result.success = true;
                let retorno = xmlHelper_1.XmlHelper.deserializeXml(result.xml_recebido, { explicitArray: false });
                if (retorno) {
                    result.data = (0, utils_1.findKey)(retorno, 'nfeResultMsg');
                }
            }
            return result;
        }
        catch (err) {
            result.success = false;
            result.error = err;
            return result;
        }
    }
}
exports.WebServiceHelper = WebServiceHelper;
