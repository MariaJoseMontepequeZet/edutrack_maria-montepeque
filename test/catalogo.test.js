import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const catalogo = require('../js/Catalogo.js');
const validar = require('../js/Validacion.js');

const CATEGORIAS = ['web', 'data', 'devops', 'mobile', 'design', 'seguridad', 'marketing'];

describe('catalogo de cursos', () => {
  it('tiene 30 cursos con nombres unicos', () => {
    expect(catalogo.cursos).toHaveLength(30);
    expect(new Set(catalogo.nombres).size).toBe(30);
  });

  it('cada curso tiene los datos que usa la interfaz', () => {
    catalogo.cursos.forEach((curso) => {
      expect(curso.nombre.trim()).not.toBe('');
      expect(CATEGORIAS).toContain(curso.categoria);
      expect(['Básico', 'Intermedio', 'Avanzado']).toContain(curso.nivel);
      expect(['Básico', 'Estándar', 'Premium']).toContain(curso.precio);
      expect(curso.semanas).toBeGreaterThan(0);
      expect(curso.instructor.trim()).not.toBe('');
      expect(curso.descripcion.trim()).not.toBe('');
    });
  });

  it('el validador usa exactamente los nombres del catalogo', () => {
    expect(validar.CURSOS_VALIDOS).toEqual(catalogo.nombres);
  });
});
