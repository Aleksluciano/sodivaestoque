import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-print',
  template: `
  <div id="tela">
  <div id="myprint" >
  <section>
  <hr>
  </section>
  <section>
  <strong style="margin-left: 25px">SÓ DIVAS STORE</strong>
  </section>
  <section>
  <hr>
  </section>
  <section>
  <span style="margin-left: 25px;font-size: .8em">*** Cupom não fiscal ***</span>
  </section>
  <section>
  <hr>
  </section>
  <section>
  <strong>N° {{ data.recibo }}</strong>
  <span style="font-size: 0.7em;margin-left: 40px">Data: {{ data.datavenda | date:'dd-MM-yyyy' }}</span>
  </section>
  <section>
  <hr>
  </section>
  <section>
  <span style="font-size: 0.8em">CODIGO</span><span style="font-size: 0.8em;margin-left:30px">DESCRIÇÃO</span>
  </section>
  <section>
  <span style="font-size: 0.8em;margin-left:90px">QTDxVLR</span>
  </section>
  <section>
  <hr>
  </section>
  <br>
  <section *ngFor="let item of data.lista">
  <span style="font-size: 0.8em" >{{ item.codigo }} {{ item.descricao }}</span>
  <section>
  <span style="font-size: 0.8em;margin-left: 70px" >{{item.quantidade}}un x R$ {{ item.preco | number: '.2-2'}}</span>
  </section>
  </section>
  <br>
  <section>
  <hr>
  </section>
  <section *ngIf="data.desconto > 0">
<span style="font-size: 0.8em" >Valor dos itens:.... R$ {{ totalSemDesconto() | number: '.2-2' }}</span>
  </section>
  <section *ngIf="data.desconto > 0">
<span style="font-size: 0.8em" >Desconto:............. {{ data.desconto }}%</span>
  </section>
  <section>
<span style="font-size: 0.8em" >Total:.................... R$ {{ data.totalLista | number: '.2-2' }}</span>
    </section>
    <section>
    <hr>
    </section>
    <br>
    <section>
      <span style="font-size: 0.9em" >Agradecemos a preferência!</span>
    </section>

  </div>
  <h4>Imprimir?</h4>
  <div mat-dialog-actions>
  <button id="buttonYes" mat-button [mat-dialog-close]="true" (click)="print()">Sim</button>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <button id="buttonNo" mat-button [mat-dialog-close]="false">Não</button>
</div>
</div>


  `,
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { lista: [], recibo: string, totalLista: number, datavenda: Date, desconto: number }) {}

  ngOnInit() {

  }
  print(){
    const printContent = document.getElementById('myprint');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

totalSemDesconto(){
  return this.data.lista.reduce((sum, item) => {
    return sum + item['preco'] * item['quantidade'];
  }, 0);

  }

}
