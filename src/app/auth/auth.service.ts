import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store'; 

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private training: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    // This is a handy and clean way that angularFire offers us to handle the auth state changes
    // ***IMPORTANT*** This will be called globally when our app starts (app.component.ts)
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.store.dispatch(new Auth.SetAthenticated());
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.training.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnathenticated());
        // this.isAuthenticated = true;
        // this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    // AngularFire, under the hood, already manage the authentication. It stores the token that we receive, and attach it to outgoing requests
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.auth.signOut();
  }

  // isAuth() {
  //   return this.isAuthenticated;
  // }
}
