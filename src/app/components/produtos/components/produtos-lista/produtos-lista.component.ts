import { Produto } from './../../../../models/produto.model';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import {
  trigger,
  sequence,
  animate,
  transition,
  style
} from '@angular/animations';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

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
  selector: 'app-produtos-lista',
  templateUrl: './produtos-lista.component.html',
  styleUrls: ['./produtos-lista.component.scss'],
  animations: [rowsAnimation, fadeAnimation]
})
export class ProdutosListaComponent implements OnInit {
  produtos: MatTableDataSource<Produto>;
  sort: MatSort;
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) set matSort(ms: MatSort) {
    this.sort = ms;

     }

    @ViewChild(MatPaginator, {static: true}) set matPaginator(mp: MatPaginator) {
     this.paginator = mp;
    }
  // @ViewChild(MatPaginator) paginator: MatPaginator; // necessário para fazer o paginator
  // @ViewChild(MatSort) sort: MatSort;


  @Input()
  footerQuantidade: Number;

  @Input()
  footerCustoTotal: Number;

  @Input()
  footerLucroTotal: Number;

  @Input()
  footerLucroPorcentagem: Number;

  @Input()
  footerValorPago: Number;

  @Input()
  footerPrecoVenda: Number;

  @Input()
  displayedColumns: string[] = [];

  // necessario delay para poder funcionar paginator e sort
  @Input('produtos') set in(prod: MatTableDataSource<Produto>) {
   this.produtos = prod;

   if (this.produtos) {
   this.produtos.paginator = this.paginator;
   this.produtos.sort = this.sort;
   this.produtos.sort.active = 'ini';
   }

  }

  @Output()
  delete: EventEmitter<Produto> = new EventEmitter<Produto>();

  @Output()
  edit: EventEmitter<Produto> = new EventEmitter<Produto>();

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

  ngOnInit() {

 
    // traduz o paginator
    // setTimeout(a => {
    //   this.produtos.sort = this.sort;
    //   this.produtos.sort.active = 'ini';
    //   this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    //   // atribui o paginatr para os dados
    //   this.produtos.paginator = this.paginator;
    // }, 2000);


  }



  deleteRow(produto: Produto) {
    this.delete.emit(produto);
  }

  editRow(produto: Produto) {
    this.edit.emit(produto);
  }

  onKeyup(filter: string) {
    this.filter.emit(filter);
  }

  callNewItemForm() {
    this.newItem.emit();
  }


  calcEstoque(produto) {

    let estoque = 0;
    let resultado = produto.quantidade;

    if (
      produto &&
      produto.estoque &&
      produto.estoque.length > 0
    ) {
      produto.estoque.forEach(obj => {
        estoque += obj.quant;
      });

    }

    resultado = produto.quantidade - estoque;
    if (resultado == 0) {return 'SEM ESTOQUE'; }

    return resultado;
  }






}
