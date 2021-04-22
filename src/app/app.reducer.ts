import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

// Since the training module will be loaded lazily, we cannot load it in the app.reducer.ts, because it will require to
// load training reducer and actions ahead of time, and we won't have that info at that point. So, what we have to do is to
// load the state lazily too
export interface State {
  ui: fromUi.State;
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer,
}

export const getUiState = createFeatureSelector<fromUi.State>('ui');
// These selectors can be used later on with the select() function. e.g. in login.component.ts
// we can use this.isLoading$ = this.store.select(fromRoot.getIsLoading) to get isLoading state from the reducer
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);