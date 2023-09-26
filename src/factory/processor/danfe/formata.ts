
export function mascaraCPF(valor: string) {
    var retorno
    var grupo01 = valor.substring(0, 3)
    retorno = grupo01
    var grupo02 = valor.substring(3, 6)
    if (grupo02 !== '') {
      retorno += '.' + grupo02
    }
    var grupo03 = valor.substring(6, 9)
    if (grupo03 !== '') {
      retorno += '.' + grupo03
    }
    var grupo04 = valor.substring(9)
    if (grupo04 !== '') {
      retorno += '-' + grupo04
    }
    return retorno
  }
  
  /**
   * Retorna <valor> especificado com máscara do CNPJ.
   *
   * @param      {string}  valor
   * @return     {string}
   */
  export function mascaraCNPJ(valor: string) {
    var retorno
    var grupo01 = valor.substring(0, 2)
    retorno = grupo01
    var grupo02 = valor.substring(2, 5)
    if (grupo02 !== '') {
      retorno += '.' + grupo02
    }
    var grupo03 = valor.substring(5, 8)
    if (grupo03 !== '') {
      retorno += '.' + grupo03
    }
    var grupo04 = valor.substring(8, 12)
    if (grupo04 !== '') {
      retorno += '/' + grupo04
    }
    var grupo05 = valor.substring(12)
    if (grupo05 !== '') {
      retorno += '-' + grupo05
    }
    return retorno
  }
  
  /**
   * Retorna <numero> especificado formatado de acordo com seu tipo (cpf ou cnpj).
   *
   * @param      {string}  numero
   * @return     {string}
   */
  export function formataInscricaoNacional(numero: string) {
    if (numero) {
      if (numero.length === 11) {
        return mascaraCPF(numero)
      }
      if (numero.length === 14) {
        return mascaraCNPJ(numero)
      }
    }
    return numero
  }
  
  /**
   * Formata data de acordo com <dt> esoecificado.
   * <dt> é no formato UTC, YYYY-MM-DDThh:mm:ssTZD (https://www.w3.org/TR/NOTE-datetime)
   *
   * @param      {string}  dt 2022-11-03T16:20:52-03:00
   * @return     {string}
   */
  export function formataData(dt: string) {
    var [ano, mes, dia] = dt.substring(0, 10).split('-')
    return dia.padStart(2, '0') + '/' + mes.toString().padStart(2, '0') + '/' + ano
  }
  
  export function formataHora(dt: string) {
    return dt.substring(11, 8);
  }
  
  /**
   * Retorna o valor formatado em moeda de acordo com  <numero>  e <decimais> especificados.
   *
   * @param      {number}   numero
   * @param      {number}  decimais
   * @return     {string}
   */
  export function formataMoeda(numero: any, decimais: number) {
    decimais = decimais || 4
    var symbol = ''
    var decimal = ','
    var thousand = '.'
    var negative = numero < 0 ? '-' : ''
    var i: any = parseInt(numero = Math.abs(+numero || 0).toFixed(decimais), 10) + ''
    var j = 0
  
    decimais = !isNaN(decimais = Math.abs(decimais)) ? decimais : 2
    symbol = symbol !== undefined ? symbol : '$'
    thousand = thousand || ','
    decimal = decimal || '.'
    j = (j = i.length) > 3 ? j % 3 : 0
    return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (decimais ? decimal + Math.abs(numero - i).toFixed(decimais).slice(2) : '')
  };

/**
 * Retorna a <cahve> da NFE formata.
 * Formatação: grupos de 4 números separados por espaço.
 * @param      {string}  chave
 * @return     {string}
 */
export function formataChave(chave: string) {
    var out = ''
    if (chave && chave.length === 44) {
      for (var i = 0; i < chave.split('').length; i++) {
        if (i % 4 === 0) {
          out += ' ' + chave.charAt(i)
        } else {
          out += chave.charAt(i)
        }
      }
      return out
    }
    return chave
  }