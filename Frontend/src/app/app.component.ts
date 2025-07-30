import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AiAgentComponent } from './components/ai-agent/ai-agent.component'; // ✅ import it

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AiAgentComponent], // ✅ add here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private previousUrl: string | null = null;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.previousUrl = this.router.url;
        }

        if (event instanceof NavigationEnd) {
          if (
            this.previousUrl &&
            this.previousUrl !== '/' &&
            event.urlAfterRedirects === this.previousUrl
          ) {
            this.router.navigateByUrl('/');
            return;
          }

          this.ngZone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, behavior: 'auto' });
            });
          });
        }
      });
    }
  }
}
