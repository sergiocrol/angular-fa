import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  maxDate: Date;
  isLoading$: Observable<boolean>;
  private isLoadingSubs: Subscription;

  onSubmit(form: NgForm) {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.isLoadingSubs = this.uiService.loadingStateChanged.subscribe(
    //   (isLoading) => {
    //     this.isLoading = isLoading;
    //   }
    // );
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }

  constructor(private authService: AuthService, private uiService: UIService, private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  // ngOnDestroy(): void {
  //   if (this.isLoadingSubs) {
  //     this.isLoadingSubs.unsubscribe();
  //   }
  // }
}
