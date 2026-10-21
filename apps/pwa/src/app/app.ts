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
    { ruta: '/plan', texto: 'Hoy' },
    { ruta: '/cafeina', texto: 'Cafeína' },
    { ruta: '/aptitud', texto: 'Pre-salida' },
    { ruta: '/diario', texto: 'Diario' },
  ];
}
