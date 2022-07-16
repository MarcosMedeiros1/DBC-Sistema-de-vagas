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

//Functions

const mudarTelaLogin = () => {
  telaLogin.classList.toggle("remover");
  telaCadastro.classList.toggle("remover");
};

const verificarLogin = async (event) => {
  event.preventDefault();
  let dadosLogin = formLogin.elements;
  let email = dadosLogin.email.value;
  let senha = dadosLogin.senha.value;
  let retorno = await buscar("usuarios");

  if (retorno.includes(email) && retorno.includes(senha)) {
    console.log(`usuario encontrado${email} e senha ${senha}`);
    entrarTelaMain();
  } else {
    alert("usario não encontrado");
  }
};
const entrarTelaMain = () => {
  telaLogin.classList.toggle("remover");
  telaHome.classList.toggle("remover");
};
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

//eventos
btnSair.addEventListener("click", entrarTelaMain);
btnVerificarLogin.addEventListener("click", verificarLogin);
naoPossuiCadastro.addEventListener("click", mudarTelaLogin);
voltarTelaLogin.addEventListener("click", mudarTelaLogin);
