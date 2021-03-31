import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stop-training',
  template: `<h1 mat-dialog-title>Are you sure</h1>
    <mat-dialog-content>
      <p>you already got {{ passedData.progress }}%</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Yes</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </mat-dialog-actions> `,
})
export class StopTrainingComponent {
  // We use @Inject to add some info to our dialog component (since has been created progrtamatically)
  // But here we are injecting directly an object managed by angular material
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}
