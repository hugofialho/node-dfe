"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formataChave = exports.formataMoeda = exports.formataHora = exports.formataData = exports.formataCEP = exports.formataTelefone = exports.formataInscricaoNacional = exports.mascaraCNPJ = exports.mascaraCPF = void 0;
function mascaraCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
exports.mascaraCPF = mascaraCPF;
/**
 * Retorna <valor> especificado com máscara do CNPJ.
 *
 * @param      {string}  valor
 * @return     {string}
 */
function mascaraCNPJ(cnpj) {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}
exports.mascaraCNPJ = mascaraCNPJ;
/**
 * Retorna <numero> especificado formatado de acordo com seu tipo (cpf ou cnpj).
 *
 * @param      {string}  numero
 * @return     {string}
 */
function formataInscricaoNacional(numero) {
    if (numero) {
        if (numero.length === 11) {
            return mascaraCPF(numero);
        }
        if (numero.length === 14) {
            return mascaraCNPJ(numero);
        }
    }
    return numero;
}
exports.formataInscricaoNacional = formataInscricaoNacional;
function formataTelefone(telefone) {
    if (!telefone)
        return "";
    return telefone.length > 10
        ? telefone.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2 - $3")
        : telefone.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2 - $3");
}
exports.formataTelefone = formataTelefone;
function formataCEP(cep) {
    if (!cep)
        return "";
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}
exports.formataCEP = formataCEP;
/**
 * Formata data de acordo com <dt> esoecificado.
 * <dt> é no formato UTC, YYYY-MM-DDThh:mm:ssTZD (https://www.w3.org/TR/NOTE-datetime)
 *
 * @param      {string}  dt 2022-11-03T16:20:52-03:00
 * @return     {string}
 */
function formataData(dt) {
    var [ano, mes, dia] = dt.substring(0, 10).split("-");
    return (dia.padStart(2, "0") + "/" + mes.toString().padStart(2, "0") + "/" + ano);
}
exports.formataData = formataData;
function formataHora(dt) {
    return dt.substring(11, 19);
}
exports.formataHora = formataHora;
/**
 * Retorna o valor formatado em moeda de acordo com  <numero>  e <decimais> especificados.
 *
 * @param      {number}   numero
 * @param      {number}  decimais
 * @return     {string}
 */
function formataMoeda(numero, decimais) {
    return numero
        ? parseFloat(numero).toLocaleString("pt-br", {
            minimumFractionDigits: decimais,
        })
        : "";
}
exports.formataMoeda = formataMoeda;
/**
 * Retorna a <cahve> da NFE formata.
 * Formatação: grupos de 4 números separados por espaço.
 * @param      {string}  chave
 * @return     {string}
 */
function formataChave(chave) {
    return chave.replace(/(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11");
}
exports.formataChave = formataChave;
