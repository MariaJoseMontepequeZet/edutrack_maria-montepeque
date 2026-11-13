import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const validar = require('../js/Validacion.js');

const CURSOS = validar.CURSOS_VALIDOS;

function registro(id, cambios = {}) {
  return {
    id,
    nombre: 'Ana',
    apellido: 'Lopez',
    email: `ana${id}@correo.com`,
    ciudad: 'Bogotá',
    curso: CURSOS[id % CURSOS.length],
    progreso: 60,
    fechaInscripcion: '2024-06-15',
    plan: 'Básico',
    montoUSD: 29.99,
    activo: id % 2 === 0,
    ...cambios
  };
}

function datasetBase(cantidad = 10) {
  return Array.from({ length: cantidad }, (_, i) => registro(i + 1));
}

function conCambios(cambios, id = 5) {
  return datasetBase().map((r) => (r.id === id ? { ...r, ...cambios } : r));
}

function sinCampo(campo, id = 5) {
  return datasetBase().map((r) => {
    if (r.id !== id) return r;
    const copia = { ...r };
    delete copia[campo];
    return copia;
  });
}

function hallazgos(dataset, regla) {
  return validar.dataset(dataset).errores.filter((e) => e.regla === regla);
}

describe('dataset valido', () => {
  it('no reporta ningun problema con un dataset correcto', () => {
    const resultado = validar.dataset(datasetBase());

    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toEqual([]);
    expect(resultado.registrosValidos).toHaveLength(10);
    expect(resultado.registrosInvalidos).toHaveLength(0);
  });

  it('genera un reporte legible', () => {
    const resultado = validar.dataset(datasetBase());

    expect(resultado.reporte).toContain('Reporte de Meta-Validación');
    expect(resultado.reporte).toContain('Registros total : 10');
  });
});

describe('V-00 argumento invalido', () => {
  it('rechaza un valor que no es un arreglo', () => {
    const resultado = validar.dataset('texto');

    expect(resultado.valido).toBe(false);
    expect(resultado.errores[0].regla).toBe('V-00');
  });

  it('rechaza un arreglo vacio', () => {
    const resultado = validar.dataset([]);

    expect(resultado.valido).toBe(false);
    expect(resultado.errores[0].regla).toBe('V-00');
  });
});

describe('V-01 campos requeridos', () => {
  it('detecta un campo ausente', () => {
    const encontrados = hallazgos(sinCampo('email'), 'V-01');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0]).toMatchObject({ nivel: 'ERROR', id: 5, campo: 'email' });
  });

  it('detecta un campo con valor null', () => {
    expect(hallazgos(conCambios({ ciudad: null }), 'V-01')).toHaveLength(1);
  });

  it('acepta un registro completo', () => {
    expect(hallazgos(datasetBase(), 'V-01')).toHaveLength(0);
  });
});

describe('V-02 tipos de dato', () => {
  it('detecta un progreso como texto', () => {
    const encontrados = hallazgos(conCambios({ progreso: '60' }), 'V-02');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0]).toMatchObject({ nivel: 'ERROR', campo: 'progreso' });
  });

  it('no duplica el error cuando el campo esta ausente', () => {
    expect(hallazgos(sinCampo('progreso'), 'V-02')).toHaveLength(0);
  });
});

describe('V-03 id entero positivo', () => {
  it('rechaza un id con decimales', () => {
    expect(hallazgos(conCambios({ id: 1.5 }), 'V-03')).toHaveLength(1);
  });

  it('rechaza un id negativo', () => {
    expect(hallazgos(conCambios({ id: -4 }), 'V-03')).toHaveLength(1);
  });

  it('acepta ids enteros positivos', () => {
    expect(hallazgos(datasetBase(), 'V-03')).toHaveLength(0);
  });
});

