import { Fornecedor } from './../../../../models/fornecedor.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, sequence, state, animate, transition, style } from '@angular/animations';

const rowsAnimation =
    trigger('rowsAnimation', [
      transition('void => *', [
        style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
        sequence([
          animate(".35s ease", style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none'  })),
          animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
        ])
      ])
    ]);


@Component({
  selector: 'app-fornecedores-lista',
  templateUrl: './fornecedores-lista.component.html',
  styleUrls: ['./fornecedores-lista.component.css'],
  animations: [rowsAnimation]
})
export class FornecedoresListaComponent implements OnInit {

@Input()
displayedColumns: string[] = []

@Input()
fornecedores: Fornecedor[] = [];

@Output()
delete: EventEmitter<Fornecedor> = new EventEmitter<Fornecedor>()
keyup: EventEmitter<string> = new EventEmitter<string>()



  constructor() { }

  ngOnInit() {

  }

  deleteRow(fornecedor: Fornecedor){
    this.delete.emit(fornecedor)
  }

onKeyup(filter: string){
  this.keyup.emit(filter)
}

}
