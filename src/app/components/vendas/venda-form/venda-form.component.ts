import { ClienteService } from 'src/app/services/cliente.service';
import { Produto } from '../../../models/produto.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProdutoService } from 'src/app/services/produto.service';
import { DatePipe, Location } from '@angular/common';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { VendaService } from 'src/app/services/venda.service';
import { Venda } from 'src/app/models/venda.model';
import { Router, ActivatedRoute } from '@angular/router';
import { InfoModalComponent } from '../../shared/info-modal.component.ts/info-modal.component';
import { MatDialog, MatDatepickerInputEvent } from '@angular/material';
import { PrintComponent } from './../print.component';
import { rowsAnimation, fadeAnimation } from '../../shared/animations/animations';

@Component({
  selector: 'app-venda-form',
  templateUrl: './venda-form.component.html',
  styleUrls: ['./venda-form.component.scss'],
  animations: [rowsAnimation, fadeAnimation]
})
export class VendaFormComponent implements OnInit {
  form: FormGroup;
  produtos: Produto[] = [];
  produto: Produto;
  day = new Date();
  lista = [];
  arrayProdutos = [];

  clientes: Cliente[] = [];
  cliente: Cliente;
  arrayClientes = [];

  totalLista = 0;
  quantidadeTotalLista = 0;

  filteredOptionsFindProduto: Observable<Produto[]>;
  filteredOptionsFindCliente: Observable<Cliente[]>;
  myControlProduto = new FormControl();
  myControlCliente = new FormControl();
  um = '1';
  dois = '2';
  avistaaprazo = '1';
  dataRecibo = new Date();
  desconto = 0;
  numeroPagamentos = '1';
  pagamentos = [];
  quantidade = 0;
  forma = 'debito';
  status = false;

  primeiroPagamento = new Date();
  primeiroPagamento2 = new Date();

  dataPrimeiroPag = new Date();
  dataUltimoPag = new Date();

  controlada = false;

  @ViewChild('nomeCliente', {static: false}) nomeCliente;

