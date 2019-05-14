import { Venda } from './../../models/venda.model';
import { VendaService } from 'src/app/services/venda.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-faturamento',
  templateUrl: './faturamento.component.html',
  styleUrls: ['./faturamento.component.scss']
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
  avista = 0;
  aprazo = 0;

  constructor(private vendasService: VendaService) { }

  ngOnInit() {
this.getPeriodo();
  }

  getPeriodo(){
    let mes = this.months.indexOf(this.mes_atual)
    let primeiro = new Date(parseInt(this.ano), mes, 1);
    let ultimo = new Date(parseInt(this.ano), mes +6, 0);

    this.vendasService.getVendaByPeriodo(primeiro, ultimo).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Venda;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    )
    .subscribe(faturas => {
    this.faturas = faturas;
    this.calcTotal(mes);
    });
  }

  calcTotal(mesatual: number){
    this.avista = 0;
    this.aprazo = 0;
    this.faturasatuais = [];
    this.faturas.forEach((fatura)=>{

    let mes = new Date(fatura.dataPrimeiroPag['seconds'] * 1000).getMonth();
    if(fatura.tipoPagamento == '1' && mes == mesatual){
    this.faturasatuais.push(fatura);
    this.avista += fatura.valor;
    }

    if(fatura.tipoPagamento == '2'){
      fatura.divisaoPagamento.forEach(pag=>{
        let mes = new Date(pag.data['seconds'] * 1000).getMonth();
        if(mes == mesatual){
          this.faturasatuais.push(fatura);
          this.aprazo += pag.preco;
        }
      })
    }


    })
  }

  mescorrente(pag){
    let mesatual = this.months.indexOf(this.mes_atual);
    let mes = new Date(pag.data['seconds'] * 1000).getMonth();
    if(mes == mesatual){
      return true;
  }

  return false;
}

backTimeStamp(val){

  return val.toDate();

}

redistribuiValores(i){
  
}
}
