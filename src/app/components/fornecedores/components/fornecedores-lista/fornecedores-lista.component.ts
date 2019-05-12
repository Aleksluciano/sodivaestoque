import { Fornecedor } from './../../../../models/fornecedor.model';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import {
  trigger,
  sequence,
  animate,
  transition,
  style
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material';

const rowsAnimation = trigger('rowsAnimation', [
  transition('void => *', [
    style({
      height: '*',
      opacity: '0',
      transform: 'translateX(-550px)',
      'box-shadow': 'none'
    }),
    sequence([
      animate(
        '.35s ease',
        style({
          height: '*',
          opacity: '.2',
          transform: 'translateX(0)',
          'box-shadow': 'none'
        })
      ),
      animate(
        '.35s ease',
        style({ height: '*', opacity: 1, transform: 'translateX(0)' })
      )
    ])
  ])
]);

const fadeAnimation = trigger('fade', [
  transition('void => *', [style({ opacity: 0 }), animate(500)])
]);
@Component({
  selector: 'app-fornecedores-lista',
  templateUrl: './fornecedores-lista.component.html',
  styleUrls: ['./fornecedores-lista.component.scss'],
  animations: [rowsAnimation, fadeAnimation]
})
export class FornecedoresListaComponent implements OnInit {
  @Input()
  displayedColumns: string[] = [];

  @Input()
  fornecedores: MatTableDataSource<Fornecedor>;

  @Output()
  delete: EventEmitter<Fornecedor> = new EventEmitter<Fornecedor>();

  @Output()
  edit: EventEmitter<Fornecedor> = new EventEmitter<Fornecedor>();

  @Output()
  filter: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  newItem: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.which == 13 || event.keyCode == 13) {
      event.preventDefault();
      this.callNewItemForm();
    }
  }

  constructor() {}

  ngOnInit() {}

  deleteRow(fornecedor: Fornecedor) {
    this.delete.emit(fornecedor);
  }

  editRow(fornecedor: Fornecedor) {
    this.edit.emit(fornecedor);
  }

  onKeyup(filter: string) {
    this.filter.emit(filter);
  }

  callNewItemForm() {
    this.newItem.emit();
  }
}