describe('V-04 formato de email', () => {
  it('rechaza un email sin arroba', () => {
    expect(hallazgos(conCambios({ email: 'sin-arroba.com' }), 'V-04')).toHaveLength(1);
  });

  it('rechaza un email sin extension', () => {
    expect(hallazgos(conCambios({ email: 'ana@correo' }), 'V-04')).toHaveLength(1);
  });

  it('acepta guiones, signo mas y subdominios', () => {
    const dataset = conCambios({ email: 'ana.perez+tag@mail-server.empresa.co' });

    expect(hallazgos(dataset, 'V-04')).toHaveLength(0);
  });
});

describe('V-05 nombre y apellido', () => {
  it('rechaza un nombre con solo espacios', () => {
    const encontrados = hallazgos(conCambios({ nombre: '   ' }), 'V-05');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].campo).toBe('nombre');
  });

  it('rechaza un apellido vacio', () => {
    expect(hallazgos(conCambios({ apellido: '' }), 'V-05')).toHaveLength(1);
  });
});

describe('V-06 ciudad (advertencia)', () => {
  it('advierte de una ciudad fuera del listado sin bloquear el registro', () => {
    const resultado = validar.dataset(conCambios({ ciudad: 'Ciudad Inventada' }));
    const encontrados = resultado.errores.filter((e) => e.regla === 'V-06');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nivel).toBe('WARNING');
    expect(resultado.valido).toBe(true);
    expect(resultado.registrosValidos).toHaveLength(10);
  });

  it('acepta una ciudad del listado', () => {
    expect(hallazgos(conCambios({ ciudad: 'Cali' }), 'V-06')).toHaveLength(0);
  });
});

describe('V-07 curso del catalogo', () => {
  it('rechaza un curso que no existe', () => {
    const resultado = validar.dataset(conCambios({ curso: 'Curso Falso' }));

    expect(resultado.errores.filter((e) => e.regla === 'V-07')).toHaveLength(1);
    expect(resultado.registrosInvalidos.map((r) => r.id)).toEqual([5]);
  });

  it('acepta todos los cursos del catalogo', () => {
    CURSOS.forEach((curso) => {
      expect(hallazgos(conCambios({ curso }), 'V-07')).toHaveLength(0);
    });
  });
});

describe('V-08 progreso', () => {
  it('rechaza un progreso mayor a 100', () => {
    const encontrados = hallazgos(conCambios({ progreso: 150 }), 'V-08');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nivel).toBe('ERROR');
  });

  it('rechaza un progreso negativo', () => {
    expect(hallazgos(conCambios({ progreso: -1 }), 'V-08')).toHaveLength(1);
  });

  it('advierte de un progreso con decimales', () => {
    const encontrados = hallazgos(conCambios({ progreso: 55.5 }), 'V-08');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nivel).toBe('WARNING');
  });

  it('acepta los limites 0 y 100', () => {
    expect(hallazgos(conCambios({ progreso: 0, activo: true }), 'V-08')).toHaveLength(0);
    expect(hallazgos(conCambios({ progreso: 100, activo: false }), 'V-08')).toHaveLength(0);
  });
});

describe('V-09 fecha de inscripcion', () => {
  it('rechaza un formato distinto de AAAA-MM-DD', () => {
    expect(hallazgos(conCambios({ fechaInscripcion: '15/06/2024' }), 'V-09')).toHaveLength(1);
  });

  it('rechaza una fecha inexistente', () => {
    expect(hallazgos(conCambios({ fechaInscripcion: '2024-13-45' }), 'V-09')).toHaveLength(1);
  });

  it('rechaza dias que no existen en el mes', () => {
    ['2023-02-30', '2023-04-31', '2023-02-29'].forEach((fecha) => {
      expect(hallazgos(conCambios({ fechaInscripcion: fecha }), 'V-09')).toHaveLength(1);
    });
  });

  it('acepta el 29 de febrero de un anio bisiesto', () => {
    expect(hallazgos(conCambios({ fechaInscripcion: '2024-02-29' }), 'V-09')).toHaveLength(0);
  });

  it('rechaza una fecha anterior al limite minimo', () => {
    expect(hallazgos(conCambios({ fechaInscripcion: '2022-12-31' }), 'V-09')).toHaveLength(1);
  });

  it('rechaza una fecha posterior al limite maximo', () => {
    expect(hallazgos(conCambios({ fechaInscripcion: '2099-01-01' }), 'V-09')).toHaveLength(1);
  });

  it('acepta el limite minimo', () => {
    expect(hallazgos(conCambios({ fechaInscripcion: '2023-01-01' }), 'V-09')).toHaveLength(0);
  });
});

