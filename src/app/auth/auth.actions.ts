import { Action } from "@ngrx/store";

export const SET_AUTHENTICATED = '[AUTH] Set Authenticated';
export const SET_UNAUTHENTICATED = '[AUTH] Set Unauthenticated';

export class SetAthenticated implements Action {
  readonly type = SET_AUTHENTICATED;
}

export class SetUnathenticated implements Action {
  readonly type = SET_UNAUTHENTICATED;
}

export type AuthActions = SetAthenticated | SetUnathenticated;