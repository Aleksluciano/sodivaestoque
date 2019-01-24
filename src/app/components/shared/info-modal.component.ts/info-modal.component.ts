import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-info-modal',
  template: `

  <h1 mat-dialog-title>{{ data?.title }}</h1>
  <div mat-dialog-content>
   <p class="mat-body-1">{{ data?.message }}</p>
  </div>
  <div mat-dialog-actions>
    <button id="buttonNo" mat-button [mat-dialog-close]="true">Ok</button>
  </div>

  `,
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }) {}

  ngOnInit() {
  }

}
