import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { trainingReducer } from './training.reducer';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingsComponent,
    StopTrainingComponent,
  ],
  imports: [
    SharedModule, 
    TrainingRoutingModule, 
    StoreModule.forFeature('training', trainingReducer) // this goes here, and not in app.module because this module is loaded lazily
    // this gives us the opportunity to get the slice of the state that we get in the app reducer for the other reducers
  ],
  exports: [],
  entryComponents: [StopTrainingComponent],
})
export class TrainingModule {}

