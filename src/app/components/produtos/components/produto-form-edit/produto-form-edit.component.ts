import { Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Produto } from 'src/app/models/produto.model';
import {
  optionsCores,
  optionsTipos
} from 'src/app/components/shared/select-options/options';

@Component({
  selector: 'app-produto-form-edit',
  templateUrl: './produto-form-edit.component.html',
  styleUrls: ['./produto-form-edit.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class ProdutoFormEditComponent implements OnInit {
  editButton = true;
  @Input()
  produto: Produto;

  @Input()
  parent: FormGroup;

  @Input()
  arrayProdutos: string[];

  @Input()
  produtos: Produto[];

  @Input()
  firstInput: string;

  @Input()
  myControl = new FormControl();




  @Input()
  optionsFornecedor: string[];

  @Output()
  save: EventEmitter<Produto> = new EventEmitter<Produto>();

  @Output()
  back: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  delete: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  find: EventEmitter<Produto> = new EventEmitter<Produto>();

  @Output()
  next: EventEmitter<Produto> = new EventEmitter<Produto>();

  @Output()
  previous: EventEmitter<Produto> = new EventEmitter<Produto>();

  @Output()
  findOne: EventEmitter<string> = new EventEmitter<string>();

  options: string[] = [
    'PP',
    'P',
    'M',
    'G',
    'GG',
    'G1',
    'G2',
    'G3',
    '34',
    '36',
    '38',
    '40',
    '42',
    '44',
    'U'
  ];

  custoString = '0.00';

  optionsCor = optionsCores;
  optionsTipo = optionsTipos;

  filteredOptionsFind: Observable<string[]>;
  filteredOptions: Observable<string[]>;
  filteredOptionsTipo: Observable<string[]>;
  filteredOptionsFornecedor: Observable<string[]>;
  filteredOptionsCor: Observable<string[]>;

  constructor() {}


  ngOnInit() {



    this.filteredOptions = this.parent
      .get('fornec')
      .get('tamanho')
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.filteredOptionsTipo = this.parent
      .get('fornec')
      .get('tipo')
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filterTipo(value))
      );


  setTimeout(a => {

    this.filteredOptionsFornecedor = this.parent
    .get('fornec')
    .get('fornecedor').valueChanges.pipe(
      startWith(''),
      map(value => this._filterFornecedor(value))
    );
  }, 1000);


    this.filteredOptionsCor = this.parent
      .get('fornec')
      .get('cor')
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filterCor(value))
      );

    this.filteredOptionsFind = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFind(value))
    );
  }

  return() {
    this.back.emit();
  }

  convertCalc(valor: string, quantidade: number) {
    const convertValor = valor.substring(3).replace(/[,.]/g, function(m) {
      return m === ',' ? '.' : '';
    });

    const num = (+convertValor * quantidade).toFixed(2);

    return String(num);
  }

  private _filterFind(value: string): string[] {
    let filterValue = '';
    filterValue = value.toLowerCase();
    return this.arrayProdutos.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  calcLucro(valor, quantidade, preco) {
    const convertValor = valor.substring(3).replace(/[,.]/g, function(m) {
      return m === ',' ? '.' : '';
    });

    const convertPreco = preco.substring(3).replace(/[,.]/g, function(m) {
      return m === ',' ? '.' : '';
    });

    const num = (+convertPreco * quantidade - +convertValor * quantidade).toFixed(
      2
    );

    return String(num);
  }

  porcentagemLucro(valor, quantidade, preco) {
    const convertValor = valor.substring(3).replace(/[,.]/g, function(m) {
      return m === ',' ? '.' : '';
    });

    const convertPreco = preco.substring(3).replace(/[,.]/g, function(m) {
      return m === ',' ? '.' : '';
    });

    const num = (
      ((+convertPreco * quantidade - +convertValor * quantidade) /
        (+convertValor * quantidade)) *
      100
    ).toFixed(2);

    const testNum = Number.isNaN(Number(num));
    if (testNum) { return '0'; }

    return String(num);
  }

  private _filter(value: string): string[] {
    let filterValue = '';
    if (value) { filterValue = value.toLowerCase(); }

    return this.options.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterTipo(value: string): string[] {
    let filterValue = '';
    if (value) { filterValue = value.toLowerCase(); }

    return this.optionsTipo.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterFornecedor(value: string): string[] {

    let filterValue = '';
    if (value) {
    filterValue = value.toLowerCase();
    }

    return this.optionsFornecedor.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterCor(value: string): string[] {
    let filterValue = '';
    if (value) { filterValue = value.toLowerCase(); }

    return this.optionsCor.filter(
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

pad(num, size) {

  const numnum = parseInt(num);
  let s = '';
   for (let i = 0; i < 5 - numnum.toString().length; i++) {
    s += '0';
   }

  let retorno = 'SD' + s + numnum.toString();
  if (retorno.length > 7) {retorno = 'SD' + retorno.substr(2 + retorno.length - 7); }
  this.parent.value.fornec.codigo = retorno;
    return retorno;
}

calcEstoque( ) {


  let estoque = 0;
  let resultado = 0;
  if(this.produto){
  resultado = this.produto.quantidade;

  if (
    this.produto &&
    this.produto.estoque &&
    this.produto.estoque.length > 0
  ) {
    this.produto.estoque.forEach(obj => {
      estoque += obj.quant;
    });

  }

  resultado = this.produto.quantidade - estoque;
  if (resultado == 0) {return 'SEM ESTOQUE'; }
  }
  return resultado;
}
}
