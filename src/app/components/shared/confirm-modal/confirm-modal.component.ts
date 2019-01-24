import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-confirm-modal',
  template: `

  <h1 mat-dialog-title>Confirmação de exclusão</h1>
<div mat-dialog-content>
 <p class="mat-body-1">{{ data?.message }} <strong>{{ data?.item }}</strong> ?</p>
</div>
<div mat-dialog-actions>
  <button id="buttonYes" mat-button [mat-dialog-close]="true">Sim</button>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <button id="buttonNo" mat-button [mat-dialog-close]="false">Cancelar</button>
</div>


  `,
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, item: string}) {}

  ngOnInit() {

  }

}
