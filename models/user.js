class Usuario {
  id; //(automático json-server)
  tipo;
  nome;
  dataNascimento; // salvar como objeto Date e não como string '10/05/1990' por exemplo
  email;
  senha;
  candidaturas = []; // lista de Candidatura

  constructor(tipo, nome, dataNascimento, email, senha, candidatura) {
    this.tipo = tipo;
    this.nome = nome;
    this.dataNascimento = dataNascimento;
    this.email = email;
    this.senha = senha;
    this.candidaturas.push(candidatura);
  }
  inserirCandidatura(idVaga) {
    this.candidaturas.push(idVaga);
  }
}

class Candidatura {
  idVaga;
  idCandidato;
  reprovado; // true or false

  constructor(idVaga, idCandidato, reprovado) {
    this.idVaga = idVaga;
    this.idCandidato = idCandidato;
    this.reprovado = reprovado;
  }
}

class Vaga {
  id; //(automático json-server)
  titulo;
  descricao;
  remuneracao; //(salvar no formato: R$ 3200.50)
  candidatos = []; // lista de Trabalhadores candidatados na vaga

  constructor(titulo, descricao, remuneracao, candidatos) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.remuneracao = remuneracao;
    this.candidatos = candidatos;
  }
}
