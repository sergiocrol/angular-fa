import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { pipe } from 'rxjs';
import { take } from 'rxjs/operators';

import * as fromRoot from '../app.reducer';

import { AuthService } from './auth.service';

// CanLoad is for the case that the module is loaded lazily
@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router, private store: Store<fromRoot.State>) {}

  canLoad(route: Route) {
    // Observable is a live sequence, always changing. With pipe and take we say we want take the first value and the close the connection
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }
}
