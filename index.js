const express = require('express')
const { response } = require('express')
const server = express()

server.use(express.json())

const usuarios = [
  { id: 1, nome: 'João', sobrenome: 'Silva', idade: 25},
  { id: 2, nome: 'Ana', sobrenome: 'Ferreira', idade: 30},
]

function checarCampos(request, response, next) {
  const { id, nome, sobrenome, idade} = request.body
  if((id === undefined || id === "") || (nome === undefined || nome === "") || (sobrenome === undefined || sobrenome === "") || ( idade === undefined || idade === "")) {
    return response.status(400).json({ Mensagem: 'O campo id ou nome ou sobrenome ou idade não existe no corpo da requisição'})
  }

  return next()
}

function checarID(request, response, next) {
  const id = request.params.id
  const usuarioExistente = usuarios.filter(usuario => usuario.id === Number(id))
  if (usuarioExistente.length === 0) {
    return response.status(400).json({ Mensagem: 'Não existe informação com este id ou matricula ou código.' })
  }
  return next()
}

server.get('/usuarios', (request, response) => {
  return response.json(usuarios)
})

server.post('/usuarios', checarCampos, (request, response) => {
  usuarios.push(request.body);
  const ultimoUsuario = usuarios[usuarios.length - 1]
  return response.json(ultimoUsuario)
})

server.get('/usuarios/:id', checarID, (request, response) => {
  const id = request.params.id
  const usuarioFiltrado = usuarios.find( usuario => usuario.id === Number(id))
  return response.json(usuarioFiltrado)
})

server.put('/usuarios/:id', checarCampos, checarID, (request, response) => {
  const id = request.params.id
  let indice = 0
  usuarios.forEach((usuario, index) => {
    if(usuario.id === Number(id)) {
      usuarios[index] = request.body
      indice = index
    }
  });

  return response.json(usuarios[indice])
})

server.delete('/usuarios/:id', checarID, (request, response) => {
  const id = request.params.id
  usuarios.forEach((usuario, index) => {
    if (usuario.id === Number(id)) {
      usuarios.splice(index, 1)
    }
  })

  return response.json(usuarios)
})

server.listen(3333)