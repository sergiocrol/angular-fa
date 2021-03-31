import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  @Input() exercises: Exercise[];
  @Output() trainingStart = new EventEmitter<void>();

  onStartTraining(selectedExercise) {
    const exerciseId = selectedExercise._value;
    this.trainingService.startExercise(exerciseId);
  }

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {}
}
