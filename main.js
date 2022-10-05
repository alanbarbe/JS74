const http = require('http')
const fs = require('fs')
const url = require('url')

const mime = {
  'html': 'text/html',
  'css': 'text/css',
  'jpg': 'image/jpg',
  'ico': 'image/x-icon',
  'mp3': 'audio/mpeg3',
  'mp4': 'video/mp4'
}

const servidor = http.createServer((pedido, respuesta) => {
  const objetourl = url.parse(pedido.url)
  let camino = 'public' + objetourl.pathname;
  if (camino == 'public/')
    camino = 'public/index.html'
  encaminar(pedido, respuesta, camino)
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 8888;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
servidor.listen(server_port, server_host, function() {
console.log('Listening on port %d', server_port);
});


function encaminar(pedido, respuesta, camino) {
  console.log(camino)
  switch (camino) {
    case 'public/recuperardatos': {
      recuperar(pedido, respuesta)
      break
    }
    default: {
      fs.stat(camino, error => {
        if (!error) {
          fs.readFile(camino, (error, contenido) => {
            if (error) {
              respuesta.writeHead(500, { 'Content-Type': 'text/plain' })
              respuesta.write('Error interno')
              respuesta.end()
            } else {
              const vec = camino.split('.')
              const extension = vec[vec.length - 1]
              const mimearchivo = mime[extension]
              respuesta.writeHead(200, { 'Content-Type': mimearchivo })
              respuesta.write(contenido)
              respuesta.end()
            }
          })
        } else {
          respuesta.writeHead(404, { 'Content-Type': 'text/html' })
          respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>')
          respuesta.end()
        }
      })
    }
  }
}


function recuperar(pedido, respuesta) {
  let info = ''
  pedido.on('data', datosparciales => {
    info += datosparciales
  })
  pedido.on('end', () => {
    const formulario = new URLSearchParams(info)
    console.log(formulario)
    respuesta.writeHead(200, { 'Content-Type': 'text/html' })

    let num = formulario.get('num');
     
    respuesta.write("<p style='text-align: center'>")
      for (let i = 1; i <= num; i++) {
        let espacios = ""

        for (let j = 1; j <= num; j++) {
          espacios += " "
        }

        let asteriscos = ""

        for(let k = 1; k<=i; k++){
          asteriscos += "*"
          
          if(k != i){
            asteriscos += "O"
          }
        }
      
        respuesta.write(asteriscos + "<br>")

      }
      respuesta.write("</p>")
      respuesta.write("<a href='index.html'>Retornar</a>")
      respuesta.end()
    })
}
