const http = require('http');

const s = http.createServer((req, res) => {
  if (req.url === '/salud') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ estado: 'ok' }));
    return;
  }

  if (req.url === '/equipo') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      equipo: 'Individual - Santiago Penso',
      integrantes: ['Santiago José Penso Peña']
    }));
    return;
  }

  if (req.url === '/notas') {
    const d = [4.5, 3.5, 2.5, 4.0];
    let t = 0;
    for (let i = 0; i < d.length; i++) {
      t += d[i];
    }
    const p = t / d.length;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ promedio: p, aprobado: p >= 3.0 }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

const PORT = process.env.PORT || 3000;
s.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
