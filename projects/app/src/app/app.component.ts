import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import '@material/web/all';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <header class="tqpas-elevation-3 tqpas-elevation-shadow">TQPS</header>
    <section>
      <router-outlet />
    </section>
  `,
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  constructor() {
    (window as any)['debug'] = {
      router: inject(Router),
    };
  }
}
