"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findKey = exports.sleep = exports.timeout = exports.jsonOneLevel = exports.log = exports.validaUrlWsdl = exports.removeSelfClosedFields = exports.randomInt = exports.getEnumByValue = exports.setConfigDefaultValues = void 0;
function setConfigDefaultValues(configuracoes) {
    if (!configuracoes.geral.versao)
        configuracoes.geral.versao = '4.00';
    if (!configuracoes.webservices)
        configuracoes.webservices = { tentativas: 3, aguardarConsultaRetorno: 1000 };
    if (!configuracoes.webservices.tentativas)
        configuracoes.webservices.tentativas = 3;
    if (!configuracoes.webservices.aguardarConsultaRetorno)
        configuracoes.webservices.aguardarConsultaRetorno = 1000;
}
exports.setConfigDefaultValues = setConfigDefaultValues;
function getEnumByValue(enumType, value) {
    if (!value) {
        return '';
    }
    let result = Object.keys(enumType).filter(i => enumType[i] == value);
    if (result.length <= 0)
        throw new Error('Valor (' + value + ') não localizado no Enum.');
    return enumType[result[0]];
}
exports.getEnumByValue = getEnumByValue;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randomInt = randomInt;
function removeSelfClosedFields(o) {
    Object.keys(o).forEach(key => {
        if (o[key] !== null && typeof o[key] === 'object') {
            removeSelfClosedFields(o[key]);
            return;
        }
        if (o[key] === undefined || o[key] === '' || o[key] === null) {
            delete o[key];
        }
    });
}
exports.removeSelfClosedFields = removeSelfClosedFields;
function validaUrlWsdl(url) {
    if (!url.includes('?wsdl'))
        url += '?wsdl';
    return url;
}
exports.validaUrlWsdl = validaUrlWsdl;
function log(msg, processo) {
    console.log(`[node-dfe][${processo || 'log'}]->${msg}`);
}
exports.log = log;
function jsonOneLevel(obj) {
    const result = {};
    for (const k of Object.keys(obj)) {
        let logStr = obj[k].toString() || "null";
        if (logStr.length > 500) {
            logStr = logStr.substring(0, 499);
        }
        result[k] = logStr;
    }
    return JSON.stringify(result);
}
exports.jsonOneLevel = jsonOneLevel;
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.timeout = timeout;
async function sleep(fn, ms, ...args) {
    await timeout(ms);
    return fn(...args);
}
exports.sleep = sleep;
function findKey(object, key) {
    for (const [k, v] of Object.entries(object)) {
        if (k === key)
            return v;
        if (v instanceof Object) {
            const d = findKey(v, key);
            if (d)
                return d;
        }
    }
    return null;
}
exports.findKey = findKey;
