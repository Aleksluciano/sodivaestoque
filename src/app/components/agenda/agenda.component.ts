import { Agenda } from './../../models/agenda.model';
import { AgendaService } from './../../services/agenda.service';
import { Component, OnInit } from '@angular/core';
import { CreateAgendaComponent } from './create-agenda/create-agenda.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {
agendas: Agenda[] = [];
agendasTotal: Agenda[] = [];
pickerInicio = new Date();
pickerFim = new Date();
modeldate = new Date();
pendentes = 0;
  constructor(private agendasService: AgendaService,
    private dialog: MatDialog) { }

  ngOnInit() {
this.pickerFim.setDate(this.pickerInicio.getDate() + 7);
this.pickerFim = new Date(this.pickerFim.getFullYear(), this.pickerFim.getMonth(), this.pickerFim.getDate(), 24);
    this.agendasService.getAgendas()
    .subscribe(agendas => {
    this.agendasTotal = [];
    this.agendasTotal = this.deepCopy(agendas).map(a => {
      // tslint:disable-next-line: no-unused-expression
      a.dateTime = new Date(a.dateTime['seconds'] * 1000);
      return a;
    });
    this.quantidadeAtividadePendente();
    this.agendas = [];
    this.agendas = this.deepCopy(agendas).map(a => {
      // tslint:disable-next-line: no-unused-expression
      a.dateTime = new Date(a.dateTime['seconds'] * 1000);
      return a;
    })
    .filter( b => {
      const newDateFim = new Date(this.pickerFim.getFullYear(), this.pickerFim.getMonth(), this.pickerFim.getDate(), 24);

      if ( (b.dateTime.getTime() >= this.pickerInicio.getTime()) && (b.dateTime.getTime() <= newDateFim.getTime())) {return true; }
    });

    console.log(agendas);
    });
  }

  changeCheckBox(agenda: Agenda) {
    this.agendasService.updateAgenda(agenda);

  }

  removeCard(agenda: Agenda) {
    this.agendasService.deleteAgenda(agenda.id);
  }

  quantidadeAtividadePendente() {
    this.pendentes = this.agendasTotal.filter(a => !a.isDone).length;
  }

  filterDate() {
    const agendasTemp = this.deepCopy(this.agendasTotal);
   this.agendas = agendasTemp.filter( b => {
    const newDateFim = new Date(this.pickerFim.getFullYear(), this.pickerFim.getMonth(), this.pickerFim.getDate(), 24);
    if ( (b.dateTime.getTime() >= this.pickerInicio.getTime()) && (b.dateTime.getTime() <= newDateFim.getTime())) {return true; }
  });
  }


  createActivitie() {

    this.dialog.open(CreateAgendaComponent,  { width: '200',
      data: { title: 'Criar atividade', message: '' }
    }).afterClosed().subscribe(result => {
    if (result) {
      
      console.log("tempo",result.tempo, "dia", result.dia);
console.log(new Date(result.dia.year, result.dia.month, result.dia.day, result.tempo.hour, result.tempo.minute ));
const agenda: Agenda= {
  dateTime: new Date(result.dia.year, result.dia.month, result.dia.day, result.tempo.hour, result.tempo.minute ),
  isDone: false,
  name: result.activitie,
  person: result.name
}
    this.agendasService.newAgenda(agenda);
    this.pickerFim = new Date(result.dia.year, result.dia.month, result.dia.day, result.tempo.hour, result.tempo.minute );
    this.pickerInicio = new Date(result.dia.year, result.dia.month, result.dia.day, result.tempo.hour, result.tempo.minute );
    this.filterDate();
    }
    });
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

}
