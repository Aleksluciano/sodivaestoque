import { Produto } from './../../../../models/produto.model';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProdutoService } from 'src/app/services/produto.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InfoModalComponent } from 'src/app/components/shared/info-modal.component.ts/info-modal.component';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { Fornecedor } from 'src/app/models/fornecedor.model';

@Component({
  selector: 'app-add-produto',
  template: `
    <br />
    <form [formGroup]="form" (ngSubmit)="onSubmit($event)">
      <app-produto-form-edit
        [parent]="form"
        [arrayProdutos]="arrayDataSource"
        [optionsFornecedor]="arrayFornecedor"
        [produtos]="produtos"
        [produto]="produto"
        [myControl]="myControl"
        (find)="findData($event)"
        (next)="nextData($event)"
        (previous)="previousData($event)"
        (back)="onBackClicked()"
        (delete)="deleteProduto()"
      >
      </app-produto-form-edit>
    </form>
  `
})
export class EditProdutoComponent implements OnInit {
  produto: Produto;
  produtos: Produto[] = [];
  arrayDataSource = [];
  myControl = new FormControl();

  arrayFornecedor: string[] = [];
  fornecedores: Fornecedor[] = [];
  day = new Date();

  id: string;

  form = this.fb.group({
    fornec: this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      fornecedor: ['', Validators.required],
      // codigofornecedor: "",
      data: [
        new Date(),
        Validators.required
      ],
      cor: ['', Validators.required],
      tipo: ['', Validators.required],
      tamanho: ['', Validators.required],
      quantidade: ['', Validators.required],
      valor: ['', Validators.required],
      // custo: ['',Validators.required],
      preco: ['', Validators.required]
      // lucrobruto: ''
    })
  });

  constructor(
    private produtosService: ProdutoService,
    private fornecedoresService: FornecedorService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.fornecedoresService.getFornecedores().subscribe(fornecedores => {
      this.fornecedores = fornecedores;
      this.fornecedores.map(a => {
        this.arrayFornecedor.push(a.nome);
      });
    });

    this.produtosService.getProdutos().subscribe(produtos => {
      this.produtos = produtos.map(a => ({ ...a }));
      this.arrayDataSource = [];
      this.produtos.map(a => {
        this.arrayDataSource.push(a.codigo);
      });
    });

    // Get id from url
    this.id = this.route.snapshot.params['id'];

    // Get produto
    this.produtosService.getProduto(this.id).subscribe(produto => {
      this.produto = produto;
      this.myControl.setValue(this.produto.codigo);
      if (this.produto) {
        this.form.controls.fornec.setValue({
          codigo: this.produto.codigo,
          descricao: this.produto.descricao,
          fornecedor: this.produto.fornecedor,
          // codigofornecedor: this.produto.codigofornecedor,
          data: new Date(this.produto.data['seconds'] * 1000),
          cor: this.produto.cor,
          tipo: this.produto.tipo,
          tamanho: this.produto.tamanho,
          quantidade: this.produto.quantidade,
          valor: this.produto.valor,
          // custo: this.produto.custo,
          preco: this.produto.preco
          // lucrobruto: this.produto.lucrobruto
        });

        this.form.controls.fornec.disable();
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const id = this.produto.id;
      const estoque = this.produto.estoque;
      this.produto = this.form.value.fornec;
      this.produto.id = id;
      this.produto.estoque = estoque;

      this.produtosService
        .updateProduto(this.produto)
        .then(a => {
          this.produtosService.flashMessageToUpdate(this.produto.codigo);
          this.form.disable();

          this.produtosService.getProdutos().subscribe(produtos => {
            this.produtos = produtos.map(a => ({ ...a }));
            this.arrayDataSource = [];
            this.produtos.map(a => {
              this.arrayDataSource.push(a.codigo);
            });
          });

          this.myControl.setValue(this.produto.codigo);
        })
        .catch(error => {
          this.dialog.open(InfoModalComponent, {
            data: { title: 'Erro', message: error.message }
          });
        });
    }
  }

  onBackClicked() {
    this.location.back();
  }

  deleteProduto() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const produto = { ...this.produto };
    dialogConfig.data = {
      message: `Deseja realmente remover o produto`,
      item: `${this.produto.codigo}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.produtosService
            .deleteProduto(this.produto.id)
            .then(a => {
              this.produtosService.flashMessageToDelete(produto.codigo);
              this.form.reset();
              this.router.navigate(['produtos']);
            })
            .catch(error => {
              this.dialog.open(InfoModalComponent, {
                data: { title: 'Erro', message: error.message }
              });
            });
        }
      });
  }

  findData(e) {
    this.produto = this.produtos.find(a => a.codigo == e);
    if (this.produto) {
      this.myControl.setValue(this.produto.codigo);

      this.form.controls.fornec.setValue({
        codigo: this.produto.codigo,
        descricao: this.produto.descricao,
        fornecedor: this.produto.fornecedor,
        // codigofornecedor: this.produto.codigofornecedor,
        data: new Date(this.produto.data['seconds'] * 1000),
        cor: this.produto.cor,
        tipo: this.produto.tipo,
        tamanho: this.produto.tamanho,
        quantidade: this.produto.quantidade,
        valor: this.produto.valor,
        // custo: this.produto.custo,
        preco: this.produto.preco
        // lucrobruto: this.produto.lucrobruto
      });
    }
  }

  nextData(e) {
    const index = this.produtos.findIndex(a => a.codigo == e);
    if (index != -1 && index != this.produtos.length - 1) {
      this.produto = { ...this.produtos[index + 1] };
      this.myControl.setValue(this.produto.codigo);

      this.form.controls.fornec.setValue({
        codigo: this.produto.codigo,
        descricao: this.produto.descricao,
        fornecedor: this.produto.fornecedor,
        // codigofornecedor: this.produto.codigofornecedor,
        data: new Date(this.produto.data['seconds'] * 1000),
        cor: this.produto.cor,
        tipo: this.produto.tipo,
        tamanho: this.produto.tamanho,
        quantidade: this.produto.quantidade,
        valor: this.produto.valor,
        // custo: this.produto.custo,
        preco: this.produto.preco
        // lucrobruto: this.produto.lucrobruto
      });
    }
  }

  previousData(e) {
    const index = this.produtos.findIndex(a => a.codigo == e);
    if (index != -1 && index > 0) {
      this.produto = { ...this.produtos[index - 1] };

      this.myControl.setValue(this.produto.codigo);

      this.form.controls.fornec.setValue({
        codigo: this.produto.codigo,
        descricao: this.produto.descricao,
        fornecedor: this.produto.fornecedor,
        // codigofornecedor: this.produto.codigofornecedor,
        data: new Date(this.produto.data['seconds'] * 1000),
        cor: this.produto.cor,
        tipo: this.produto.tipo,
        tamanho: this.produto.tamanho,
        quantidade: this.produto.quantidade,
        valor: this.produto.valor,
        // custo: this.produto.custo,
        preco: this.produto.preco
        // lucrobruto: this.produto.lucrobruto
      });
    }
  }
}
