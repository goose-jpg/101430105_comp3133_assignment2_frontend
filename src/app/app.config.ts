import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const authMiddleware = new ApolloLink((operation, forward) => {
        const token = localStorage.getItem('auth_token');
        operation.setContext(({ headers = new HttpHeaders() }) => ({
          headers: new HttpHeaders({
            Authorization: token ? `Bearer ${token}` : ''
          })
        }));
        return forward(operation);
      });

      return {
        link: authMiddleware.concat(
          httpLink.create({ uri: 'https://one01430105-comp3133-assignment2-backend.onrender.com' })
        ),
        cache: new InMemoryCache()
      };
    })
  ]
};