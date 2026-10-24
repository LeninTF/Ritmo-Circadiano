import { TestBed } from '@angular/core/testing';
import { OutboxService } from '../../core/offline/outbox.service';
import { DiarioService, FormularioDiario, aPayloadDiario } from './diario.service';

const FORMULARIO: FormularioDiario = {
  fecha: '2026-10-21',
  horaAcostarse: '23:30',
  horaDespertar: '07:15',
  latenciaMin: 10,
  despertares: 1,
  calidadPercibida: 4,
  fatigaPercibida: 2,
  esDiaLaboral: true,
  luzMatutinaMin: 30,
};

describe('aPayloadDiario', () => {
  it('si se acuesta antes de medianoche, la hora de acostarse es la noche previa', () => {
    const p = aPayloadDiario(FORMULARIO);
    expect(p.horaAcostarse).toBe(new Date(2026, 9, 20, 23, 30).toISOString());
    expect(p.horaDespertar).toBe(new Date(2026, 9, 21, 7, 15).toISOString());
    expect(p).toMatchObject({ fecha: '2026-10-21', calidadPercibida: 4, luzMatutinaMin: 30 });
  });

  it('si se acuesta después de medianoche (o tras turno nocturno), ambas horas son del mismo día', () => {
    const p = aPayloadDiario({ ...FORMULARIO, horaAcostarse: '07:00', horaDespertar: '14:00' });
    expect(p.horaAcostarse).toBe(new Date(2026, 9, 21, 7, 0).toISOString());
    expect(p.horaDespertar).toBe(new Date(2026, 9, 21, 14, 0).toISOString());
  });
});

describe('DiarioService', () => {
  it('encola la operacion diario, dispara la sincronizacion y devuelve el client_id', async () => {
    const outbox = { enqueue: jest.fn().mockResolvedValue('cid-1'), sync: jest.fn().mockResolvedValue(undefined) };
    TestBed.configureTestingModule({ providers: [{ provide: OutboxService, useValue: outbox }] });

    await expect(TestBed.inject(DiarioService).guardarDiario(FORMULARIO)).resolves.toBe('cid-1');
    expect(outbox.enqueue).toHaveBeenCalledWith({ operation: 'diario', payload: aPayloadDiario(FORMULARIO) });
    expect(outbox.sync).toHaveBeenCalled();
  });
});