describe('V-10 plan reconocido', () => {
  it('rechaza un plan que no existe', () => {
    const resultado = validar.dataset(conCambios({ plan: 'Platino' }));

    expect(resultado.errores.filter((e) => e.regla === 'V-10')).toHaveLength(1);
    expect(resultado.errores.filter((e) => e.regla === 'V-11')).toHaveLength(0);
  });

  it('acepta los tres planes oficiales', () => {
    Object.keys(validar.PLANES).forEach((plan) => {
      const dataset = conCambios({ plan, montoUSD: validar.PLANES[plan] });

      expect(hallazgos(dataset, 'V-10')).toHaveLength(0);
    });
  });
});

describe('V-11 monto coherente con el plan', () => {
  it('rechaza un monto que no corresponde al plan', () => {
    const encontrados = hallazgos(conCambios({ plan: 'Premium', montoUSD: 29.99 }), 'V-11');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].campo).toBe('montoUSD');
  });

  it('tolera el error de coma flotante', () => {
    expect(hallazgos(conCambios({ montoUSD: 29.990000001 }), 'V-11')).toHaveLength(0);
  });

  it('acepta el monto exacto de cada plan', () => {
    expect(hallazgos(conCambios({ plan: 'Estándar', montoUSD: 59.99 }), 'V-11')).toHaveLength(0);
  });
});

describe('V-12 activo booleano estricto', () => {
  it('rechaza un valor que no es booleano', () => {
    expect(hallazgos(conCambios({ activo: 1 }), 'V-12')).toHaveLength(1);
    expect(hallazgos(conCambios({ activo: 'true' }), 'V-12')).toHaveLength(1);
  });

  it('acepta true y false', () => {
    expect(hallazgos(conCambios({ activo: true }), 'V-12')).toHaveLength(0);
    expect(hallazgos(conCambios({ activo: false }), 'V-12')).toHaveLength(0);
  });
});

describe('V-13 coherencia entre progreso y estado', () => {
  it('informa de un estudiante al 100% que sigue activo', () => {
    const encontrados = hallazgos(conCambios({ progreso: 100, activo: true }), 'V-13');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nivel).toBe('INFO');
  });

  it('advierte de un inactivo con progreso bajo', () => {
    const encontrados = hallazgos(conCambios({ progreso: 30, activo: false }), 'V-13');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nivel).toBe('WARNING');
  });

  it('no reporta nada en casos coherentes', () => {
    expect(hallazgos(conCambios({ progreso: 80, activo: true }), 'V-13')).toHaveLength(0);
    expect(hallazgos(conCambios({ progreso: 100, activo: false }), 'V-13')).toHaveLength(0);
  });
});

describe('V-14 ids unicos', () => {
  it('detecta un id repetido y bloquea ambos registros', () => {
    const dataset = datasetBase();
    dataset[5] = { ...dataset[5], id: 1 };
    const resultado = validar.dataset(dataset);

    expect(resultado.errores.filter((e) => e.regla === 'V-14')).toHaveLength(1);
    expect(resultado.registrosInvalidos.every((r) => r.id === 1)).toBe(true);
    expect(resultado.registrosInvalidos).toHaveLength(2);
  });

  it('acepta ids distintos', () => {
    expect(hallazgos(datasetBase(), 'V-14')).toHaveLength(0);
  });
});

