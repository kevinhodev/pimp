const mongoose = require("mongoose");

const Título = mongoose.model("Título", {
  apresentante: {
    código: String,
    nome: String,
    endereço: String,
    tipo: String,
    tipo_de_documento: String,
    número_do_documento: String,
  },
  favorecido: {
    nome: String,
  },
  sacador: {
    nome: String,
    número_do_documento: String,
    endereço: String,
    cep: String,
    cidade: String,
    uf: String,
  },
  devedor: {
    nome: String,
    tipo_de_documento: String,
    número_do_documento: String,
    endereço: String,
    cep: String,
    cidade: String,
    bairro: String,
    uf: String,
  },
  data: String,
  protocolo: Number,
  distribuição: {
    data: String,
    número: String,
  },
  nosso_número: String,
  espécie: String,
  número_do_título: String,
  data_de_emissão: String,
  data_de_vencimento: String,
  tipo_de_moeda: String,
  valor: String,
  saldo: String,
  praça_de_pagamento: String,
  endosso: String,
  aceite: String,
  agência_código_do_cedente: String,
  motivo: String,
  nihil: String,
  fins_falimentares: String,
  cartório: String,
  empresa: String,
  convênio: String,
});

Título.schema.index({ data: -1, protocolo: -1 });

module.exports = Título;
