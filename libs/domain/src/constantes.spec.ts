import {
  CATEGORIA_RMEQ_SIN_RESPUESTA,
  CONDUCCION_MAX_ACUMULADA_H,
  CONDUCCION_MAX_DIURNA_H,
  CONDUCCION_MAX_NOCTURNA_H,
  CONDUCCION_VENTANA_H,
  CORTE_CAFEINA_ANTES_DORMIR_H,
  HORA_FIN_NOCTURNO,
  HORA_INICIO_NOCTURNO,
  OPORTUNIDAD_SUENO_MIN_H,
  RANGOS_RMEQ,
  RMEQ_PUNTAJE_MAX,
  RMEQ_PUNTAJE_MIN,
  SEMAFORO_AMBAR_MIN_H,
  SEMAFORO_ROJO_SOMNOLENCIA_MIN,
  SEMAFORO_VERDE_MIN_H,
  SEMIVIDA_H_DEFECTO,
  SEMIVIDA_H_FUMADOR,
  SEMIVIDA_H_METABOLIZADOR_LENTO,
  SIESTA_DURACION_MIN,
  SIESTA_FIN_ANTES_TURNO_MIN,
  UMBRAL_CAFEINA_MG_DEFECTO,
} from './constantes';

describe('constantes de reglas de negocio', () => {
  it('RN01: 4 h nocturno, 5 h diurno, 10 h en ventana de 24 h, nocturno 22:00-05:59', () => {
    expect(CONDUCCION_MAX_NOCTURNA_H).toBe(4);
    expect(CONDUCCION_MAX_DIURNA_H).toBe(5);
    expect(CONDUCCION_MAX_ACUMULADA_H).toBe(10);
    expect(CONDUCCION_VENTANA_H).toBe(24);
    expect(HORA_INICIO_NOCTURNO).toBe(22);
    expect(HORA_FIN_NOCTURNO).toBe(6);
  });

  it('RN02: umbral de cafeina de 50 mg', () => {
    expect(UMBRAL_CAFEINA_MG_DEFECTO).toBe(50);
  });

  it('RN03: semivida 5 h, 3 h fumador, 8 h metabolizador lento', () => {
    expect(SEMIVIDA_H_DEFECTO).toBe(5);
    expect(SEMIVIDA_H_FUMADOR).toBe(3);
    expect(SEMIVIDA_H_METABOLIZADOR_LENTO).toBe(8);
  });

  it('RN05: corte como maximo dormir - 6 h', () => {
    expect(CORTE_CAFEINA_ANTES_DORMIR_H).toBe(6);
  });

  it('RN06: 7 h de oportunidad, siesta de 90 min que termina 60 min antes', () => {
    expect(OPORTUNIDAD_SUENO_MIN_H).toBe(7);
    expect(SIESTA_DURACION_MIN).toBe(90);
    expect(SIESTA_FIN_ANTES_TURNO_MIN).toBe(60);
  });

  it('RN07: rangos rMEQ contiguos de 4 a 25 y sin respuesta = intermedio', () => {
    expect(RANGOS_RMEQ.map((r) => [r.categoria, r.min, r.max])).toEqual([
      ['vespertino_definido', 4, 7],
      ['vespertino_moderado', 8, 11],
      ['intermedio', 12, 17],
      ['matutino_moderado', 18, 21],
      ['matutino_definido', 22, 25],
    ]);
    expect(RANGOS_RMEQ[0].min).toBe(RMEQ_PUNTAJE_MIN);
    expect(RANGOS_RMEQ[RANGOS_RMEQ.length - 1].max).toBe(RMEQ_PUNTAJE_MAX);
    RANGOS_RMEQ.slice(1).forEach((r, i) =>
      expect(r.min).toBe(RANGOS_RMEQ[i].max + 1),
    );
    expect(CATEGORIA_RMEQ_SIN_RESPUESTA).toBe('intermedio');
  });

  it('RN09: verde >= 7 h, ambar 5-7 h, rojo < 5 h o somnolencia >= 4', () => {
    expect(SEMAFORO_VERDE_MIN_H).toBe(7);
    expect(SEMAFORO_AMBAR_MIN_H).toBe(5);
    expect(SEMAFORO_ROJO_SOMNOLENCIA_MIN).toBe(4);
  });
});
