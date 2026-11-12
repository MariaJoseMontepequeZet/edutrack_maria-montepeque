import { createRequire } from 'node:module';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);

const eventos = [];
globalThis.window = { EduTrack: {} };
globalThis.document = { dispatchEvent: (evento) => eventos.push(evento.type) };
globalThis.CustomEvent = class {
  constructor(type) {
    this.type = type;
  }
};

require('../js/Api.js');
const { api } = globalThis.window.EduTrack;

function responder(estado, cuerpo) {
  return {
    status: estado,
    ok: estado >= 200 && estado < 300,
    json: async () => {
      if (cuerpo === undefined) throw new Error('sin cuerpo');
      return cuerpo;
    }
  };
}

beforeEach(() => {
  eventos.length = 0;
  vi.restoreAllMocks();
});

describe('cliente de la API', () => {
  it('envia JSON y las cookies del mismo origen', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(responder(200, { usuario: { id: 1 } }));
    vi.stubGlobal('fetch', fetchFalso);

    const respuesta = await api.post('/api/auth/login', { email: 'a@b.co' });

    expect(respuesta).toEqual({ usuario: { id: 1 } });
    expect(fetchFalso).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: '{"email":"a@b.co"}'
    });
  });

  it('no envia cuerpo ni tipo de contenido en las consultas', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(responder(200, { usuarios: [] }));
    vi.stubGlobal('fetch', fetchFalso);

    await api.get('/api/usuarios');

    expect(fetchFalso.mock.calls[0][1]).toEqual({
      method: 'GET',
      credentials: 'same-origin',
      headers: {}
    });
  });

  it('devuelve null cuando la respuesta es 204', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(responder(204)));

    expect(await api.delete('/api/usuarios/3')).toBeNull();
  });

  it('convierte un error del servidor en ErrorApi con codigo y campos', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        responder(400, {
          error: 'Revisa los datos',
          codigo: 'DATOS_INVALIDOS',
          campos: { email: 'mal' }
        })
      )
    );

    const error = await api.post('/api/auth/registro', {}).catch((e) => e);

    expect(error).toBeInstanceOf(api.ErrorApi);
    expect(error).toMatchObject({
      estado: 400,
      codigo: 'DATOS_INVALIDOS',
      message: 'Revisa los datos',
      campos: { email: 'mal' }
    });
  });

  it('muestra un mensaje amable cuando el servidor falla sin JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(responder(502)));

    const error = await api.get('/api/usuarios').catch((e) => e);

    expect(error.estado).toBe(502);
    expect(error.message).toMatch(/no está disponible/);
  });

  it('informa cuando no hay conexion', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('failed')));

    const error = await api.get('/api/usuarios').catch((e) => e);

    expect(error).toMatchObject({ estado: 0, codigo: 'SIN_CONEXION' });
  });
});

describe('aviso de sesion expirada', () => {
  async function pedirConEstado(metodo, ruta, estado) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(responder(estado, { error: 'x' })));
    const llamada = { get: api.get, post: api.post, patch: api.patch, delete: api.delete }[metodo];
    await llamada(ruta, {}).catch(() => {});
  }

  it('se avisa cuando una ruta protegida responde 401', async () => {
    await pedirConEstado('get', '/api/usuarios', 401);
    await pedirConEstado('patch', '/api/auth/yo', 401);
    await pedirConEstado('delete', '/api/usuarios/2', 401);

    expect(eventos).toEqual([
      'studentscope:sesion-expirada',
      'studentscope:sesion-expirada',
      'studentscope:sesion-expirada'
    ]);
  });

  it('no se avisa en login, registro, cierre de sesion ni en la consulta inicial', async () => {
    await pedirConEstado('post', '/api/auth/login', 401);
    await pedirConEstado('post', '/api/auth/registro', 401);
    await pedirConEstado('post', '/api/auth/logout', 401);
    await pedirConEstado('get', '/api/auth/yo', 401);

    expect(eventos).toEqual([]);
  });

  it('no se avisa con otros codigos de error', async () => {
    await pedirConEstado('get', '/api/usuarios', 403);
    await pedirConEstado('get', '/api/usuarios', 500);

    expect(eventos).toEqual([]);
  });
});
