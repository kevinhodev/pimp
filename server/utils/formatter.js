function formatCurrency(value) {
  if (!formatCurrency.formatter) {
    formatCurrency.formatter = Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const fractional = value.substr(8, 2);
  const whole = parseInt(value.substr(0, 8)).toString();
  const output = `${whole}.${fractional}`;

  return formatCurrency.formatter.format(output);
}

function formatDocument(document, type) {
  switch (type) {
    case "CNPJ":
      let p1 = document.substr(0, 2);
      let p2 = document.substr(2, 3);
      let p3 = document.substr(5, 3);
      let p4 = document.substr(8, 4);
      let p5 = document.substr(12, 2);
      return `${p1}.${p2}.${p3}/${p4}-${p5}`;

    case "CPF": {
      let p1 = document.substr(3, 3);
      let p2 = document.substr(6, 3);
      let p3 = document.substr(9, 3);
      let p4 = document.substr(12, 2);
      return `${p1}.${p2}.${p3}-${p4}`;
    }
    default:
      return "Formato inválido";
  }
}

function formatCEP(cep) {
  const c1 = cep.substr(0, 5);
  const c2 = cep.substr(5, 3);
  return `${c1}-${c2}`;
}

function formatDate(date, protocolo = false) {
  const day = parseInt(date.substr(0, 2));
  const month = parseInt(date.substr(2, 2));
  const year = parseInt(`20${date.substr(4, 2)}`);

  return new Intl.DateTimeFormat("pt-br", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, protocolo === true ? day + 1 : day));
}

module.exports = {
  formatCurrency,
  formatDocument,
  formatCEP,
  formatDate,
};
