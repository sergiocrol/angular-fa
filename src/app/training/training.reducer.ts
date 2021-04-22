import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Exercise } from './exercise.model';
import { TrainingActions, SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, START_TRAINING, STOP_TRAINING } from './training.actions';
import * as fromRoot from '../app.reducer';

// This module will be loaded lazily, therefore, we cannot load it in the app.reducer.ts, since it will require to
// load training reducer and actions ahead of time, and we won't have that info at that point. So, what we have to do is to
// load the state lazily too. For that, we will declare our TrainingState, but also the state that extends fromRoot.State
// ***IMPORTANT*** Also, it will be added to the training.module, not to the app.module
export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

// Why? Because fromRoot.State do not know about our training State (lazy load), but our TrainingState will know about our root state
// so when we load this module lazily, it will merge behind the scenes.
export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercises: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: action.payload
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null
      };
    default:
      return state;
  }
}


export const getTrainingState = createFeatureSelector<TrainingState>('training'); // this identifier have to match with the id set in the training module

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const activeTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null);