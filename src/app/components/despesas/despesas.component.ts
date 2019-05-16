import { startWith, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FormControl } from '@angular/forms';
import { DespesaService } from '../../services/despesa.service';
import { Despesa } from 'src/app/models/despesa.model';
import { rowsAnimation, fadeAnimation } from '../shared/animations/animations';

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.scss'],
  animations: [rowsAnimation, fadeAnimation]
})
export class DespesasComponent implements OnInit {
  anos = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  data = new Date();
  numero_mes = this.data.getMonth();
  ano = this.data.getFullYear().toString();
  months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  mes_atual = this.months[this.numero_mes];
  totalDespesa = 0;

  despesas: Despesa[] = [];
  despesasHeader = [];
  despesasItem: Despesa[] = [];
  despesa: Despesa = {
    despesa: '',
    observacao: '',
    valor: 0,
    data: new Date(),
    mes: 0,
    ano: 0,
  }

  filteredOptions: Observable<string[]>;
  myControl = new FormControl();


  options: string[] = [
    'Alimentação',
    'Aluguel',
    'Cartão Santander',
    'Cartão Dourado',
    'Cartão Preto',
    'Cartão Citi',
    'Combustível',
    'DAS',
    'Iluria',
    'IPTU',
    'Marketing',
    'Telefone',
  ];

  constructor(private despesasService: DespesaService) { }

  ngOnInit() {

    this.filteredOptions = this.myControl
    .valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );


    this.listeningFatura();
  }

  listeningFatura(){

    this.despesasService.getDespesaByPeriodo(parseInt(this.ano))
    .subscribe(despesas => {

    this.despesas = [];
    this.despesas = despesas;
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
    this.despesasHeader = [];
    this.despesasItem = [];
    this.despesas.sort((a, b) => {
      if (a.despesa < b.despesa) { return -1; }
      if (a.despesa > b.despesa) { return 1; }
      return 0;
    });
    let grupo = []
this.despesas.forEach(a=>{
  if(a.mes == mesatual){

    let find = this.despesasHeader.find(b=> b.despesa.despesa == a.despesa)
    if(!find){
      grupo = []
      grupo.push({...a});
      this.despesasHeader.push({ despesa: {...a}, grupo: grupo});
    }
    else {
      find.despesa.valor += a.valor;
      find.grupo.push({...a});
    }

  }
})
this.totalDespesa = 0;
this.despesasHeader.forEach(a=>{
  this.totalDespesa += a.despesa.valor;
})

console.log(this.despesasItem)
  }

  private _filter(value: string): string[] {
    let filterValue = '';
    if (value) { filterValue = value.toLowerCase(); }

    return this.options.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  addDespesa(){
    this.despesa.mes = this.despesa.data.getMonth();
    this.despesa.ano = this.despesa.data.getFullYear();
    this.despesasService.newDespesa(this.despesa);
  }

  backTimeStamp(val){

    return val.toDate();

  }

deleteDespesa(item: Despesa){

  this.despesasService.deleteDespesa(item.id)
}

}
