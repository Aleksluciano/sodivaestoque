import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-create-agenda',
  templateUrl: './create-agenda.component.html',
  styleUrls: ['./create-agenda.component.scss']
})
export class CreateAgendaComponent implements OnInit {
items = ['Carla', 'Bia', 'Paty'];
time = {hour: 13, minute: 30};
selectedValue = '';
modeldate;
date: {year: number, month: number};

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, item: string} ,
  public dialogRef: MatDialogRef<CreateAgendaComponent>,
  ) {}

  ngOnInit() {
    this.selectedValue = this.items[0];
   this.dialogRef.updateSize('300px', '800px');

  }



}
