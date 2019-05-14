import { Venda } from './../../../models/venda.model';
import { MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { Component, OnInit, HostListener } from '@angular/core';
import { VendaService } from 'src/app/services/venda.service';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { rowsAnimation, fadeAnimation } from '../../shared/animations/animations';
import { DatePipe } from '@angular/common';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-vendas-lista',
  templateUrl: './vendas-lista.component.html',
  styleUrls: ['./vendas-lista.component.scss'],
  animations: [rowsAnimation, fadeAnimation]
})
export class VendasListaComponent implements OnInit {
vendas = [];
venda: Venda;
dataSource: MatTableDataSource<Venda>;
valorTotal = 0;
quantidadeTotalLista = 0;

popupOpen = false;

displayedColumns: string[] = [
  'Indice',
  'Recibo',
  'Cliente',
  'Data',
  'Hora',
  'Quant.',
  'Valor',
  'TipoPag.',
  'Ações'
];

@HostListener('document:keypress', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  if (event.which == 13 || event.keyCode == 13) {
    event.preventDefault();
    this.callNewItemForm();
  }
}

  constructor(private vendasService: VendaService,
    private produtosService: ProdutoService,
    private dialog: MatDialog,
    private router: Router,
    public datePipe: DatePipe ) { }

  ngOnInit() {

    this.vendasService.getVendas().subscribe(vendas => {
      this.vendas = vendas;
      this.valorTotal = 0;
      this.valorTotal = this.vendas.reduce((acumulado, atual) => {
       return acumulado + atual.valor;
      }, 0);
      this.quantidadeTotalLista = this.vendas.reduce((acumulado, atual) => {
        return acumulado + atual.quantidadeTotal;
       }, 0);
      this.dataSource = new MatTableDataSource(this.vendas);
      console.log(this.vendas);

    });

  }

  deleteRow(venda: Venda) {
    this.popupOpen = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      message: `Deseja realmente remover a venda`,
      item: `${venda.recibo}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        this.popupOpen = false;
        if (result) { this.vendasService.deleteVenda(venda.id).then(result =>{
          this.vendasService.flashMessageToDelete(venda.recibo);
          this.produtosService.deleteItemEstoque(venda);
        }) }
      });
  }

  editRow(venda: Venda) {
    this.router.navigate([`vendas/edit/${venda.id}`]);
  }

  onKeyup(filter: string) {

  }

  callNewItemForm() {
    if (!this.popupOpen) {
      let code = '';
      if (this.vendas.length > 0) {code = this.vendas[this.vendas.length - 1].recibo; }

          this.router.navigate(['vendas/add'], {
            queryParams: {
              lastCode: code
            }
          });
        }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }





}
