import { Params } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ProdutoService } from "src/app/services/produto.service";
import { Produto } from "src/app/models/produto.model";

import {
  MatTableDataSource,
  MatDialogConfig,
  MatDialog
} from "@angular/material";
import { ConfirmModalComponent } from "src/app/components/shared/confirm-modal/confirm-modal.component";
import { Router, NavigationExtras } from "@angular/router";
import { Fornecedor } from "src/app/models/fornecedor.model";

@Component({
  selector: "app-produtos",
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
    "Indice",
    "Código",
    "Descrição",
    "Fornecedor",
    "Cod.Fornecedor",
    "Data",
    "Cor",
    "Tipo",
    "Tamanho",
    "Quantidade",
    "Valor",
    "Custo",
    "Preço",
    "LucroBruto",
    "PorcentagemLucro",
    "Ações"
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

  constructor(
    private produtosService: ProdutoService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.produtosService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;
      this.dataSource = new MatTableDataSource(this.produtos);
      this.produtos.forEach(a => {
        this.footerQuantidade += a.quantidade;
        this.footerValorPago += a.valor * a.quantidade;
        this.footerPrecoVenda += a.preco * a.quantidade;
        this.footerCustoTotal += a.valor * a.quantidade;
        this.footerLucroTotal += ( a.preco * a.quantidade ) - ( a.valor * a.quantidade );
      });

      this.footerLucroPorcentagem = (this.footerLucroTotal / this.footerCustoTotal) * 100;
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
        if (result) this.produtosService.deleteProduto(event.id);
      });
  }

  onEditClick(event: Produto) {
    this.router.navigate([`produtos/edit/${event.id}`]);
  }

  applyFilter(filterValue: string) {
    if (filterValue) this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newItem() {

    if (!this.popupOpen) {
  let code = '';
  if(this.produtos.length > 0)code = this.produtos[this.produtos.length - 1].codigo

      this.router.navigate(["produtos/add"], {
        queryParams: {
          lastCode: code
        }
      });
    }
  }
}
