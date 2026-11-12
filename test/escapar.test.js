import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { escaparHTML, aNumero } = require('../js/Escapar.js');

describe('escaparHTML', () => {
  it('escapa los caracteres que permiten inyectar HTML', () => {
    expect(escaparHTML('<img src=x onerror="alert(1)">')).toBe(
      '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'
    );
  });

  it('escapa comillas simples y ampersands', () => {
    expect(escaparHTML("Tom & 'Jerry'")).toBe('Tom &amp; &#39;Jerry&#39;');
  });

  it('no escapa dos veces un texto ya escapado de forma distinta', () => {
    expect(escaparHTML('&lt;')).toBe('&amp;lt;');
  });

  it('devuelve cadena vacia para null y undefined', () => {
    expect(escaparHTML(null)).toBe('');
    expect(escaparHTML(undefined)).toBe('');
  });

  it('convierte numeros y booleanos a texto', () => {
    expect(escaparHTML(0)).toBe('0');
    expect(escaparHTML(false)).toBe('false');
  });

  it('deja intacto un texto sin caracteres especiales', () => {
    expect(escaparHTML('María Pérez')).toBe('María Pérez');
  });
});

describe('aNumero', () => {
  it('convierte textos numericos', () => {
    expect(aNumero('12')).toBe(12);
    expect(aNumero('3.5')).toBe(3.5);
  });

  it('devuelve 0 para valores no numericos', () => {
    expect(aNumero('x')).toBe(0);
    expect(aNumero(undefined)).toBe(0);
    expect(aNumero(NaN)).toBe(0);
    expect(aNumero(Infinity)).toBe(0);
  });

  it('conserva los numeros validos, incluido el cero', () => {
    expect(aNumero(0)).toBe(0);
    expect(aNumero(-4)).toBe(-4);
  });
});
