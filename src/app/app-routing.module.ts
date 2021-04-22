import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { WelcomeComponent } from './welcome/welcome.component';

// The loadChildren is used when we want to load a module lazily. This is not the case of Auth module, because we want to be load
// instantly, but yes with Training module, because it won't be loaded until we login the first time
// canLoad is equal to canActivate. We do not use canActivate on training-routing.module because otherwise we'd be doing the verification after lazy loading
// and is better to do it before to lazy load the module in case we don't want to load it
const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'training',
    loadChildren: () =>
      import('./training/training.module').then((m) => m.TrainingModule),
    canLoad: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
