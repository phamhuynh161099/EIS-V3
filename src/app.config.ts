import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, RouteReuseStrategy, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AuthGuardService } from './app/guard/auth-guard.service';
import { AuthService } from './app/guard/auth.service';
import { RoleGuardService } from './app/guard/role/role-guard.service';
import { httpInterceptor } from './app/interceptors/http.interceptor';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { CustomReuseStrategy } from './app/strategy/custom-reuse-strategy';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(
            withFetch(),
            withInterceptors([authInterceptor])
        ),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        AuthService,
        RoleGuardService,
        AuthGuardService,
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        provideHttpClient(withInterceptors([httpInterceptor])), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),

        // Hỡ trợ simulator brower
        {
            provide: RouteReuseStrategy,
            useClass: CustomReuseStrategy
        }
    ]
};
