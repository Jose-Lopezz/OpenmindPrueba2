import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSnackBarModule],
  template: `
    <div class="gradient-bg">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'EduPlatform';
}