import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { TokenService } from './token.service';

export const adminGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  return tokenService.getUserRole() === 'ROLE_ADMIN';
};
