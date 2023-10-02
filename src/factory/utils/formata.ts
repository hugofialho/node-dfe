export function mascaraCPF(cpf: string) {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Retorna <valor> especificado com máscara do CNPJ.
 *
 * @param      {string}  valor
 * @return     {string}
 */
export function mascaraCNPJ(cnpj: string) {
  if (!cnpj) return "";
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

/**
 * Retorna <numero> especificado formatado de acordo com seu tipo (cpf ou cnpj).
 *
 * @param      {string}  numero
 * @return     {string}
 */
export function formataInscricaoNacional(numero: string) {
  if (!numero) return "";
  if (numero.length === 11) {
    return mascaraCPF(numero);
  }
  if (numero.length === 14) {
    return mascaraCNPJ(numero);
  }
}

export function formataTelefone(telefone: string) {
  if (!telefone) return "";

  return telefone.length > 10
    ? telefone.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2 - $3")
    : telefone.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2 - $3");
}

export function formataCEP(cep: string) {
  if (!cep) return "";
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

/**
 * Formata data de acordo com <dt> esoecificado.
 * <dt> é no formato UTC, YYYY-MM-DDThh:mm:ssTZD (https://www.w3.org/TR/NOTE-datetime)
 *
 * @param      {string}  data 2022-11-03T16:20:52-03:00
 * @return     {string}
 */
export function formataData(data: string) {
  if (!data) return "";
  var [ano, mes, dia] = data.substring(0, 10).split("-");
  return (
    dia.padStart(2, "0") + "/" + mes.toString().padStart(2, "0") + "/" + ano
  );
}

export function formataHora(data: string) {
  if (!data) return "";
  return data.substring(11, 19);
}

/**
 * Retorna o valor formatado em moeda de acordo com  <numero>  e <decimais> especificados.
 *
 * @param      {number}   numero
 * @param      {number}  decimais
 * @return     {string}
 */
export function formataMoeda(numero: string, decimais: number) {
  if (!numero) return "";
  return parseFloat(numero).toLocaleString("pt-br", {
    minimumFractionDigits: decimais,
  });
}

/**
 * Retorna a <cahve> da NFE formata.
 * Formatação: grupos de 4 números separados por espaço.
 * @param      {string}  chave
 * @return     {string}
 */
export function formataChave(chave: string) {
  return chave.replace(
    /(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/,
    "$1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11"
  );
}
