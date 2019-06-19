import { Venda } from './../../models/venda.model';
import { VendaService } from 'src/app/services/venda.service';
import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { rowsAnimation, fadeAnimation } from '../shared/animations/animations';


type ResumoType = {
  id: string,
  name: string,
  valor: number,
  valorpag: number,
  grupo: Venda[]
}[];


@Component({
  selector: 'app-balanco',
  templateUrl: './balanco.component.html',
  styleUrls: ['./balanco.component.scss'],
  animations: [rowsAnimation, fadeAnimation]
})
export class BalancoComponent implements OnInit {
  anos = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  data = new Date();
  numero_mes = this.data.getMonth();
  ano = this.data.getFullYear().toString();
  months = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ'
  ];
  mes_atual = this.months[this.numero_mes];
  faturas: Venda[] = [];
  faturasatuais: Venda[] = [];
  faturasBackup: Venda[] = [];

  resumo: ResumoType = [];
  avista = 0;
  aprazo = 0;

  constructor(private vendasService: VendaService) {}

  ngOnInit() {
    this.listeningFatura();
  }

  listeningFatura() {
    // const mes = this.months.indexOf(this.mes_atual);
    // const primeiro = new Date(parseInt(this.ano), mes, 1);
    // const ultimo = new Date(parseInt(this.ano), mes + 6, 0);
    this.vendasService
      .getVendaByPeriodo(parseInt(this.ano))
      .subscribe(faturas => {
        this.faturas = [];
        this.faturas = faturas;
        this.faturas.sort(
          (a, b) =>
            a.dataPrimeiroPag['seconds'] * 1000 -
            b.dataPrimeiroPag['seconds'] * 1000
        );
        this.faturas.sort((a, b) => {
          if (a.clienteId < b.clienteId) { return -1; }
          if (a.clienteId > b.clienteId) { return 1; }
          return 0;
        });
        // this.faturasBackup  = JSON.parse(JSON.stringify(this.faturas));
        // this.faturasBackup = this.faturas.map(a=>({...a}));

        // this.calcTotal(mes);
        this.getPeriodo();
      });
  }

  diaSemana(dia) {
    const semana = [
      'domingo',
      'segunda-feira',
      'terça-feira',
      'quarta-feira',
      'quinta-feira',
      'sexta-feira',
      'sábado'
    ];

    const numero = new Date(dia['seconds'] * 1000).getDay();
    console.log(semana[numero]);
    return semana[numero];
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
    this.resumo = [];
    this.faturas.forEach(fatura => {
      const mes = new Date(fatura.dataPrimeiroPag['seconds'] * 1000).getMonth();
      const ano = new Date(
        fatura.dataPrimeiroPag['seconds'] * 1000
      ).getFullYear();
      if (
        fatura.tipoPagamento == '1' &&
        mes == mesatual &&
        ano == parseInt(this.ano)
      ) {
        this.faturasatuais.push(fatura);
        this.avista += fatura.valor;

        const find = this.resumo.find(x => x.id == fatura.clienteId);
        if (find) {

          if (fatura.controlada && !fatura.status) {
          find.valor += fatura.valor;
          }

          if (fatura.controlada && fatura.status) {
          find.valorpag += fatura.valor;
          }

          find.grupo.push(fatura);
        } else {

          let val = 0;
          let valpago = 0;
          if (fatura.controlada && !fatura.status) {val = fatura.valor; }
          if (fatura.controlada && fatura.status) {valpago = fatura.valor; }

          const obj = {
            id: fatura.clienteId,
            name: fatura.clienteNome,
            valor: val,
            valorpag: valpago,
            grupo: []
          };
          obj.grupo.push(fatura);
          this.resumo.push(obj);

        }


      }

      if (fatura.tipoPagamento == '2') {
        fatura.divisaoPagamento.forEach(pag => {
          const mes = new Date(pag.data['seconds'] * 1000).getMonth();
          const ano = new Date(pag.data['seconds'] * 1000).getFullYear();
          if (mes == mesatual && ano == parseInt(this.ano)) {
            this.faturasatuais.push(fatura);
            this.aprazo += pag.preco;

            const find = this.resumo.find(x => x.id == fatura.clienteId);
        if (find) {

          if (fatura.controlada && !pag.status) {
          find.valor += pag.preco;
          }

          if (fatura.controlada && pag.status) {
          find.valorpag += pag.preco;
          }

          find.grupo.push(fatura);
        } else {

          let val = 0;
          let valpago = 0;
          if (fatura.controlada && !pag.status) {val = pag.preco; }
          if (fatura.controlada && pag.status) {valpago = pag.preco; }
          const obj = {
            id: fatura.clienteId,
            name: fatura.clienteNome,
            valor: val,
            valorpag: valpago,
            grupo: []
          };
          obj.grupo.push(fatura);
          this.resumo.push(obj);

        }

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
    if (val) {
      return true;
    }
    let total = 0;
    fat.divisaoPagamento.forEach(sum => (total += sum.preco));
    if (
      total.toFixed(2) < fat.valor.toFixed(2) ||
      total.toFixed(2) > fat.valor.toFixed(2)
    ) {
      return true;
    }

    return false;
  }

  comparaData(dataFatura1, data, index) {
    if (index == 0) {
      const data1 = new Date(dataFatura1['seconds'] * 1000);
      const data2 = new Date(data['seconds'] * 1000);
      // let data1a = new Date(data1.getFullYear(),data1.getMonth(),data1.getDate(),0,0,0,0);
      // let data2a = new Date(data2.getFullYear(),data2.getMonth(),data2.getDate(),0,0,0,0);
      console.log(data1.getTime(), data2.getTime());
      if (data1.getTime() == data2.getTime()) { return 'IGUAIS'; }
    }
    return 'DIFERENTE';
  }

  ledControl(fat: Venda) {
    const hoje = new Date();
    const dataFatura1 = new Date(fat.dataPrimeiroPag['seconds'] * 1000);
    const data = new Date(fat.data['seconds'] * 1000);

    if (fat.tipoPagamento == '1') {
      if (data.getTime() == dataFatura1.getTime()) {
        return 'green';
      }
      if (!fat.controlada) {
        return 'green';
      }
      if (fat.status) {
        return 'green';
      }
      if (!fat.status && dataFatura1.getTime() < hoje.getTime()) {
        return 'red';
      }
      if (!fat.status && dataFatura1.getTime() >= hoje.getTime()) {
        return 'yellow';
      }
    }

    if (fat.tipoPagamento == '2') {
      if (!fat.controlada) {
        return 'green';
      }

      for (let i = 0; i < fat.divisaoPagamento.length; i++) {
        if (this.mescorrente(fat.divisaoPagamento[i])) {
          const dataFatura = new Date(
            fat.divisaoPagamento[i].data['seconds'] * 1000
          );
          if (data.getTime() == dataFatura.getTime() && i == 0) {
            return 'green';
          }
          if (fat.divisaoPagamento[i].status) {
            return 'green';
          }
          if (
            !fat.divisaoPagamento[i].status &&
            dataFatura.getTime() < hoje.getTime()
          ) {
            return 'red';
          }
          if (
            !fat.divisaoPagamento[i].status &&
            dataFatura.getTime() >= hoje.getTime()
          ) {
            return 'yellow';
          }
        }
      }
      // if (fat.controlada && !fat.status && dataFatura.getTime() < hoje.getTime()) {
      //   return 'red';
      // }
      // if (fat.controlada && !fat.status && dataFatura.getTime() >= hoje.getTime()) {
      //   return 'yellow';
      // }
    }
  }

  pagaFatura(fat: Venda) {
    fat.status = true;
    this.vendasService.updateFatura(fat);
  }

  resetaFatura(fat: Venda) {
    this.vendasService
      .getVenda(fat.id)
      .pipe(take(1))
      .subscribe(a => {
        fat.forma = a.forma;
      });
      const data1 = new Date(fat.data['seconds'] * 1000);
      const data2 = new Date(fat.dataPrimeiroPag['seconds'] * 1000);
    fat.status = false;
    if (data1.getTime() == data2.getTime()) {
      fat.status = true;
    }
    this.vendasService.updateFatura(fat);
  }

  pagaFaturaParcial(fat: Venda, pag) {
    pag.status = true;
    this.vendasService
      .updateFaturaParcial(fat)
      .then(a => console.log(a, 'update'))
      .catch(e => console.log(e));
  }

  resetaFaturaParcial(fat: Venda, pag) {
    // let find = this.faturasBackup.find(a=>a.id == fat.id);
    // if(find){

    //   fat.divisaoPagamento = [...find.divisaoPagamento];

    // }
    this.vendasService
      .getVenda(fat.id)
      .pipe(take(1))
      .subscribe(a => {
        a.divisaoPagamento.forEach((b, i) => {
          fat.divisaoPagamento[i].preco = b.preco;
          fat.divisaoPagamento[i].forma = b.forma;
        });
        pag.status = false;
        const data1 = new Date(fat.data['seconds'] * 1000);
        const data2 = new Date(fat.dataPrimeiroPag['seconds'] * 1000);
        if (data1.getTime() == data2.getTime()) {
          fat.divisaoPagamento[0].status = true;
        }
        this.vendasService
          .updateFaturaParcial(fat)
          .then(a => console.log(a, 'update'))
          .catch(e => console.log(e));
      });
  }
}