describe('V-15 emails unicos', () => {
  it('detecta emails repetidos sin distinguir mayusculas', () => {
    const dataset = conCambios({ email: 'Ana1@Correo.com' }, 5);
    const encontrados = hallazgos(dataset, 'V-15');
    const ids = encontrados.map((e) => e.id).sort((a, b) => a - b);

    expect(ids).toEqual([1, 5]);
  });

  it('acepta emails distintos', () => {
    expect(hallazgos(datasetBase(), 'V-15')).toHaveLength(0);
  });
});

describe('V-16 secuencia de ids', () => {
  it('informa de un salto en la secuencia', () => {
    const dataset = datasetBase().filter((r) => r.id !== 5);
    const encontrados = hallazgos(dataset, 'V-16');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nivel).toBe('INFO');
  });

  it('no informa nada con ids consecutivos', () => {
    expect(hallazgos(datasetBase(), 'V-16')).toHaveLength(0);
  });
});

describe('V-17 minimo de inactivos', () => {
  it('advierte cuando hay menos de cinco inactivos', () => {
    const dataset = datasetBase().map((r) => ({ ...r, activo: true }));
    const encontrados = hallazgos(dataset, 'V-17');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nivel).toBe('WARNING');
  });

  it('advierte con exactamente cuatro inactivos', () => {
    const dataset = datasetBase().map((r) => (r.id === 1 ? { ...r, activo: true } : r));

    expect(hallazgos(dataset, 'V-17')).toHaveLength(1);
  });

  it('acepta cinco inactivos', () => {
    expect(hallazgos(datasetBase(), 'V-17')).toHaveLength(0);
  });
});

describe('V-18 concentracion en un curso', () => {
  it('advierte cuando un curso supera el 60% del dataset', () => {
    const dataset = datasetBase().map((r, i) => (i < 7 ? { ...r, curso: CURSOS[0] } : r));
    const encontrados = hallazgos(dataset, 'V-18');

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nivel).toBe('WARNING');
  });

  it('no advierte con una distribucion equilibrada', () => {
    expect(hallazgos(datasetBase(), 'V-18')).toHaveLength(0);
  });
});

describe('V-19 monto positivo', () => {
  it('rechaza un monto en cero', () => {
    expect(hallazgos(conCambios({ montoUSD: 0 }), 'V-19')).toHaveLength(1);
  });

  it('rechaza un monto negativo', () => {
    expect(hallazgos(conCambios({ montoUSD: -5 }), 'V-19')).toHaveLength(1);
  });

  it('acepta un monto positivo', () => {
    expect(hallazgos(datasetBase(), 'V-19')).toHaveLength(0);
  });
});

describe('V-20 activo definido', () => {
  it('detecta el campo activo ausente', () => {
    expect(hallazgos(sinCampo('activo'), 'V-20')).toHaveLength(1);
  });

  it('no reporta cuando activo es false', () => {
    expect(hallazgos(conCambios({ activo: false }), 'V-20')).toHaveLength(0);
  });
});

describe('separacion de registros', () => {
  it('bloquea solo los registros con ERROR', () => {
    const resultado = validar.dataset(conCambios({ curso: 'Curso Falso', ciudad: 'Nueva' }));

    expect(resultado.valido).toBe(false);
    expect(resultado.resumen.errores).toBeGreaterThan(0);
    expect(resultado.registrosValidos).toHaveLength(9);
    expect(resultado.registrosInvalidos).toHaveLength(1);
  });
});

function unDiaDespues(iso) {
  const [anio, mes, dia] = iso.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia + 1);
  const dos = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

function hallazgosEn(dataset, regla, opciones) {
  return validar.dataset(dataset, opciones).errores.filter((e) => e.regla === regla);
}

