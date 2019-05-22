import { Cartao } from './../../models/cartao.model';
import { Component, OnInit } from '@angular/core';
import { CartaoService } from '../../services/cartao.service';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-cartoes',
  templateUrl: './cartoes.component.html',
  styleUrls: ['./cartoes.component.scss']
})
export class CartoesComponent implements OnInit {
cartao: Cartao = {
  valorCredito: 0,
  valorDebito: 0,
  data: new Date(),
  mes: new Date().getMonth(),
  ano: new Date().getFullYear()
}

cartoes: Cartao[] = [];
popupOpen = false;

  constructor(
    private dialog: MatDialog,
    private cartoesService: CartaoService) { }

  ngOnInit() {

    this.cartoesService.getCartoes()
    .subscribe(cartoes => {
console.log(cartoes)
    this.cartoes = [];
    this.cartoes = cartoes;
    });
  }
addCartao(){

  this.cartao.mes = this.cartao.data.getMonth();
  this.cartao.ano = this.cartao.data.getFullYear();

  let cartao = this.cartao;
  this.cartoesService.newCartao(cartao);
}

backTimeStamp(val){

  return val.toDate();

}

deleteCartao(item: Cartao){
  this.popupOpen = true;
    const   dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      message: `Deseja realmente remover o registro com taxas`,
      item: ` de ${item.valorDebito} e ${item.valorCredito}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        this.popupOpen = false;
    if(result) this.cartoesService.deleteCartao(item.id);
    });

}
}
