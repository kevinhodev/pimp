const formatter = require("./formatter");

function getData(fileData) {
  const data = fileData.split("\n");
  const header = data.splice(0, 1)[0];

  let títulos = [];

  for (título of data) {
    if (título.substr(79, 40).trim() !== "") {
      const tipoDeDocumentoDoDevedor =
        título.substr(249, 3).trim() === "CGC" ? "CNPJ" : "CPF";

      títulos.push({
        apresentante: {
          código: título.substr(1, 3).trim(),
          nome: título.substr(361, 45).trim(),
          endereço: "",
          tipo: "B",
          tipo_de_documento: "",
          número_do_documento: "",
        },
        favorecido: {
          nome: título.substr(79, 45).trim(),
        },
        sacador: {
          nome: título.substr(34, 45).trim(),
          número_do_documento: formatter.formatDocument(
            título.substr(489, 14).trim(),
            "CNPJ"
          ),
          endereço: título.substr(503, 45).trim(),
          cep: formatter.formatCEP(título.substr(548, 8).trim()),
          cidade: título.substr(556, 20).trim(),
          uf: título.substr(350, 2).trim(),
        },
        devedor: {
          nome: título.substr(204, 45).trim(),
          tipo_de_documento: tipoDeDocumentoDoDevedor,
          número_do_documento: formatter.formatDocument(
            título.substr(252, 14).trim(),
            tipoDeDocumentoDoDevedor
          ),
          endereço: título.substr(277, 45).trim(),
          cep: formatter.formatCEP(título.substr(322, 8).trim()),
          cidade: título.substr(330, 20).trim(),
          bairro: título.substr(441, 25).trim(),
          uf: título.substr(350, 2).trim(),
        },
        data: formatter.formatDate(header.substr(1, 6).trim(), true),
        protocolo: Number(título.substr(354, 7).trim()),
        distribuição: {
          data: formatter.formatDate(header.substr(1, 6).trim()),
          número: título.substr(416, 6).trim(),
        },
        nosso_número: título.substr(19, 15).trim(),
        espécie: título.substr(124, 3).trim(),
        número_do_título: título.substr(127, 11).trim(),
        data_de_emissão: formatter.formatDate(título.substr(138, 6).trim()),
        data_de_vencimento: formatter.formatDate(título.substr(144, 6).trim()),
        tipo_de_moeda: título.substr(150, 3).trim(),
        valor: formatter.formatCurrency(título.substr(157, 10)),
        saldo: formatter.formatCurrency(título.substr(171, 10)),
        status: "Em aberto",
        praça_de_pagamento: título.substr(181, 20).trim(),
        endosso: (() => {
          const result = título.substr(201, 1).trim();
          return result === "" ? "S" : result;
        })(),
        aceite: título.substr(202, 1).trim(),
        devedores: título.substr(203, 1).trim(),
        agência_código_do_cedente: título.substr(4, 15).trim(),
        motivo: "Pagamento",
        nihil: "N",
        micro_empresa: "N",
        fins_falimentares: (() =>
          título.substr(576, 1).trim() === "F" ? "S" : "N")(),
        cartório: título.substr(352, 2).trim(),
        empresa: título.substr(486, 1).trim(),
        convênio: título.substr(589, 1).trim(),
      });
    }
  }

  return títulos;
}

module.exports = getData;