describe('V-09 la fecha maxima es hoy', () => {
  const HOY = { hoy: '2026-11-13' };

  it('acepta la fecha de hoy y fechas posteriores a 2025', () => {
    expect(hallazgosEn(conCambios({ fechaInscripcion: '2026-11-13' }), 'V-09', HOY)).toHaveLength(
      0
    );
    expect(hallazgosEn(conCambios({ fechaInscripcion: '2025-12-31' }), 'V-09', HOY)).toHaveLength(
      0
    );
  });

  it('rechaza el dia siguiente a hoy', () => {
    const encontrados = hallazgosEn(conCambios({ fechaInscripcion: '2026-11-14' }), 'V-09', HOY);

    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].mensaje).toContain('2026-11-13');
  });

  it('sin opciones usa el dia de hoy de la computadora', () => {
    const hoy = validar.hoy();

    expect(hoy).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(hallazgos(conCambios({ fechaInscripcion: hoy }), 'V-09')).toHaveLength(0);
    expect(hallazgos(conCambios({ fechaInscripcion: unDiaDespues(hoy) }), 'V-09')).toHaveLength(1);
  });

  it('expone la primera fecha permitida', () => {
    expect(validar.FECHA_MINIMA).toBe('2023-01-01');
  });
});

describe('V-07 con el catalogo completo', () => {
  it('acepta los 30 cursos del catalogo, incluidos los que antes se rechazaban', () => {
    expect(CURSOS).toHaveLength(30);
    ['TypeScript Avanzado', 'Ethical Hacking', 'Scrum & Gestión Ágil'].forEach((curso) => {
      expect(hallazgos(conCambios({ curso }), 'V-07')).toHaveLength(0);
    });
  });
});

describe('datos que no son objetos', () => {
  it('no falla con null, numeros, textos ni arreglos dentro del dataset', () => {
    const sucio = [...datasetBase(), null, 42, 'texto', ['x']];
    const resultado = validar.dataset(sucio);

    expect(resultado.valido).toBe(false);
    expect(resultado.totalRegistros).toBe(14);
    expect(resultado.registrosValidos).toHaveLength(10);
    expect(resultado.registrosInvalidos).toHaveLength(4);
    expect(
      resultado.errores.filter((e) => e.regla === 'V-01' && e.campo === 'registro')
    ).toHaveLength(4);
  });

  it('un dataset con solo basura devuelve todo como invalido sin lanzar errores', () => {
    const resultado = validar.dataset([null, undefined, 1]);

    expect(resultado.registrosValidos).toHaveLength(0);
    expect(resultado.registrosInvalidos).toHaveLength(3);
  });
});

describe('validar un registro suelto', () => {
  const HOY = { hoy: '2026-11-13' };

  it('acepta un registro correcto', () => {
    const resultado = validar.registro(registro(1), HOY);

    expect(resultado.valido).toBe(true);
    expect(resultado.errores).toEqual([]);
  });

  it('detecta errores por campo con la regla que los causa', () => {
    const resultado = validar.registro(
      registro(1, { curso: 'Curso Falso', fechaInscripcion: '2030-01-01', progreso: 120 }),
      HOY
    );
    const reglas = resultado.errores.map((e) => `${e.campo}:${e.regla}`);

    expect(resultado.valido).toBe(false);
    expect(reglas).toEqual(
      expect.arrayContaining(['curso:V-07', 'fechaInscripcion:V-09', 'progreso:V-08'])
    );
  });

  it('las advertencias no invalidan el registro', () => {
    const resultado = validar.registro(registro(1, { ciudad: 'Ciudad Inventada' }), HOY);

    expect(resultado.valido).toBe(true);
    expect(resultado.errores.map((e) => e.regla)).toEqual(['V-06']);
  });

  it('no aplica las reglas que comparan varios registros', () => {
    const resultado = validar.registro(registro(1, { id: 9999, activo: true }), HOY);

    expect(resultado.errores.map((e) => e.regla)).not.toEqual(
      expect.arrayContaining(['V-14', 'V-15', 'V-17'])
    );
  });

  it('rechaza lo que no es un objeto sin lanzar errores', () => {
    [null, undefined, 5, 'texto', []].forEach((valor) => {
      const resultado = validar.registro(valor, HOY);

      expect(resultado.valido).toBe(false);
      expect(resultado.errores[0].regla).toBe('V-01');
    });
  });
});
