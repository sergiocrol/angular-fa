import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';

import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

import * as UI from '../shared/ui.actions';
// import * as fromRoot from '../app.reducer'; <- We do not use fromRoot anymore, this module is loaded lazily, therefore we've to use fromTraining
import * as fromTraining from '../training/training.reducer'; // We still can emit events to the global state, because fromTraining extends fromRoot
// but only fromTraining has the training state
import * as Training from '../training/training.actions';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private finishedExercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.State>) {}

  // We fetch the exercises from firestore
  // valueChanges gives us an observable to wich one we can subscribe
  // the difference between .get() and .valueChanges() is that valueChanges is listening for any change in our database
  // and change it in the front in realtime, while get only get the change one time
  // **IMPORTANT** valueChanges only gives us the values of the document (it skip the id, for instance). As an alternative, we can use .snapshotChanges
  // this.exercises = this.db.collection('availableExercises').valueChanges();

  // snapshotChanges returns and observable. We can use map operator in order to get the info we want (since it returns an object where the values are nested)
  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    // this.uiService.loadingStateChanged.next(true);
    // So here we have a live subscription that cannot be removed onDestroy fuunction. For taht we can declare an array of subscriptions and push every
    // sub we're using here (two in this case); then we create a function to cancel the subs, and we cal this whenever we logout (from auth.service)
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .map((docArray) => {
          // throw new Error();
          // this map is now a normal js array, not an operator, since docArray is an array of documents
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data()['name'],
              duration: doc.payload.doc.data()['duration'],
              calories: doc.payload.doc.data()['calories'],
            };
          });
        })
        .subscribe(
          (exercises: Exercise[]) => {
            this.availableExercises = exercises;
            this.store.dispatch(new UI.StopLoading());
            // this.uiService.loadingStateChanged.next(false);
            /*this.exercisesChanged.next([...this.availableExercises]);*/ // we emit an event when the exercises are loaded, so we can be aware in training.component
            // and populate the exercises array (select component of new training page)
            this.store.dispatch(new Training.SetAvailableTrainings([...this.availableExercises]))
          },
          (error) => {
            this.store.dispatch(new UI.StopLoading());
            // this.uiService.loadingStateChanged.next(false);
            /*this.exercisesChanged.next(null);*/ // Instead of emit an event with the result of exercises, we can emmit
            // null, which means we need to show a button to allow user to refetch the exercises
            this.store.dispatch(new Training.SetAvailableTrainings(null))
            this.uiService.showSnackbar(
              'Fetching exercises failed, please, try again later',
              null,
              3000
            );
          }
        )
    );
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  startExercise(selectedId: string) {
    // To work with a single document, we can do something like this
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()})
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    // this.exerciseChanged.next({ ...this.runningExercise });
    this.store.dispatch(new Training.StartTraining({ ...this.runningExercise }));
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    // this.exerciseChanged.next(null);
    this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    // this.exerciseChanged.next(null);
    this.store.dispatch(new Training.StopTraining());
  }

  // We would use .snapshotChanges() whenever we want to get the metadata of a doc (e.g. DocumentID) and .valueChanges()
  // when we need the data within the doc. We can't get document data from .snapshotChanges().
  // The newest version of AngularFire allows you to use valueChanges() in a way that it also maps the ID of the document
  // to the document data that is being returned in addition to the document data itself.
  // Example: const tasks: Observable<Task[]> = this.firestore.collection<Task>('tasks').valueChanges({ idField: 'id' });
  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercises = exercises;
          // this.finishedExercisesChanged.next([...this.finishedExercises]);
          this.store.dispatch(new Training.SetFinishedTrainings([...this.finishedExercises]));
        })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions(): void {
    this.fbSubs.forEach((sub: Subscription) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
