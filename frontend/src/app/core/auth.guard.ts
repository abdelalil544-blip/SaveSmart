import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { TokenService } from './token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  return !!tokenService.getAccessToken();
};
