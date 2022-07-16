const BASE_URL = "http://localhost:3000";
// elementos
const naoPossuiCadastro = document.getElementById("naoPossuiCadastro");
const telaLogin = document.getElementById("telaLogin");
const telaCadastroUsuario = document.getElementById("telaCadastroUsuario");
const telaCadastroVaga = document.getElementById("telaCadastroVaga");
const voltarTelaLogin = document.getElementById("voltarTelaLogin");
const btnVerificarLogin = document.getElementById("btnVerificarLogin");
const telaHome = document.getElementById("telaHome");
const btnSair = document.getElementById("btnSair");
const formLogin = document.getElementById("formLogin");
const inputs = document.getElementsByTagName("input");
const btnCadastrar = document.getElementById("btnCadastrar");
const btnCadastrarVaga = document.getElementById("btnCadastrarVaga");
const btnVoltarHomeRecrutador = document.getElementById(
  "btnVoltarHomeRecrutador",
);
const inputVagaRemuneracao = document.getElementById("inputVagaRemuneracao");
const btnConfirmarVaga = document.getElementById("btnConfirmarVaga");

//Functions
const apagarTudo = () => {
  for (item of inputs) {
    item.value = "";
  }
};

const trocarTela = (telaAtual, telaRetorno) => {
  telaAtual.classList.toggle("remover");
  telaRetorno.classList.toggle("remover");
  apagarTudo();
};

const verificarLogin = async (event) => {
  event.preventDefault();
  let dadosLogin = formLogin.elements;
  let email = dadosLogin.email.value;
  let senha = dadosLogin.senha.value;
  let retorno = await buscar("usuarios");

  if (email.trim().length === 0 || senha.trim().length === 0) {
    alert("Insira o email e a senha corretamente");
    return;
  }

  const usuario = retorno.find((e) => e.email === email && e.senha === senha);

  if (!usuario) {
    alert("Usuário não encontrado");
    return;
  }

  if (usuario.tipo === "User") {
    btnCadastrarVaga.classList.toggle("remover");
    btnCadastrarVaga.parentElement.style.justifyContent = "center";
  }

  trocarTela(telaLogin, telaHome);
};

//Validações:
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
const adicionarMascaraData = () => {
  const dataInput = document.getElementById("input-DataNascimento");
  dataInput.addEventListener("keypress", (event) => {
    event.key >= 0 && event.key <= 9 ? true : event.preventDefault();
  });
  let data = dataInput.value.replaceAll(" ", "").replaceAll("/", "");
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

const buscar = async (objeto) => {
  try {
    ({ data: test } = await axios.get(`${BASE_URL}/${objeto}`));
    return test;
  } catch (e) {
    // imagine aqui o toastr
    if (e.status === 401) {
      alert("Sessão expirada");
    }
    if (e.status === 403) {
      alert("Você não tem permissão para realizar esta ação.");
    }
  }
};

const verificaNome = (nome) => {
  let nomeSplitEspaco = nome.split("");
  let nomeSemEspaco = nomeSplitEspaco.filter((x) => x !== " ");
  let nomeVerificado = nomeSemEspaco.some((x) => !isNaN(x));
  return nomeVerificado;
};

const cadastrarNoDb = async (tipo, objeto) => {
  try {
    await axios.post(`${BASE_URL}/${tipo}`, objeto);
    switch (tipo) {
      case "usuarios":
        alert("Usuário cadastrado com sucesso!");
        break;
      case "vagas":
        alert("Vaga cadastrada com sucesso!");
        break;
    }
  } catch (e) {
    console.log(e);
  }
};

const cadastrarTrabalhador = () => {
  const selectTipoUsuario = document.getElementById("tipoDeUsuário");
  const tipoUsuario =
    selectTipoUsuario.options[selectTipoUsuario.selectedIndex].value;

  const inputNome = document.getElementById("input-NomeUsuario");
  const nome = inputNome.value;
  const nomeValido = verificaNome(nome);

  const inputEmail = document.getElementById("input-EmailUsuario");
  const email = inputEmail.value;
  const emailValido = emailEhValido(email);

  const inputData = document.getElementById("input-DataNascimento");
  const data = inputData.value;
  const dataEhInvalida = dataInvalida(data);

  const inputSenha = document.getElementById("input-SenhaUsuario");
  const senha = inputSenha.value;
  const senhaEhValida = senhaValida(senha);

  if (nomeValido) {
    alert("Nome inválido");
  }

  if (!emailValido) {
    alert("Email inválido");
  }

  if (dataEhInvalida) {
    alert("Data inválida");
  }

  if (!senhaEhValida) {
    alert("Senha inválida");
  }

  if (nomeValido || !emailValido || dataEhInvalida || !senhaEhValida) {
    return;
  }

  const usuario = new Usuario(tipoUsuario, nome, data, email, senha);

  cadastrarNoDb("usuarios", usuario);
  trocarTela(telaCadastroUsuario, telaLogin);
};

const mascaraRemuneracao = () => {
  inputVagaRemuneracao.addEventListener("keypress", (event) => {
    event.key >= 0 && event.key <= 9 ? true : event.preventDefault();
  });

  const remuneracaoLenght = inputVagaRemuneracao.value.length;

  if (remuneracaoLenght < 3) {
    inputVagaRemuneracao.value = "";
    inputVagaRemuneracao.value += "R$ ";
  }
};

const validaRemuneracao = (remuneracao) => {
  if (remuneracao.length < 2) {
    return false;
  }

  const remuneracaoSplit = remuneracao.split("$ ");
  const remuneracaoSemEspaco = remuneracaoSplit[1].replaceAll(" ", "");

  return remuneracaoSemEspaco > 0;
};

const cadastrarVaga = () => {
  const inputVagaTitulo = document.getElementById("inputVagaTitulo");
  const titulo = inputVagaTitulo.value;

  const inputVagaDescricao = document.getElementById("inputVagaDescricao");
  const descricao = inputVagaDescricao.value;

  const remuneracao = inputVagaRemuneracao.value;

  if (titulo.trim() === "") {
    alert("Informe um título válido");
    return;
  }

  if (descricao.trim() === "") {
    alert("Informe uma descrição válida");
    return;
  }

  if (!validaRemuneracao(remuneracao)) {
    alert("Informe uma remuneração válida");
    return;
  }

  const vaga = new Vaga(titulo, descricao, remuneracao);

  cadastrarNoDb("vagas", vaga);
  trocarTela(telaCadastroVaga, telaHome);
};

adicionarMascaraData();

//eventos
btnCadastrar.addEventListener("click", cadastrarTrabalhador);
btnSair.addEventListener("click", () => trocarTela(telaHome, telaLogin));
btnVerificarLogin.addEventListener("click", verificarLogin);
naoPossuiCadastro.addEventListener("click", () =>
  trocarTela(telaLogin, telaCadastroUsuario),
);
voltarTelaLogin.addEventListener("click", () =>
  trocarTela(telaCadastroUsuario, telaLogin),
);
btnCadastrarVaga.addEventListener("click", () =>
  trocarTela(telaHome, telaCadastroVaga),
);
btnVoltarHomeRecrutador.addEventListener("click", () =>
  trocarTela(telaCadastroVaga, telaHome),
);
btnConfirmarVaga.addEventListener("click", cadastrarVaga);
