const BASE_URL = "http://localhost:3000";

let colaboradores = [];

class Colaborador {
  email;
  dataNascimento;
  senha;

  constructor(email, dataNascimento, senha) {
    this.email = email;
    this.dataNascimento = dataNascimento;
    this.senha = senha;
  }
}

// rollback
// executado de forma assíncrona
const buscar = async () => {
  try {
    const { data: colaboradores } = await axios.get(
      `${BASE_URL}/colaboradores`,
    );

    console.log(colaboradores);
  } catch (e) {
    console.log(e);
    // imagine aqui o toastr
    if (e.status === 401) {
      alert("Sessão expirada");
    }
    if (e.status === 403) {
      alert("Você não tem permissão para realizar esta ação.");
    }
  }
};

const senhaValida = (senha) => {
  const caracteresSenha = senha.split("");
  const possuiNumero = caracteresSenha.some(
    (caracter) => !isNaN(parseInt(caracter)),
  );

  const letras = caracteresSenha.filter(
    (caracter) => caracter.toLowerCase() !== caracter.toUpperCase(),
  );
  const possuiLetraMinuscula = letras.some(
    (caracter) => caracter !== caracter.toUpperCase(),
  );
  const possuiLetraMaiuscula = letras.some(
    (caracter) => caracter !== caracter.toLowerCase(),
  );

  const possuiCaracterEspecial = caracteresSenha.some((caracter) => {
    return (
      isNaN(parseInt(caracter)) &&
      caracter.toLowerCase() === caracter.toUpperCase()
    );
  });

  const possuiOitoCaracteres = senha.length >= 8;

  return (
    possuiNumero &&
    possuiLetraMinuscula &&
    possuiLetraMaiuscula &&
    possuiCaracterEspecial &&
    possuiOitoCaracteres
  );
};

const dataInvalida = (data) => {
  const dia = data.substring(0, 2);
  const mes = data.substring(3, 5);
  const ano = data.substring(6);

  const dataAtual = new Date();
  const dataNascimento = new Date(`${mes}/${dia}/${ano}`);

  const dataEhInvalida = isNaN(dataNascimento);

  const idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

  const menorDeIdade = !isNaN(idade) && idade < 18;

  return dataEhInvalida || menorDeIdade;
};

const emailEhValido = (email) => {
  // retorna true ou false
  const emailSeparadoPorArroba = email.split("@");
  const possuiUmArroba = emailSeparadoPorArroba.length === 2;
  const enderecoValido = email.indexOf("@") >= 3;

  const dominioSeparado = possuiUmArroba
    ? emailSeparadoPorArroba[1].split(".")
    : [];

  let dominioValido = dominioSeparado[0]
    ? dominioSeparado[0].length >= 3
    : false;
  dominioValido =
    dominioValido && dominioSeparado.every((cd) => cd.length >= 2);
  dominioValido =
    dominioValido &&
    (dominioSeparado.length === 2 || dominioSeparado.length === 3);

  return possuiUmArroba && enderecoValido && dominioValido;
};

const cadastrar = async () => {
  const inputEmail = document.getElementById("input-email");
  const email = inputEmail.value;
  const emailValido = emailEhValido(email);

  const inputData = document.getElementById("input-data");
  const data = inputData.value;
  const dataEhInvalida = dataInvalida(data);

  const inputSenha = document.getElementById("input-senha");
  const senha = inputSenha.value;
  const senhaEhValida = senhaValida(senha);

  if (!emailValido) {
    console.log("Email inválido");
  }
  if (dataEhInvalida) {
    console.log("Data inválida");
  }
  if (!senhaEhValida) {
    console.log("Senha inválida");
  }

  if (!emailValido || dataEhInvalida || !senhaEhValida) {
    return;
  }

  const colaborador = new Colaborador(email, data, senha);

  // depois que estiver tudo certo
  try {
    await axios.post(`${BASE_URL}/colaboradores`, colaborador);
    inputEmail.value = "";
    inputData.value = "";
    inputSenha.value = "";
    console.log("Colaborador cadastrado com sucesso!");
  } catch (e) {
    console.log(e);
  }
};

const editar = async () => {
  const idColaborador = prompt("id do colab:");
  const nome = prompt("nome:");

  const colaborador = new Colaborador(nome);

  try {
    await axios.put(`${BASE_URL}/colaboradores/${idColaborador}`, colaborador);
    console.log("Colaborador editado com sucesso!");
  } catch (e) {
    console.log(e);
  }
};

const deletar = async () => {
  const idColaborador = prompt("id do colab:");

  try {
    await axios.delete(`${BASE_URL}/colaboradores/${idColaborador}`);
    console.log("Colaborador excluído com sucesso!");
  } catch (e) {
    console.log(e);
  }
};

const adicionarMascaraSemEspacos = (evento) => {
  const elemento = document.getElementById(evento.target.id);
  elemento.value = elemento.value.replaceAll(" ", "");
};

const adicionarMascaraData = () => {
  const dataInput = document.getElementById("input-data");
  let data = dataInput.value.replaceAll(" ", "").replaceAll("/", ""); // remover espaços e barras
  // dependendo do tamanho vamos retornar uma determinada string
  switch (data.length) {
    case 3:
    case 4:
      dataInput.value = `${data.substring(0, 2)}/${data.substring(2)}`;
      break;
    case 5:
    case 6:
    case 7:
    case 8:
      dataInput.value = `${data.substring(0, 2)}/${data.substring(
        2,
        4,
      )}/${data.substring(4)}`;
      break;
    default:
      dataInput.value = data;
  }
};

const programa = () => {
  const btnCadastro = document.getElementById("btn-cadastro");
  btnCadastro.addEventListener("click", cadastrar);
};

programa();
