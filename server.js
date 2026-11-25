const http = require('http');

const PUERTO = process.env.PORT || 80;
const NOTA_MINIMA_APROBACION = 3.0;
const notasDelCurso = [4.5, 3.5, 2.5, 4.0];

function calcularPromedio(notas) {
  const sumaTotal = notas.reduce((acumulador, nota) => acumulador + nota, 0);
  return sumaTotal / notas.length;
}

function estaAprobado(promedio) {
  return promedio >= NOTA_MINIMA_APROBACION;
}

function responderJSON(res, codigoEstado, datos) {
  res.writeHead(codigoEstado, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(datos, null, 2));
}

function manejarPeticion(req, res) {
  if (req.url === '/salud') {
    responderJSON(res, 200, { estado: 'ok' });
    return;
  }

  if (req.url === '/equipo') {
    responderJSON(res, 200, {
      equipo: 'Individual - Santiago Penso',
      integrantes: ['Santiago José Penso Peña']
    });
    return;
  }

  if (req.url === '/notas') {
    const promedioCalculado = calcularPromedio(notasDelCurso);
    responderJSON(res, 200, {
      promedio: promedioCalculado,
      aprobado: estaAprobado(promedioCalculado)
    });
    return;
  }

  responderJSON(res, 404, { error: 'Ruta no encontrada' });
}

const servidor = http.createServer(manejarPeticion);
servidor.listen(PUERTO);