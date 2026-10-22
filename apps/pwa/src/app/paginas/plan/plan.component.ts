import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-900 text-white p-4 flex flex-col gap-4 font-sans max-w-md mx-auto w-full">
      
      <div class="mb-2">
        <h1 class="text-2xl font-bold">Mi plan del día</h1>
        <p class="text-sm text-slate-400">Turno en curso</p>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="bg-slate-800 p-3 rounded-2xl flex flex-col justify-center">
          <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Luz natural</span>
          <span class="text-xl font-bold text-emerald-400">06:30</span>
        </div>
        <div class="bg-slate-800 p-3 rounded-2xl flex flex-col justify-center">
          <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Café hasta</span>
          <span class="text-xl font-bold text-amber-400">14:30</span>
        </div>
        <div class="bg-slate-800 p-3 rounded-2xl flex flex-col justify-center">
          <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Próx. pico</span>
          <span class="text-xl font-bold text-indigo-400">10:15</span>
        </div>
      </div>

      <div class="bg-slate-800 p-4 rounded-2xl mt-2">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-sm font-semibold">Tu energía en las próximas horas</h3>
          <span class="text-xs text-slate-500">24 h</span>
        </div>
        
        <div class="flex items-end justify-between h-24 gap-[2px]">
          @for (b of barras; track b.hora) {
            <div
              class="w-full rounded-t-sm transition-all duration-300"
              [ngClass]="{
                'bg-red-500': b.hora === horaActual(),
                'bg-indigo-500': b.esPico,
                'bg-slate-700': !b.esPico && b.hora !== horaActual()
              }"
              [style.height.%]="b.valor"
              title="{{b.hora}}h"
            ></div>
          }
        </div>
        <div class="flex justify-between text-[11px] text-slate-400 mt-3 font-medium">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span> Ahora</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-indigo-500"></span> Pico</span>
        </div>
      </div>

      @if (mostrarValle()) {
        <div class="bg-red-950/40 border border-red-900/50 p-4 rounded-2xl flex gap-4 items-center mt-2">
          <div class="w-10 h-10 rounded-full bg-red-900/80 flex-shrink-0"></div>
          <div>
            <h3 class="font-bold text-white mb-1 text-sm">Valle circadiano</h3>
            <p class="text-xs text-slate-300 leading-tight">Evita decisiones críticas entre 15:00 y 16:30.</p>
          </div>
        </div>
      }
    </div>
  `
})
export class PlanComponent {
  horas = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  horaActual = signal(new Date().getHours());
  mostrarValle = signal(true);

  barras = Array.from({ length: 24 }, (_, i) => ({
    hora: i,
    valor: 20 + Math.round(Math.abs(Math.sin(i / 3)) * 80),
    esPico: i === 10
  }));
}


