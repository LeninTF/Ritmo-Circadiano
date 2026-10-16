import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly enlaces = [
    { ruta: '/plataforma', texto: 'Inicio' },
    { ruta: '/turnos', texto: 'Turnos' },
    { ruta: '/plan', texto: 'Plan' },
    { ruta: '/cafeina', texto: 'Cafeina' },
    { ruta: '/diario', texto: 'Diario' },
  ];
}