  constructor(
    private produtosService: ProdutoService,
    private clientesService: ClienteService,
    private vendasService: VendaService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {

    this.myControlProduto.setValue('SD00000');

    this.form = this.fb.group({
      cliente: ['Cliente', Validators.required],
      recibo: ['00001', Validators.required],
      data: [new Date(this.dataRecibo), Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      let num = '00001';
      if (params.lastCode != '') {
      const partNumber = Number(params.lastCode) + 1;
      const s = '00000' + String(partNumber);
      num = s.substr(s.length - 5);
      }

      const dat = new Date(this.dataRecibo);
      this.form.setValue({
        cliente: 'Cliente',
        recibo: num,
        data: dat,
        });

    });


    this.produtosService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;
      this.arrayProdutos = [];
      this.arrayProdutos = this.produtos;
      // this.produtos.map(a => {
      //   this.arrayProdutos.push(a.codigo);
      // });
    });

    this.clientesService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      this.arrayClientes = [];
      this.arrayClientes = this.clientes;
      // this.clientes.map(a => {
      //   this.arrayClientes.push(a.nome);
      // });
    });

    this.filteredOptionsFindProduto = this.myControlProduto.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFindProduto(value))
    );

    setTimeout(a => {
    this.filteredOptionsFindCliente = this.form
      .get('cliente')
      .valueChanges.pipe(
        startWith(''),
        map(value => this._filterFindCliente(value))
      );
    }, 1000);

      // this.nomeCliente.nativeElement.focus();
  }

  private _filterFindProduto(value: string): Produto[] {
    let filterValue = '';
    if (value) {
      filterValue = value.toLowerCase();
    }



    const data = this.arrayProdutos.filter(
      option => option.codigo.toLowerCase().indexOf(filterValue) === 0
    );

    this.produto = null;
    if (data.length > 0 && filterValue.length > 3) {
      this.produto = this.produtos.find(a => a.codigo == data[0].codigo);
    }
    if (this.produto) {
      if (this.produto.quantidade > 0) {
        this.quantidade = 1;
      }
    } else {
      this.produto = null;
      this.quantidade = 0;
    }

    return data;
  }

  private _filterFindCliente(value: string): Cliente[] {


    let filterValue = '';
    if (value) {
      filterValue = value.toLowerCase();
    }

    const data = this.arrayClientes.filter(
      option => option.nome.toLowerCase().indexOf(filterValue) === 0
    );

    if (data.length == 1) {
      this.cliente = this.clientes.find(a => a.nome == data[0].nome);
    } else {
      this.cliente = null;
    }

    return data;
  }

  addLista() {
    let findproduto: Produto;

    if (this.produto) {
      findproduto = this.lista.find(a => a.codigo == this.produto.codigo);
    }

    if (this.produto && !findproduto) {
      const prod = { ...this.produto };

      const estoque = prod.estoque.find(a => a.id == '');

      if (!estoque) {
        prod.estoque.push({ id: '', quant: this.quantidade, recibo: '', cliente: '', clienteId: '', data: '' });
      } else {
        estoque.quant += this.quantidade;
      }

      prod.quantidade = this.quantidade;
      // this.produto.quantidade -= this.quantidade;

      this.lista.push(prod);


      this.quantidadeTotalLista = this.lista.reduce((acumulado, atual) => {
        return acumulado + atual.quantidade;
       }, 0);

      // this.totalLista += this.produto.preco * this.quantidade;

      this.aplicaDesconto();
      this.myControlProduto.setValue('SD00000');
      this.produto = null;
      this.quantidade = 0;
    }
  }

  deleteLista(index: number, produto: Produto) {
    this.totalLista -= produto.preco * produto.quantidade;
    const findproduto = this.arrayProdutos.find(
      a => a.codigo == produto.codigo
    );
    // findproduto.quantidade += produto.quantidade;
    const IndexEstoque = findproduto.estoque.findIndex(a => a.id == '');
    if (IndexEstoque >= 0) {
      findproduto.estoque.splice(IndexEstoque, 1);
    }


    // estoque.quant -= produto.quantidade;
    this.lista.splice(index, 1);
    this.quantidadeTotalLista = this.lista.reduce((acumulado, atual) => {
      return acumulado + atual.quantidade;
     }, 0);
     this.aplicaDesconto();
  }

  aplicaDesconto() {
    this.totalLista = this.lista.reduce((sum, item) => {
      let preco = 0;
      if(item.desc > 0){
       preco = item.preco - (item.desc * item.preco / 100);
      }else{
      preco = item.preco;
      }
      return sum + preco * item.quantidade;
    }, 0);

    if (this.desconto > 0) {
      this.totalLista =
        this.totalLista - (this.desconto * this.totalLista) / 100;

    }
    if (this.pagamentos.length > 0) {
    this.pagamentos.forEach(x => {
      x.preco = this.totalLista / parseInt(this.numeroPagamentos);
    });
    }
  }

  addPagamentos() {
    this.pagamentos = [];
    let length = 0;
    if (this.avistaaprazo == '2') {
      if (this.numeroPagamentos == '1') {this.numeroPagamentos = '2'; }
    while (length < parseInt(this.numeroPagamentos)) {
      this.pagamentos.push({
        preco: this.totalLista / parseInt(this.numeroPagamentos),
        precopaago: 0,
        forma: 'credito',
        data: new Date()
      });
      length++;
    }
  } else {
    this.numeroPagamentos = '1';
  }

  this.dataPrimeiroUltimoPag();
  }

  numPag(num) {
    return parseInt(num);
  }

  addDesconto(i = -1) {
    if (this.desconto < 30 || (i !== -1 && this.lista[i].desc < 30)) {
      if (i == -1) {
      this.desconto += 5;
      } else {
        if (!this.lista[i].desc) {this.lista[i].desc = 0; }
        this.lista[i].desc += 5;
        console.log(this.lista[i].desc);
      }
      this.aplicaDesconto();
    }
  }

  removeDesconto(i = -1) {
    if (this.desconto > 0 || (i !== -1 && this.lista[i].desc > 0)) {
      if (i == -1) {
      this.desconto -= 5;
      } else {
        if (!this.lista[i].desc) {this.lista[i].desc = 0; }
        this.lista[i].desc -= 5;
      console.log(this.lista[i].desc);
      }
      this.aplicaDesconto();
    }
  }

  addQuantidade() {

    if (this.quantidade < this.produto.quantidade - this.calcEstoque()) {
      this.quantidade += 1;
    }
  }

  removeQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade -= 1;
    }
  }

  redistribuiValores(index) {
    let valorrestante = 0;
    let sum = 0;
    for (let i = 0; i < this.pagamentos.length; i++) {
      if (i > index) {
        break;
      }
      sum += this.pagamentos[i].preco;
    }

    valorrestante = this.totalLista - sum;

    for (let i = index + 1; i < this.pagamentos.length; i++) {
      this.pagamentos[i].preco =
        valorrestante / (this.pagamentos.length - index - 1);
    }


  }

  confereValorPositvo() {
    if (this.avistaaprazo == '2') {
    const val = this.pagamentos.some(a => a.preco < 0);
    if (val) {return true; }
    let total = 0;
    this.pagamentos.forEach(sum => total += sum.preco);
    if ((total.toFixed(2) < (this.totalLista).toFixed(2)) || ( total.toFixed(2) > (this.totalLista).toFixed(2))) {return true; }
    }
    return false;
  }

  createVenda() {
    if (this.form.valid && this.lista.length > 0) {


      const quant = this.lista.reduce((acumulado, atual) => {
        return acumulado + atual.quantidade;
      }, 0);

      this.dataPrimeiroUltimoPag();

      let id = '';
      let clienteEndereco = '';
      let clienteTelefone = '';
      let clienteObs = '';
      if (this.cliente) {
        id = this.cliente.id;
        clienteEndereco = this.cliente.endereco;
        if(this.cliente.obs)
        clienteObs = this.cliente.obs;
        if (this.cliente.telefone) {
        clienteTelefone = this.cliente.telefone;
        } else if (this.cliente.celular) {clienteTelefone = this.cliente.celular; }
      }

      const venda: Venda = {
        clienteNome: this.form.value.cliente,
        clienteId: id,
        clienteObs: clienteObs,
        clienteEndereco: clienteEndereco,
        clienteTelefone: clienteTelefone,
        recibo: this.form.value.recibo,
        data: new Date(this.form.value.data),
        mes: new Date(this.form.value.data).getMonth(),
        ano: new Date(this.form.value.data).getFullYear(),
        desconto: this.desconto,
        listaProduto: this.lista,
        tipoPagamento: this.avistaaprazo,
        vezes: this.numeroPagamentos,
        divisaoPagamento: this.pagamentos,
        valor: this.totalLista,
        quantidadeTotal: quant,
        dataPrimeiroPag: this.dataPrimeiroPag,
        dataUltimoPag: this.dataUltimoPag,
        forma: this.forma,
        controlada: this.controlada,
        status: this.status
      };

      this.vendasService
        .getVendaByRecibo(venda.recibo)
        .get()
        .subscribe(document => {
          if (document.size > 0) {
            window.scroll(0, 0);
            this.vendasService.flashMessageToExist(venda.recibo);
          } else {
            this.vendasService
              .newVenda(venda)
              .then(result => {
                let id = '';
                if (this.cliente) {id = this.cliente.id; }
                this.produtosService.updateEstoque(venda.listaProduto, result, this.form.value, id);


    this.dialog.open(PrintComponent, {
// tslint:disable-next-line: max-line-length
      data: { lista: this.lista, recibo: this.form.value.recibo, totalLista: this.totalLista, datavenda: this.form.value.data, desconto: this.desconto}
    }).afterClosed().subscribe(result => {


                this.form.reset();
                this.produto = null;
                this.day = new Date();
                this.form.setValue({
                  cliente: '',
                  recibo: '',
                  data: new Date(this.dataRecibo)
                });
                this.lista = [];
                this.cliente = null;
                this.totalLista = 0;
                this.avistaaprazo = '1';
                this.dataRecibo = new Date();
                this.desconto = 0;
                this.numeroPagamentos = '2';
                this.pagamentos = [];
                this.quantidade = 0;
                this.forma = 'debito';
                this.controlada = false;
                this.primeiroPagamento = new Date();
                this.vendasService.flashMessageToNew(venda.recibo);
                this.router.navigate(['vendas']);
              });

            }).catch(error => {
              this.dialog.open(InfoModalComponent, {
                data: { title: 'Erro', message: error.message }
              });
            });
          }
        });
    }
  }

  calcEstoque() {

    let estoque = 0;
    if (
      this.produto &&
      this.produto.estoque &&
      this.produto.estoque.length > 0
    ) {


    this.produto.estoque.forEach(obj => {
      estoque += obj.quant;

    });

  }

  return estoque;

}

  return() {
    this.location.back();
  }

  pad(num, size) {
    const numnum = parseInt(num);
    let s = '';
    for (let i = 0; i < 5 - numnum.toString().length; i++) {
      s += '0';
    }

    let retorno = s + numnum.toString();
    if (retorno.length > 5) {
      retorno = retorno.substr(retorno.length - 5);
    }
    this.form.value.recibo = retorno;
    return retorno;
  }

  padCodigo(num, size) {
    const numnum = parseInt(num);
    let s = '';
    for (let i = 0; i < 5 - numnum.toString().length; i++) {
      s += '0';
    }

    let retorno = 'SD' + s + numnum.toString();
    if (retorno.length > 7) {
      retorno = 'SD' + retorno.substr(2 + retorno.length - 7);
    }
    this.myControlProduto.setValue(retorno);
    return retorno;
  }

  dataPrimeiroUltimoPag() {

      this.dataPrimeiroPag = new Date(this.form.value.data);
      this.dataUltimoPag = new Date(this.form.value.data);



      if (this.avistaaprazo == '1') {
        this.dataPrimeiroPag = new Date(this.primeiroPagamento);

        this.dataUltimoPag = new Date(this.primeiroPagamento);
      } else {
        this.dataPrimeiroPag = new Date(this.primeiroPagamento2);
        this.dataUltimoPag = new Date(this.primeiroPagamento2);
        let mes = this.primeiroPagamento2.getMonth();
        const ano = this.primeiroPagamento2.getFullYear();
        // let lastDay = new Date(dataUltimoPag.getFullYear(),dataUltimoPag.getMonth(),0);

        for (let i = 0; i < this.pagamentos.length; i++) {

          mes++;
          // if (mes % 13 == 0) {
          //   ano+=1;

          // }


           const lastday = new Date(ano, mes, 0);
           const day = new Date(ano, mes - 1, this.dataPrimeiroPag.getDate());


           // let day = new Date(`${ano.toString()}-${mes.toString()}-${this.dataPrimeiroPag.getDate().toString()}`);
        // let day = new Date(ano,mes,this.dataPrimeiroPag.getDate());

        if (lastday.getMonth() != day.getMonth()) {

            this.pagamentos[i].data = new Date(day.getFullYear(), day.getMonth(), 0);

           } else {

            this.pagamentos[i].data = new Date(day);

           }

            this.dataUltimoPag = new Date(this.pagamentos[i].data);

        }
      }

      if (this.dataPrimeiroPag.getTime() == this.form.value.data.getTime()) {
        this.status = true;
      } else {
        this.status = false;
        }

        if (this.pagamentos.length > 0) {
          this.pagamentos[0].status = this.status;
        }


    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      this.dataPrimeiroUltimoPag();
    }

    arredondar(n, digits = 0) {
      let negative = false;
      if (digits === undefined) {
          digits = 0;
      }
          if ( n < 0) {
          negative = true;
        n = n * -1;
      }
      let multiplicator = Math.pow(10, digits);
      n = parseFloat((n * multiplicator).toFixed(11));
      n = (Math.round(n) / multiplicator).toFixed(2);
      if ( negative ) {
          n = (n * -1).toFixed(2);
      }
    this.totalLista = parseInt(n);

  }


  onChangeAllMethodPayments(forma, j) {
    if (j == 0) {
    this.pagamentos.forEach(a => {
      a.forma = forma;
    });
    }
  }

}
