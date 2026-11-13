import { createServer, request } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const puerto = Number(process.env.PORT) || 5173;
const api = new URL(process.env.API_URL || 'http://127.0.0.1:3100');
const PUBLICOS = ['index.html', 'css', 'js', 'json'];

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function responder(res, estado, texto) {
  res.writeHead(estado, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(texto);
}

async function servirArchivo(req, res) {
  let ruta;
  try {
    ruta = decodeURIComponent(new URL(req.url, 'http://local').pathname);
  } catch {
    return responder(res, 400, 'Solicitud no valida');
  }

  const relativa = ruta === '/' ? 'index.html' : ruta.slice(1);
  if (!PUBLICOS.includes(relativa.split('/')[0])) return responder(res, 404, 'No encontrado');

  const archivo = path.resolve(raiz, relativa);
  if (!archivo.startsWith(raiz + path.sep)) return responder(res, 403, 'Acceso denegado');

  try {
    const contenido = await readFile(archivo);
    res.writeHead(200, {
      'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(contenido);
  } catch {
    responder(res, 404, 'No encontrado');
  }
}

function reenviarApi(req, res) {
  const peticion = request(
    {
      hostname: api.hostname,
      port: api.port,
      path: req.url,
      method: req.method,
      headers: req.headers
    },
    (respuesta) => {
      res.writeHead(respuesta.statusCode, respuesta.headers);
      respuesta.pipe(res);
    }
  );
  peticion.on('error', () => responder(res, 502, 'No se pudo conectar con la API'));
  req.pipe(peticion);
}

createServer((req, res) => {
  if (req.url.startsWith('/api/') || req.url === '/api') return reenviarApi(req, res);
  servirArchivo(req, res);
}).listen(puerto, '127.0.0.1', () => {
  console.log(`Frontend en http://localhost:${puerto} (API en ${api.origin})`);
});
