import { Venda } from './../../models/venda.model';
import { VendaService } from 'src/app/services/venda.service';
import { Component, OnInit } from '@angular/core';
import { map, take, switchMap } from 'rxjs/operators';
import { rowsAnimation, fadeAnimation } from '../shared/animations/animations';
import { Cartao } from 'src/app/models/cartao.model';
import { CartaoService } from 'src/app/services/cartao.service';

type ResumoType = {
  id: string;
  name: string;
  valor: number;
  valorpag: number;
  grupo: Venda[];
}[];

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

mesNOME = [
    'JANEIRO',
    'FEVEREIRO',
    'MARÇO',
    'ABRIL',
    'MAIO',
    'JUNHO',
    'JULHO',
    'AGOSTO',
    'SETEMBRO',
    'OUTUBRO',
    'NOVEMBRO',
    'DEZEMBRO'
  ];
  mes_atual = this.months[this.numero_mes];
  faturas: Venda[] = [];
  faturas_ini: Venda[] = [];
  faturasatuais: Venda[] = [];
  faturasBackup: Venda[] = [];

  resumo: ResumoType = [];

  avista = 0;
  aprazo = 0;

  cartoes: Cartao[] = [];
  cartao: Cartao;
  taxadebito = 0;
  taxacredito = 0;
  totaldebito = 0;
  totalcredito = 0;
  totaldiferenca = 0;

  constructor(
    private vendasService: VendaService,
    private cartoesService: CartaoService
  ) {}

  ngOnInit() {
    this.listeningFatura();
  }

  listeningFatura() {
    // const mes = this.months.indexOf(this.mes_atual);
    // const primeiro = new Date(parseInt(this.ano), mes, 1);
    // const ultimo = new Date(parseInt(this.ano), mes + 6, 0);
    this.cartoesService
      .getCartoes()
      .pipe(
        switchMap(cartoes => {
          this.cartoes = [];
          this.cartoes = cartoes;
          this.cartoes.sort(
            (a, b) => a.data['seconds'] * 1000 - b.data['seconds'] * 1000
          );
          const firstday = new Date(
            parseInt(this.ano),
            this.months.indexOf(this.mes_atual),
            1
          );
          this.cartao = null;
          const card = this.cartoes.find(a => {
            const cardata = new Date(a.data['seconds'] * 1000);
            console.log(cardata, firstday);
            if (cardata.getTime() <= firstday.getTime()) {
              return true;
            }
          });

          if (card) {
            this.cartao = card;
          }
          console.log('valorcartao', this.cartao);

          return this.vendasService.getVendaByPeriodo(parseInt(this.ano));
        })
      )
      .subscribe(faturas => {
        this.faturas = [];
        this.faturas_ini = [];
        this.faturas_ini = faturas.map(a => ({ ...a }));
        this.faturas = this.faturas_ini.map(a => ({ ...a }));
        this.faturas.sort(
          (a, b) =>
            a.dataPrimeiroPag['seconds'] * 1000 -
            b.dataPrimeiroPag['seconds'] * 1000
        );
        this.faturas.sort((a, b) => {
          if (a.clienteId < b.clienteId) {
            return -1;
          }
          if (a.clienteId > b.clienteId) {
            return 1;
          }
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

  deepCopy = <T>(target: T): T => {
    if (target === null) {
      return target;
    }
    if (target instanceof Date) {
      return new Date(target.getTime()) as any;
    }
    if (target instanceof Array) {
      const cp = [] as any[];
      (target as any[]).forEach((v) => { cp.push(v); });
      return cp.map((n: any) => this.deepCopy<any>(n)) as any;
    }
    if (typeof target === 'object' && target !== {}) {
      const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };
      Object.keys(cp).forEach(k => {
        cp[k] = this.deepCopy<any>(cp[k]);
      });
      return cp as T;
    }
    return target;
  }

  calcTotal(mesatual: number) {
    this.avista = 0;
    this.aprazo = 0;
    this.taxacredito = 0;
    this.taxadebito = 0;
    this.totaldebito = 0;
    this.totalcredito = 0;
    // this.faturasatuais = [];
    this.totaldiferenca = 0;
    this.resumo = [];
    // this.faturas = this.faturas_ini.map(a => ({ ...a }));
    this.faturas = this.deepCopy(this.faturas_ini);

    this.faturas.forEach(fatura => {
      fatura.diferenca = '0.00';
      if (!fatura.reciboshistorico) { fatura.reciboshistorico = []; }
      if (!fatura.valorhistorico) {
        fatura.valorhistorico = 0;
      }

      if (!fatura.valorpago || fatura.valorpago == 0) {
        fatura.valorpago = fatura.valor;
      }

      const mes = new Date(fatura.dataPrimeiroPag['seconds'] * 1000).getMonth();
      const ano = new Date(
        fatura.dataPrimeiroPag['seconds'] * 1000
      ).getFullYear();
      if (
        fatura.tipoPagamento == '1' &&
        mes == mesatual &&
        ano == parseInt(this.ano)
      ) {
        // this.faturasatuais.push(fatura);
        if (!fatura.status) {
          fatura.valorpago = fatura.valor;
        }

        this.calcCreditoDebitoDiferenca(fatura, fatura.tipoPagamento);

        let find = this.resumo.find(x => x.id == fatura.clienteId);
        if (!find) {
          find = this.resumo.find(x => x.name == fatura.clienteNome);
        }
        if (find) {
          if (fatura.controlada && !fatura.status) {
            find.valor += fatura.valor;
          }

          if (fatura.status || !fatura.controlada) {
            find.valorpag += fatura.valor;
          }

          if (fatura.status && fatura.controlada) {
            find.valorpag += fatura.valorpago;
          }

          find.grupo.push(fatura);
        } else {
          let val = 0;
          let valpago = 0;
          if (fatura.controlada && !fatura.status) {
            val = fatura.valor;
          }
          if (fatura.status || !fatura.controlada) {
            valpago = fatura.valor;
          }

          if (fatura.status && fatura.controlada) {
            valpago = fatura.valorpago;
          }

          if (!fatura.clienteId) {
            fatura.clienteId = fatura.clienteNome;
          }
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
       let tudozerado = fatura.divisaoPagamento.every(p=> p.precopago == 0);
        fatura.divisaoPagamento.forEach(pag => {
          const mes = new Date(pag.data['seconds'] * 1000).getMonth();
          const ano = new Date(pag.data['seconds'] * 1000).getFullYear();
          if (pag.precopago == null || tudozerado) {
            pag.precopago = pag.preco;
          }
          if (mes == mesatual && ano == parseInt(this.ano)) {
            // this.faturasatuais.push(fatura);


            this.calcCreditoDebitoDiferenca(pag, fatura.tipoPagamento);

            let find = this.resumo.find(x => x.id == fatura.clienteId);
            if (!find) {
              find = this.resumo.find(x => x.name == fatura.clienteNome);
            }
            if (find) {
              if (fatura.controlada && !pag.status) {
                find.valor += pag.precopago;
              }

              if (pag.status || !fatura.controlada) {
                find.valorpag += pag.precopago;
              }

              find.grupo.push(fatura);
            } else {
              let val = 0;
              let valpago = 0;
              if (fatura.controlada && !pag.status) {
                val = pag.precopago;
              }
              if (pag.status || !fatura.controlada) {
                valpago = pag.precopago;
              }

              if (!fatura.clienteId) {
                fatura.clienteId = fatura.clienteNome;
              }
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

    this.resumo.forEach((resu, i) => {
      let fatura: Venda;
      let valfat: Venda;
      resu.grupo.sort(
        (a, b) =>
          a.dataPrimeiroPag['seconds'] * 1000 -
          b.dataPrimeiroPag['seconds'] * 1000
      );
      resu.grupo.forEach((fat, ix) => {
        if (fat.controlada) {
          fatura = fat;
          if (valfat && fatura.controlada) {
            let hist = null;
            if (fatura.reciboshistorico && fatura.reciboshistorico.length > 0) {

              console.log(valfat.clienteNome, 'aquiii');
              hist = fatura.reciboshistorico.find(
                a => valfat.recibo == a.recibo
              );
            }

            if (!hist) {
              if (valfat.valorhistorico > 0) {
                valfat.valor += fat.valorhistorico;
                valfat.valorpago += valfat.valorpago;
              } else {
              valfat.valor += fat.valor;
              valfat.valorpago += valfat.valorpago;
              }
              let statuspago = 0;
              if (fat.tipoPagamento == '2') {
                valfat.divisaoPagamento.forEach(f => {
                  valfat.valorpago += f.precopago;
                  if (f.status) {
                    statuspago += f.precopago;
                  }
                });

                if (valfat.valorhistorico > 0) {
                  fatura.valor += valfat.valorhistorico;
                  fatura.valorpago += valfat.valorpago;
                } else {
                fatura.valor = valfat.valor;
                fatura.valorpago = valfat.valorpago;
                }

                fatura.valor -= statuspago;
                fatura.valorhistorico = fatura.valor;
                const obj = {
                  id: valfat.id,
                  recibo: valfat.recibo
                };
                fatura.reciboshistorico.push(obj);
                // valfat.valorhistorico = valfat.valor;
                fatura.novasoma = true;

                console.log(fatura);
              }
            }
          }

          valfat = fatura;
        }
      });

      resu.grupo.forEach((fat, ix) => {
        if (valfat) {
          if (fat.controlada && fat.id != valfat.id) {
            const achei = resu.grupo.findIndex(a => a.id == fat.id);
            if (achei >= 0) {
              resu.grupo.splice(achei, 1);
            }

            let recalc = false;
            let index = 0;
            valfat.divisaoPagamento.forEach((f, indexi) => {
              const mes = new Date(f.data['seconds'] * 1000).getMonth();
              const ano = new Date(f.data['seconds'] * 1000).getFullYear();
              if (mes == mesatual && ano == parseInt(this.ano)) {
                resu.valor = f.precopago;

                index = indexi;

                if (!f.status) {
                  recalc = true;
                  // resu.valor = valfat.valor;
                } else {
                  resu.valor = 0.0;
                }
              }
            });

            if (recalc && valfat.novasoma) {
              console.log(valfat.clienteNome, 'aquiii');
              valfat.divisaoPagamento.forEach((f, index) => {
                f.precopago = valfat.valor / parseInt(valfat.vezes);
                resu.valor = f.precopago;
              });



              // resu.valor = valfat.valor

              // } else {
              //   this.redistribuiValores(valfat, index);
            }

          }
        }
      });
    });

    this.resumo.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    this.avista = 0;
    this.aprazo = 0;
    this.taxacredito = 0;
    this.taxadebito = 0;
    this.totaldebito = 0;
    this.totalcredito = 0;
    this.totaldiferenca = 0;
    this.resumo.forEach(re => {
      re.grupo.forEach(fat => {
        if (fat.tipoPagamento == '2') {
          let totfatura = 0;
          fat.divisaoPagamento.forEach(pag => {
            const mes = new Date(pag.data['seconds'] * 1000).getMonth();
            const ano = new Date(pag.data['seconds'] * 1000).getFullYear();
            if (mes == mesatual && ano == parseInt(this.ano)) {
            this.calcCreditoDebitoDiferenca(pag, fat.tipoPagamento);
            }
            totfatura += pag.precopago;
          });
            if (
              this.mescorrente(
                fat.divisaoPagamento[fat.divisaoPagamento.length - 1]
              )
            ) {
              if (fat.valorhistorico > 0) {this.totaldiferenca += fat.valorhistorico - totfatura; }

        }
      }
        if (fat.tipoPagamento == '1') {
          this.calcCreditoDebitoDiferenca(fat, fat.tipoPagamento);
          this.totaldiferenca += fat.valor - fat.valorpago;
        }
      });
    });
  }

  calcCreditoDebitoDiferenca(pag, tipo) {
    if (tipo == '2') {
      this.aprazo += pag.precopago;
      if (this.cartao) {
        if (pag.forma == 'debito') {
          this.totaldebito += pag.precopago;
          this.taxadebito += (pag.precopago * this.cartao.valorDebito) / 100;
        }
        if (pag.forma == 'credito') {
          this.totalcredito += pag.precopago;
          this.taxacredito += (pag.precopago * this.cartao.valorCredito) / 100;
        }
      }
    }

    if (tipo == '1') {
      this.avista += pag.valor;
      if (this.cartao) {

        if (pag.valorpago > 0) {
          if (pag.forma == 'debito') {
            this.totaldebito += pag.valorpago;
            this.taxadebito += (pag.valorpago * this.cartao.valorDebito) / 100;
          }

        if (pag.forma == 'credito') {
          this.totalcredito += pag.valorpago;
          this.taxacredito += (pag.valorpago * this.cartao.valorCreditoAv) / 100;
        }
      } else {
        if (pag.forma == 'debito') {
          this.totaldebito += pag.valor;
          this.taxadebito += (pag.valorpago * this.cartao.valorDebito) / 100;
        }

      if (pag.forma == 'credito') {
        this.totalcredito += pag.valor;
        this.taxacredito += (pag.valor * this.cartao.valorCreditoAv) / 100;
      }
      }
      }
    }
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
    return new Date(val['seconds'] * 1000);
  }

  redistribuiValores(fat, index) {
    if (fat.tipoPagamento == '1') {
      this.confereValorPositvo(fat);
    } else {
      let valorrestante = 0;
      let sum = 0;
      for (let i = 0; i < fat.divisaoPagamento.length; i++) {
        if (i > index) {
          break;
        }
        sum += fat.divisaoPagamento[i].precopago;
      }

      if (fat.valorhistorico > 0) {
        valorrestante = fat.valorhistorico - sum;
      } else { valorrestante = fat.valor - sum; }

      for (let i = index + 1; i < fat.divisaoPagamento.length; i++) {
    
        fat.divisaoPagamento[i].precopago = valorrestante / (fat.divisaoPagamento.length - index - 1);
        
      }
    }
    // if(fat.divisaoPagamento[index].preco < 0)btpago.disabled = true;
  }

  confereValorPositvo(fat: Venda) {
    if (fat.tipoPagamento == '1' && fat.valorpago < 0) {
      return true;
    }

    const val = fat.divisaoPagamento.some(a => a.precopago < 0);
    if (val && fat.tipoPagamento == '2') {
      return true;
    }

    let total = 0;
    if (fat.tipoPagamento == '2') {
      fat.divisaoPagamento.forEach(sum => (total += sum.precopago));
    }
    if (fat.tipoPagamento == '1') {
      total = fat.valorpago;
    }
    /*    if (
      total.toFixed(2) < fat.valor.toFixed(2) ||
      total.toFixed(2) > fat.valor.toFixed(2)
    ) { */
    fat.diferenca = '0.00';
    if (fat.valorhistorico > 0) {
      fat.diferenca = ((fat.valorhistorico - total) * -1).toFixed(2);
      fat.diferenca = ((fat.valorhistorico - total) * -1).toFixed(2);
    } else {
      fat.diferenca = ((fat.valor - total) * -1).toFixed(2);
      fat.diferenca = ((fat.valor - total) * -1).toFixed(2);
    }

    if (fat.diferenca == '-0.00') {
      fat.diferenca = '0.00';
    }

    return false;
  }

  comparaData(dataFatura1, data, index) {
    if (index == 0) {
      const data1 = new Date(dataFatura1['seconds'] * 1000);
      const data2 = new Date(data['seconds'] * 1000);
      // let data1a = new Date(data1.getFullYear(),data1.getMonth(),data1.getDate(),0,0,0,0);
      // let data2a = new Date(data2.getFullYear(),data2.getMonth(),data2.getDate(),0,0,0,0);

      if (data1.getTime() == data2.getTime()) {
        return 'IGUAIS';
      }
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
        fat.valorpago = a.valorpago;

        const data1 = new Date(fat.data['seconds'] * 1000);
        const data2 = new Date(fat.dataPrimeiroPag['seconds'] * 1000);
        fat.status = false;
        if (data1.getTime() == data2.getTime()) {
          fat.status = true;
        }
        this.vendasService.updateFatura(fat);
      });
  }

  pagaFaturaParcial(fat: Venda, pag) {
    pag.status = true;
    this.vendasService
      .updateFaturaParcial(fat)
      .then(a => console.log(a, 'update'))
      .catch(e => console.log(e));
  }

  resetaFaturaParcial(fat: Venda, pag) {
    this.vendasService
      .getVenda(fat.id)
      .pipe(take(1))
      .subscribe(a => {
        a.divisaoPagamento.forEach((b, i) => {

          fat.divisaoPagamento[i].precopago = b.precopago;
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

  arredondar(n, fat, t, digits = 0) {
    let negative = false;
    if (digits === undefined) {
      digits = 0;
    }
    if (n < 0) {
      negative = true;
      n = n * -1;
    }
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if (negative) {
      n = (n * -1).toFixed(2);
    }
    if (fat) {
      if (fat.tipoPagamento == '2') {
        fat.divisaoPagamento[t].precopago = parseInt(n);
      } else {
        fat.valorpago = parseInt(n);
      }
      this.redistribuiValores(fat, t);
    }
  }

  mostraRecibos(recibos: string[], recibo: string) {
    return recibo + ',' + recibos.join(',');
  }
}
