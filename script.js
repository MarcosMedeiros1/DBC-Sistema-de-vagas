const BASE_URL = "http://localhost:3000";
// elementos
const naoPossuiCadastro = document.getElementById("naoPossuiCadastro");
const telaLogin = document.getElementById("telaLogin");
const telaCadastro = document.getElementById("telaCadastro");
const voltarTelaLogin = document.getElementById("voltarTelaLogin");
const btnVerificarLogin = document.getElementById("btnVerificarLogin");
const telaHome = document.getElementById("telaHome");
const btnSair = document.getElementById("btnSair");
const formLogin = document.getElementById("formLogin");
const inputs = document.getElementsByTagName('input')
const btnCadastrar = document.getElementById('btnCadastrar')

//Functions
const apagarTudo = () =>{
  for (item of inputs){
    item.value = ''
  }
}
const mudarTelaLogin = () => {
  telaLogin.classList.toggle("remover");
  telaCadastro.classList.toggle("remover");
  apagarTudo()
};

const verificarLogin = async (event) => {
  event.preventDefault();
  let dadosLogin = formLogin.elements;
  let email = dadosLogin.email.value;
  let senha = dadosLogin.senha.value;
  let retorno = await buscar("usuarios");
  console.log(retorno)
  

  if (retorno.some(x => x.email === email) && retorno.some(x => x.email === email)) {
    console.log(`usuario encontrado ${email} e senha ${senha}`);
    entrarTelaMain();
  } else {
    alert("usario não encontrado");
  }
};
const entrarTelaMain = () => {
  telaLogin.classList.toggle("remover");
  telaHome.classList.toggle("remover");
  apagarTudo()
};
//Validações:
const senhaValida = (senha) => {
  const caracteresSenha = senha.split('');
  const possuiNumero = caracteresSenha.some(caracter => !isNaN(parseInt(caracter)));

  const letras = caracteresSenha.filter( caracter => caracter.toLowerCase() !== caracter.toUpperCase());
  const possuiLetraMinuscula = letras.some(caracter => caracter !== caracter.toUpperCase());
  const possuiLetraMaiuscula = letras.some(caracter => caracter !== caracter.toLowerCase());

  const possuiCaracterEspecial = caracteresSenha.some(caracter => {
    return isNaN(parseInt(caracter)) && caracter.toLowerCase() === caracter.toUpperCase();
  });

  const possuiOitoCaracteres = senha.length >= 8;

  return possuiNumero
    && possuiLetraMinuscula
    && possuiLetraMaiuscula
    && possuiCaracterEspecial
    && possuiOitoCaracteres;
}

const dataInvalida = (data) => {
  const dia = data.substring(0,2);
  const mes = data.substring(3,5);
  const ano = data.substring(6);

  const dataAtual = new Date();
  const dataNascimento = new Date(`${mes}/${dia}/${ano}`);

  const dataEhInvalida = isNaN(dataNascimento);

  const idade = dataAtual.getFullYear() - dataNascimento.getFullYear();

  const menorDeIdade = !isNaN(idade) && idade < 18;

  return dataEhInvalida || menorDeIdade;
}
const adicionarMascaraData = () => {
  const dataInput = document.getElementById('input-DataNascimento');
  dataInput.addEventListener("keypress", (event) => {
    event.key >= 0 && event.key <= 9 ? true : event.preventDefault();
  });
  let data = dataInput.value.replaceAll(' ', '').replaceAll('/', '');
  switch(data.length) {
    case 3: case 4:
      dataInput.value = `${data.substring(0,2)}/${data.substring(2)}`;
      break;
    case 5: case 6: case 7: case 8:
      dataInput.value = `${data.substring(0,2)}/${data.substring(2,4)}/${data.substring(4)}`;
      break;
    default:
      dataInput.value = data;
  }
}


const emailEhValido = (email) => { // retorna true ou false
  const emailSeparadoPorArroba = email.split('@');
  const possuiUmArroba = emailSeparadoPorArroba.length === 2;
  const enderecoValido = email.indexOf('@') >= 3;

  const dominioSeparado = possuiUmArroba ? emailSeparadoPorArroba[1].split('.') : [];

  let dominioValido = dominioSeparado[0] ? dominioSeparado[0].length >= 3 : false;
  dominioValido = dominioValido && dominioSeparado.every(cd => cd.length >= 2);
  dominioValido = dominioValido && (dominioSeparado.length === 2 || dominioSeparado.length === 3);

  return possuiUmArroba && enderecoValido && dominioValido;
}

const buscar = async (objeto) => {
  try {
    ({ data: test } = await axios.get(`${BASE_URL}/${objeto}`));
    return test;
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
const verificaNome = (nome) =>{
  let nomeSplitEspaco = nome.split('');
  console.log(nomeSplitEspaco)
  let nomeSemEspaco = nomeSplitEspaco.filter(x => x !== ' ')
  let nomeVerificado = nomeSemEspaco.some(x => !isNaN(x))
  return nomeVerificado
}
const cadastrar = async () => {
  const selectTipoUsuario = document.getElementById('tipoDeUsuário')
  const tipoUsuario = selectTipoUsuario.options[selectTipoUsuario.selectedIndex].value;


  const inputNome = document.getElementById('input-NomeUsuario')
  const nome = inputNome.value;
  const nomeValido = verificaNome(nome)

  const inputEmail = document.getElementById('input-EmailUsuario');
  const email = inputEmail.value;
  const emailValido = emailEhValido(email);

  const inputData = document.getElementById('input-DataNascimento');
  const data = inputData.value;
  const dataEhInvalida = dataInvalida(data);

  const inputSenha = document.getElementById('input-SenhaUsuario');
  const senha = inputSenha.value;
  const senhaEhValida = senhaValida(senha);

  if(nomeValido){
    console.log('Nome inválido')
  }

  if(!emailValido) {
    console.log('Email inválido');
  }
  if(dataEhInvalida) {
    console.log('Data inválida')
  }
  if(!senhaEhValida) {
    console.log('Senha inválida');
  }

  if(!emailValido || dataEhInvalida || !senhaEhValida) {
    return;
  }

  const usuario = new Usuario(tipoUsuario, nome, email, data, senha);

  try {
    await axios.post(`${BASE_URL}/usuarios`, usuario);
    alert('Colaborador cadastrado com sucesso!');
  }
  catch (e) {
    console.log(e);
  }
  apagarTudo()
}
adicionarMascaraData()
//eventos
btnCadastrar.addEventListener("click", cadastrar)
btnSair.addEventListener("click", entrarTelaMain);
btnVerificarLogin.addEventListener("click", verificarLogin);
naoPossuiCadastro.addEventListener("click", mudarTelaLogin);
voltarTelaLogin.addEventListener("click", mudarTelaLogin);
