import {
  Component,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from 'src/app/auth/auth.service';

import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // With Output we make this event listenable from outside
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  authSubscription: Subscription;

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    // We subscribe to out authService authChange in order to listen to any changes
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
    // this.authSubscription = this.authService.authChange.subscribe(
    //   (authStatus) => {
    //     // We receive this authStatus data whenever we execute .next() in our service
    //     this.isAuth = authStatus;
    //   }
    // );
  }

  // ngOnDestroy(): void {
  //   if (this.authSubscription) {
  //     this.authSubscription.unsubscribe(); 
  // }
}
