import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import 'rxjs/add/operator/map';

import { Exercise } from './exercise.model';
import { TrainingService } from './training.service';
import { State, Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  onGoingTraining$: Observable<boolean>;
  exercises$: Observable<Exercise[]>;
  selectedExercise: Exercise;
  exerciseSubscription: Subscription;
  exerciseStartSubscription: Subscription;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) {}

  ngOnInit(): void {
    // Subscription to know when the exercises are been retrieved from firestore so we can populate our exercises array
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
    //   (exercises) => {
    //     this.exercises = exercises;
    //   }
    // );
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.trainingService.fetchAvailableExercises(); // we call the function to fetch list of available trainings from our firestore

    // Subscription to know when we have selected onStartExercise in newTraining component so we can chnage the view
    // this.exerciseStartSubscription = this.trainingService.exerciseChanged.subscribe(
    //   (exercise) => {
    //     if (exercise) {
    //       this.onGoingTraining = true;
    //     } else {
    //       this.onGoingTraining = false;
    //     }
    //   }
    // );
    this.onGoingTraining$ = this.store.select(fromTraining.getIsTraining);
  }

  // ngOnDestroy(): void {
  //   if (this.exerciseSubscription) {
  //     this.exerciseSubscription.unsubscribe();
  //   }
  // }
}
