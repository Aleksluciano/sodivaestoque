import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Fornecedor } from 'src/app/models/fornecedor.model';

@Component({
  selector: 'app-fornecedor-form-edit',
  templateUrl: './fornecedor-form-edit.component.html',
  styleUrls: ['./fornecedor-form-edit.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class FornecedorFormEditComponent implements OnInit {
  editButton = true;
  fornecedor: Fornecedor;

  @Input()
  parent: FormGroup;

  @Input()
  arrayFornecedores: string[];

  @Input()
  fornecedores: Fornecedor[];

  @Input()
  firstInput: string;

  @Input()
  myControl = new FormControl();

  @Output()
  cep: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  save: EventEmitter<Fornecedor> = new EventEmitter<Fornecedor>();

  @Output()
  back: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  delete: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  find: EventEmitter<Fornecedor> = new EventEmitter<Fornecedor>();

  @Output()
  next: EventEmitter<Fornecedor> = new EventEmitter<Fornecedor>();

  @Output()
  previous: EventEmitter<Fornecedor> = new EventEmitter<Fornecedor>();

  @Output()
  findOne: EventEmitter<string> = new EventEmitter<string>();

  options: string[] = [
    'AC',
    'AL',
    'AM',
    'AP',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MG',
    'MS',
    'MT',
    'PA',
    'PB',
    'PE',
    'PI',
    'PR',
    'RJ',
    'RN',
    'RO',
    'RR',
    'RS',
    'SC',
    'SE',
    'SP',
    'TO'
  ];
  filteredOptions: Observable<string[]>;
  filteredOptionsFind: Observable<string[]>;

  constructor() {}

  ngOnInit() {
    // if(this.parent.get('fornec').get('nome').value){
    //   this.firstInput = this.parent.get('fornec').get('nome').value
    // }

    this.filteredOptions = this.parent
      .get('fornec')
      .get('estado')
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.filteredOptionsFind = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFind(value))
    );
  }

  findAdress(cepValue: string) {
    this.cep.emit(cepValue);
  }

  return() {
    this.back.emit();
  }

  private _filter(value: string): string[] {
    let filterValue = '';
    if (value) { filterValue = value.toLowerCase(); }

    return this.options.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterFind(value: string): string[] {
    let filterValue = '';
     filterValue = value.toLowerCase();

    return this.arrayFornecedores.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  changeEditButton() {
    this.editButton = !this.editButton;

    if (!this.editButton) { this.parent.get('fornec').enable(); } else { this.parent.get('fornec').disable(); }
  }

  deleteItem() {
    this.delete.emit();
  }

  saveDocument() {
    this.changeEditButton();
  }

  findData(e) {
    this.find.emit(e);
  }

  nextData(e) {
    this.next.emit(e);
  }

  previousData(e) {
    this.previous.emit(e);
  }
}
