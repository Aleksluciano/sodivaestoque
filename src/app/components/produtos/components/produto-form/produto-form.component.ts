import { Validators } from '@angular/forms';
import {
  optionsTipos,
  optionsCores
} from './../../../shared/select-options/options';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, debounce } from 'rxjs/operators';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate(500)])
    ])
  ]
})
export class ProdutoFormComponent implements OnInit {
  @Input()
  parent: FormGroup;

  @Input()
  optionsFornecedor: string[];



  @Input()
  myControl = new FormControl();

  @Output()
  back: EventEmitter<void> = new EventEmitter<void>();

  custoString = '0.00';

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

  optionsCor = optionsCores;
  optionsTipo = optionsTipos;

  filteredOptions: Observable<string[]>;
  filteredOptionsTipo: Observable<string[]>;
  filteredOptionsFornecedor: Observable<string[]>;
  filteredOptionsCor: Observable<string[]>;

  @ViewChild('codigoInput') codigoInput;

  constructor() {}

  ngOnInit() {
    this.codigoInput.nativeElement.focus();

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

  setFornecName(event) {


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





}
