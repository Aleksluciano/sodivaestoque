import { Component, OnInit } from '@angular/core';
import { Caixa } from 'src/app/models/caixa.model';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CaixaService } from 'src/app/services/caixa.service';
import { rowsAnimation, fadeAnimation } from '../shared/animations/animations';

@Component({
  selector: 'app-caixa',
  templateUrl: './caixa.component.html',
  styleUrls: ['./caixa.component.scss'],
  animations: [rowsAnimation, fadeAnimation]
})
export class CaixaComponent implements OnInit {
  anos = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  data = new Date();
  numero_mes = this.data.getMonth();
  ano = this.data.getFullYear().toString();
  months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  mes_atual = this.months[this.numero_mes];
  totalCaixa = 0;

  caixas: Caixa[] = [];
  caixasAtual: Caixa[] = [];

  caixa: Caixa = {
    observacao: '',
    valor: 0,
    data: new Date(),
    positivo: true,
    mes: 0,
    ano: 0,
  }

  popupOpen = false;

  constructor(
    private dialog: MatDialog,
    private caixasService: CaixaService) { }

  ngOnInit() {


    this.listeningFatura();
  }

  listeningFatura(){

    this.caixasService.getCaixaByPeriodo(parseInt(this.ano))
    .subscribe(caixas => {

    this.caixas = [];
    this.caixas = caixas;
    this.getPeriodo();
    });
  }

  getPeriodo() {
    const mes = this.months.indexOf(this.mes_atual);
    // const primeiro = new Date(parseInt(this.ano), mes, 1);
    // const ultimo = new Date(parseInt(this.ano), mes + 6, 0);
    this.calcTotal(mes);

  }

  getPeriodoAno() {
    this.listeningFatura();

  }

  calcTotal(mesatual: number) {
    this.caixasAtual = [];
    this.totalCaixa = 0;
    this.caixas.sort(
      (a, b) =>
        a.data['seconds'] * 1000 -
        b.data['seconds'] * 1000
    );

this.caixas.forEach(a=>{
  if(a.mes <= mesatual){

this.totalCaixa+= a.valor;

  }

  if(a.mes == mesatual){

    this.caixasAtual.push(a);

      }
})



  }



  addCaixa(){
    this.caixa.mes = this.caixa.data.getMonth();
    this.caixa.ano = this.caixa.data.getFullYear();
    this.caixasService.newCaixa(this.caixa);
  }

  backTimeStamp(val){

    return val.toDate();

  }

deleteCaixa(item: Caixa){
  this.popupOpen = true;
    const   dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      message: `Deseja realmente remover operação`,
      item: ` com valor de ${item.valor}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        this.popupOpen = false;
        if (result) {
          this.caixasService.deleteCaixa(item.id);
          this.caixa = {
            observacao: '',
            valor: 0,
            data: new Date(),
            positivo: true,
            mes: 0,
            ano: 0,
          }
        }
      });

}

}
