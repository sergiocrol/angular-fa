import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';
import { TrainingService } from '../training.service';

import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  @Input() exercises$: Observable<Exercise[]>;
  @Output() trainingStart = new EventEmitter<void>();
  isLoading$: Observable<boolean>;
  private isLoadingSubs: Subscription;

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.isLoadingSubs = this.uiService.loadingStateChanged.subscribe(
    //   (isLoading) => {
    //     this.isLoading = isLoading;
    //   }
    // );
  }

  // ngOnDestroy(): void {
  //   if (this.isLoadingSubs) {
  //     this.isLoading = false;
  //     this.isLoadingSubs.unsubscribe();
  //   }
  // }
}
