import { Venda } from './../../models/venda.model';
import { VendaService } from 'src/app/services/venda.service';
import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { rowsAnimation, fadeAnimation } from '../shared/animations/animations';

@Component({
  selector: 'app-faturamento',
  templateUrl: './faturamento.component.html',
  styleUrls: ['./faturamento.component.scss'],
  animations: [rowsAnimation, fadeAnimation]
})
export class FaturamentoComponent implements OnInit {

  anos = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  data = new Date();
  numero_mes = this.data.getMonth();
  ano = this.data.getFullYear().toString();
  months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  mes_atual = this.months[this.numero_mes];
  faturas: Venda[] = [];
  faturasatuais: Venda[] = [];
  faturasBackup: Venda[] = [];
  avista = 0;
  aprazo = 0;

  constructor(private vendasService: VendaService) { }

  ngOnInit() {

    this.listeningFatura();


  }

  listeningFatura(){
    // const mes = this.months.indexOf(this.mes_atual);
    // const primeiro = new Date(parseInt(this.ano), mes, 1);
    // const ultimo = new Date(parseInt(this.ano), mes + 6, 0);
    this.vendasService.getVendaByPeriodo(parseInt(this.ano))
    .subscribe(faturas => {
    this.faturas = [];
    this.faturas = faturas;
    //this.faturasBackup  = JSON.parse(JSON.stringify(this.faturas));
    //this.faturasBackup = this.faturas.map(a=>({...a}));
    console.log('front')
    //console.log(this.faturas,'cheguei');
    //this.calcTotal(mes);
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
    this.avista = 0;
    this.aprazo = 0;
    this.faturasatuais = [];
    this.faturas.forEach((fatura) => {

    const mes = new Date(fatura.dataPrimeiroPag['seconds'] * 1000).getMonth();
    if (fatura.tipoPagamento == '1' && mes == mesatual) {
    this.faturasatuais.push(fatura);
    this.avista += fatura.valor;
    }

    if (fatura.tipoPagamento == '2') {
      fatura.divisaoPagamento.forEach(pag => {
        const mes = new Date(pag.data['seconds'] * 1000).getMonth();
        if (mes == mesatual) {
          this.faturasatuais.push(fatura);
          this.aprazo += pag.preco;
        }
      });
    }


    });
  }

  mescorrente(pag) {
    const mesatual = this.months.indexOf(this.mes_atual);
    const mes = new Date(pag.data['seconds'] * 1000).getMonth();
    if (mes == mesatual) {
      return true;
  }

  return false;
}

backTimeStamp(val) {

  return val.toDate();

}

redistribuiValores(fat, index, btpago) {
  let valorrestante = 0;
  let sum = 0;
  for (let i = 0; i < fat.divisaoPagamento.length; i++) {
    if (i > index) {
      break;
    }
    sum += fat.divisaoPagamento[i].preco;
  }

  valorrestante = fat.valor - sum;

  for (let i = index + 1; i < fat.divisaoPagamento.length; i++) {
    fat.divisaoPagamento[i].preco =
      valorrestante / (fat.divisaoPagamento.length - index - 1);
  }

 // if(fat.divisaoPagamento[index].preco < 0)btpago.disabled = true;

}

confereValorPositvo(fat: Venda, index) {

  const val = fat.divisaoPagamento.some(a => a.preco < 0);
  if (val) {return true; }
  let total = 0;
  fat.divisaoPagamento.forEach(sum => total += sum.preco);
  if ((total.toFixed(2) < fat.valor.toFixed(2)) || (total.toFixed(2) > fat.valor.toFixed(2))) {return true; }

  return false;
}

ledControl(fat: Venda) {
  const hoje = new Date();
  let dataFaura = new Date(fat.dataPrimeiroPag['seconds'] * 1000);

  if (fat.tipoPagamento == '1') {
  if (!fat.controlada) {return 'green'; }
  if (fat.status) {return 'green'; }
  if (!fat.status && dataFaura.getTime() < hoje.getTime()) {
    return 'red';
  }
  if (!fat.status && dataFaura.getTime() >= hoje.getTime()) {
    return 'yellow';
  }
}

if (fat.tipoPagamento == '2') {
  if (!fat.controlada) {return 'green'; }
 for (let i = 0; i < fat.divisaoPagamento.length; i++) {

  if (this.mescorrente(fat.divisaoPagamento[i])) {
    dataFaura = new Date(fat.divisaoPagamento[i].data['seconds'] * 1000);
    if (fat.divisaoPagamento[i].status) {return 'green'; }
    if (!fat.divisaoPagamento[i].status && dataFaura.getTime() < hoje.getTime()) {
      return 'red';
    }
    if (!fat.divisaoPagamento[i].status && dataFaura.getTime() >= hoje.getTime()) {
      return 'yellow';
    }


  }

 }
  if (fat.controlada && !fat.status && dataFaura.getTime() < hoje.getTime()) {
    return 'red';
  }
  if (fat.controlada && !fat.status && dataFaura.getTime() >= hoje.getTime()) {
    return 'yellow';
  }
}


}

pagaFatura(fat: Venda) {
fat.status = true;
this.vendasService.updateFatura(fat);
}

resetaFatura(fat: Venda) {
  fat.status = false;
  this.vendasService.updateFatura(fat);
}

pagaFaturaParcial(fat: Venda, pag) {
  pag.status = true;
  this.vendasService.updateFaturaParcial(fat).then(a => console.log(a, 'update')).catch(e => console.log(e));
  }

  resetaFaturaParcial(fat: Venda, pag) {

  // let find = this.faturasBackup.find(a=>a.id == fat.id);
  // if(find){
  //   console.log(fat.divisaoPagamento)
  //   console.log(find.divisaoPagamento)
  //   fat.divisaoPagamento = [...find.divisaoPagamento];

  // }
  this.vendasService.getVenda(fat.id).pipe(
    take(1)).
    subscribe(a=>{
    a.divisaoPagamento.forEach((b,i)=>{
      fat.divisaoPagamento[i].preco = b.preco;

    })
    pag.status = false;
    this.vendasService.updateFaturaParcial(fat).then(a => console.log(a, 'update')).catch(e => console.log(e));
  })

  }
}
