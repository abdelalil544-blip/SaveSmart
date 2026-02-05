import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { TokenService } from './token.service';

const AUTH_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/api/auth/logout'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const token = tokenService.getAccessToken();
  const shouldSkip = AUTH_PATHS.some((path) => req.url.includes(path));

  const authReq = token && !shouldSkip
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || shouldSkip) {
        return throwError(() => error);
      }

      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        return throwError(() => error);
      }

      return authService.refresh(refreshToken).pipe(
        switchMap((response) => {
          tokenService.setTokens(response.accessToken, response.refreshToken, response.user?.id);
          const retry = req.clone({
            setHeaders: { Authorization: `Bearer ${response.accessToken}` }
          });
          return next(retry);
        }),
        catchError((refreshError) => {
          tokenService.clear();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
