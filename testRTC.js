const fs = require("fs");
const lib = require("./lib");
const signUtils = require("./lib/factory/signature");
const XmlHelper = require("./lib/factory/xmlHelper");
const path = require("path");
const libxmljs = require("libxmljs");

let cert = {
  pfx: fs.readFileSync("certificado/certificado.pfx"),
  pem: fs.readFileSync("certificado/CERTIFICATE.txt", "utf8"),
  key: fs.readFileSync("certificado/KEY.txt", "utf8"),
  password: fs.readFileSync("certificado/senha.txt", "utf8"),
};

let empresa = {
  razaoSocial: "TESTE",
  nomeFantasia: "TEST",
  cnpj: "12345678901234",
  inscricaoEstadual: "1234567890",
  inscricaoMunicipal: "",
  codRegimeTributario: "3",
  endereco: {
    logradouro: "Rua Teste",
    numero: 123,
    complemento: "",
    bairro: "Bairro Teste",
    municipio: "Cachoeirinha",
    codMunicipio: "4303004",
    uf: "MG",
    cUf: "31",
    cep: "99999999",
    telefone: "999999999",
  },
  certificado: cert,
  idCSC: "1",
  CSC: "",
};

let moment = require("moment");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let documento = {
  dhEmissao: moment().format(),
  ambiente: "2",
  modelo: "55",
  numeroNota: randomInt(2, 9999),
  serie: "20",
  naturezaOperacao: "VENDA",
  tipoDocumentoFiscal: "1",
  identificadorDestinoOperacao: "1",
  codUF: "43",
  codIbgeFatoGerador: "4303103",
  processoEmissao: "0",
  finalidadeEmissao: "1",
  indConsumidorFinal: "1",
  indPresenca: "1",
  tipoEmissao: "1",
  tipoImpressao: "4",
  versaoAplicativoEmissao: "NODE-NFE TEST 1.0",
};

let dest = {
  indicadorIEDestinario: "9",
  documento: "41267310324",
  nome: "DESTINATARIO TESTE",
  email: "test@test.com",
  isEstrangeiro: false,
  endereco: {
    logradouro: "RUA TEST",
    numero: 1231,
    complemento: "",
    bairro: "teste",
    municipio: "testeee",
    codMunicipio: "4303103",
    cUf: "43",
    uf: "RS",
    cep: "11111111",
    telefone: "5111111111",
  },
};

let produtos = [];
let valorProduto = 31.8;
let valorTotalProdutos = 0;
for (let i = 1; i <= 1; i++) {
  valorTotalProdutos += valorProduto;
  produtos.push({
    prod: {
      codigo: "84233",
      cEAN: "7898221456293",
      descricao: "PRODUTO TESTE",
      cest: "2104400",
      NCM: "85164000",
      CFOP: "5102",
      unidadeComercial: "SAC",
      quantidadeComercial: "1.0000",
      valorUnitarioComercial: valorProduto.toFixed(2),
      valorTotal: valorProduto.toFixed(2),
      cEANTrib: "7898221456293",
      unidadeTributavel: "SAC",
      quantidadeTributavel: "1.0000",
      valorUnitarioTributavel: valorProduto.toFixed(2),
      indicadorTotal: "1",
      valorFrete: "",
      valorSeguro: "",
      valorDesconto: "",
      valorOutro: "",
      numeroPedido: "123",
      numeroItemPedido: "1",
    },
    imposto: {
      valorAproximadoTributos: 0,
      icms: {
        CST: "00",
        orig: "0",
        modBC: "3",
        vBC: "629.90",
        vICMS: "113.40",
        pICMS: "18.00",
        aliquota: "0.00",
        valor: "0.00",
        // vBCST: "0.00",
        // valorST: "0.00",
        // aliquotaST: "0.00",
        percentualReducaoBaseCalc: "0.00",
      },
      IBSCBS: {
        CST: "000",
        cClassTrib: "000001",
        gIBSCBS: {
          vBC: "0.00",
          gIBSUF: {
            pIBSUF: "0.00",
            vIBSUF: "0.00",
          },
          gIBSMun: {
            pIBSMun: "0.00",
            vIBSMun: "0.00",
          },
          vIBS: "0.00",
          gCBS: {
            pCBS: "0.00",
            vCBS: "0.00",
          },
        },
      },
    },
    infoAdicional: "teste",
    vItem: "0.00",
    numeroItem: i,
  });
}

let pagamento = {
  //valorTroco: '',
  pagamentos: [
    {
      indicadorFormaPagamento: "",
      formaPagamento: "01",
      valor: valorTotalProdutos.toFixed(2),
    },
  ],
};

let icmsTot = {
  vBC: "629.90",
  vICMS: "113.40",
  vICMSDeson: "0.00",
  vFCPUFDest: "0.00",
  //vICMSUFDest:'0.00',
  //vICMSUFRemet: '0.00',
  vFCP: "0.00",
  vBCST: "0.00",
  vST: "0.00",
  vFCPST: "0.00",
  vFCPSTRet: "0.00",
  vProd: valorTotalProdutos.toFixed(2),
  vFrete: "0.00",
  vSeg: "0.00",
  vDesc: "0.00",
  vII: "0.00",
  vIPI: "0.00",
  vIPIDevol: "0.00",
  vPIS: "0.00",
  vCOFINS: "0.00",
  vOutro: "0.00",
  vNF: valorTotalProdutos.toFixed(2),
  //vTotTrib: '0.00',
};

let IBSCBSTot = {
  vBCIBSCBS: "0.00",
  gIBS: {
    gIBSUF: {
      vDif: "0.00",
      vDevTrib: "0.00",
      vIBSUF: "0.00",
    },
    gIBSMun: {
      vDif: "0.00",
      vDevTrib: "0.00",
      vIBSMun: "0.00",
    },
    vIBS: "0.00",
    vCredPres: "0.00",
    vCredPresCondSus: "0.00",
  },
  gCBS: {
    vDif: "0.00",
    vDevTrib: "0.00",
    vCBS: "0.00",
    vCredPres: "0.00",
    vCredPresCondSus: "0.00",
  },
  gMono: {
    vIBSMono: "0.00",
    vCBSMono: "0.00",
    vIBSMonoReten: "0.00",
    vCBSMonoReten: "0.00",
    vIBSMonoRet: "0.00",
    vCBSMonoRet: "0.00",
  },
};

let nfce = {
  docFiscal: documento,
  destinatario: dest,
  produtos: produtos,
  total: { icmsTot, IBSCBSTot, vNFTot: valorTotalProdutos.toFixed(2) },
  transporte: {
    modalidateFrete: "3",
  },
  pagamento,
  infoAdicional: {
    infoComplementar: "TESTTESTETSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
  },
};

const configuracoes = {
  empresa,
  certificado: cert,
  geral: {
    ambiente: "2",
    modelo: "55",
    versao: "4.00",
  },
};

async function testeEmissaoNFe() {
  const nfeProc = new lib.NFeProcessor(configuracoes);

  const ini = new Date();
  let result = await nfeProc.processarDocumento(nfce);
  const fin = new Date();
  console.log(`${(fin.getTime() - ini.getTime()) / 1000}s`);

  console.log("Resultado Emissão NFe: \n\n" + result.error.stack);

  fs.writeFileSync(
    __dirname + "/mock/nfe-rtc-teste.xml",
    result.envioNF.xml_enviado
  );
}

testeEmissaoNFe();
