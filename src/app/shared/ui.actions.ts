import { Action } from "@ngrx/store";

export const START_LOADING = '[UI] Start Loading';
export const STOP_LOADING = '[UI] Stop Loading';

// Declaring the actions in this way we can dispatch them as -> this.store.dispatch(new UI.StartLoading) where UI is the imported ui.actions.ts
export class StartLoading implements Action {
  readonly type = START_LOADING;
}

export class StopLoading implements Action {
  readonly type = STOP_LOADING;
}

export type UIActions = StartLoading | StopLoading;