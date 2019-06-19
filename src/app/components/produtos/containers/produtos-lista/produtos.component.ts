import { Params } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProdutoService } from 'src/app/services/produto.service';
import { Produto } from 'src/app/models/produto.model';

import {
  MatTableDataSource,
  MatDialogConfig,
  MatDialog,
  MatPaginator
} from '@angular/material';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { Router, NavigationExtras } from '@angular/router';
import { Fornecedor } from 'src/app/models/fornecedor.model';

@Component({
  selector: 'app-produtos',
  template: `
    <br />

    <app-produtos-lista
      [produtos]="dataSource"
      [displayedColumns]="displayedColumns"
      (delete)="onDeleteClick($event)"
      (filter)="applyFilter($event)"
      (newItem)="newItem()"
      (edit)="onEditClick($event)"
      [footerQuantidade]="footerQuantidade"
      [footerValorPago]="footerValorPago"
      [footerPrecoVenda]="footerPrecoVenda"
      [footerCustoTotal]="footerCustoTotal"
      [footerLucroTotal]="footerLucroTotal"
      [footerLucroPorcentagem]="footerLucroPorcentagem"
    >
    </app-produtos-lista>
  `
})
export class ProdutosComponent implements OnInit {


  displayedColumns: string[] = [
    'Indice',
    'codigo',
    'descricao',
    'fornecedor',
    // "Cod.Fornecedor",
    'quantidade',
    'cor',
    'tipo',
    'tamanho',
    'valor',
    'Custo',
    'preco',
    'LucroBruto',
    'PorcentagemLucro',
    'Data',
    'Ações'
  ];
  produtos: Produto[] = [];
  dataSource: MatTableDataSource<Produto>;
  footerQuantidade = 0;
  footerValorPago = 0;
  footerPrecoVenda = 0;
  footerCustoTotal = 0;
  footerLucroTotal = 0;
  footerLucroPorcentagem = 0;
  popupOpen = false;
  navigationex: NavigationExtras;


  // sort: MatSort;

  constructor(
    private produtosService: ProdutoService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {

    // this.dataSource.sort = this.sort;
    // this.dataSource.sort.active = 'ini';
    // traduz o paginator
    // this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    // atribui o paginatr para os dados
    // this.dataSource.paginator = this.paginator;


    this.produtosService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;
      this.dataSource = new MatTableDataSource(this.produtos);
      this.footerQuantidade = 0;
      this.footerValorPago = 0;
      this.footerPrecoVenda = 0;
      this.footerCustoTotal = 0;
      this.footerLucroTotal = 0;
      this.footerLucroPorcentagem = 0;
      
      this.produtos.forEach(a => {

        let estoque = 0;
        if (a.estoque &&
          a.estoque.length > 0
      ) {
          a.estoque.forEach(obj => {
          estoque += obj.quant;
        });

      }

      if(a.tipo != 'QUALQUER'){
        this.footerQuantidade += a.quantidade - estoque;
        this.footerValorPago += a.valor * a.quantidade;
        this.footerPrecoVenda += a.preco * a.quantidade;
        this.footerCustoTotal += a.valor * a.quantidade;
        this.footerLucroTotal += ( a.preco * a.quantidade ) - ( a.valor * a.quantidade );
      }

      });

      this.footerLucroPorcentagem = ((this.footerLucroTotal / this.footerCustoTotal) * 100);
    });
  }

  onDeleteClick(event: Produto) {
    this.popupOpen = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      message: `Deseja realmente remover o produto`,
      item: `${event.codigo}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        this.popupOpen = false;
        if (result) { this.produtosService.deleteProduto(event.id); }
      });
  }

  onEditClick(event: Produto) {
    this.router.navigate([`produtos/edit/${event.id}`]);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  newItem() {

    if (!this.popupOpen) {
  let code = '';
  if (this.produtos.length > 0) {code = this.produtos[this.produtos.length - 1].codigo; }

      this.router.navigate(['produtos/add'], {
        queryParams: {
          lastCode: code
        }
      });
    }
  }
}
