import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
  @Input() selectedExercise: Exercise;
  progress: number = 0;
  stopped: boolean = false;
  timer: number;

  start() {
    const step = (this.selectedExercise.duration / 100) * 1000;
    if (this.progress === 100) return;
    this.stopped = false;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);
  }

  stop() {
    if (this.progress === 100) return;
    this.stopped = true;
    clearInterval(this.timer);
  }

  onPause() {
    this.stopped ? this.start() : this.stop();
  }

  onQuit() {
    if (!this.stopped) this.onPause();
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      result
        ? this.trainingService.cancelExercise(this.progress)
        : this.start();
    });
  }

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    this.selectedExercise = this.trainingService.getRunningExercise();
    this.start();
  }
}
