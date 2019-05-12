import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProdutoService } from 'src/app/services/produto.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { InfoModalComponent } from 'src/app/components/shared/info-modal.component.ts/info-modal.component';
import { Fornecedor } from 'src/app/models/fornecedor.model';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-produto',
  template: `
    <br />
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <app-produto-form
        [parent]="form"
        (back)="onBackClicked()"
        [optionsFornecedor]="arrayFornecedor"
      >
      </app-produto-form>
    </form>
  `
})
export class AddProdutoComponent implements OnInit {
  day = new Date();
  fornecedores: Fornecedor[] = [];
  arrayFornecedor: string[] = [];


  form = this.fb.group({
    fornec: this.fb.group({
      codigo: ['SD00000', Validators.required],
      descricao: ['', Validators.required],
      fornecedor: ['', Validators.required],
      // codigofornecedor: "",
      data: [
        new Date(this.day),
        Validators.required
      ],
      cor: ['', Validators.required],
      tipo: ['', Validators.required],
      tamanho: ['', Validators.required],
      quantidade: [1, Validators.required],
      valor: ['', Validators.required],
      // custo: [{value: '', disabled: true},Validators.required],
      preco: ['', Validators.required]
      // lucrobruto: ''
    })
  });

  constructor(
    private produtosService: ProdutoService,
    private fornecedoresService: FornecedorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.lastCode != '') {
      const partNumber = Number(String(params.lastCode).substring(2)) + 1;
      const s = '00000' + String(partNumber);
      const num = s.substr(s.length - 5);
      const partString = String(params.lastCode).substring(0, 2);
      const newCode = partString + num;

      this.form.controls.fornec.patchValue({
        codigo: newCode
      });
    }
    });

    this.fornecedoresService.getFornecedores().subscribe(fornecedores => {
      this.fornecedores = fornecedores;
      this.fornecedores.map(a => {
        this.arrayFornecedor.push(a.nome);
      });
    });
  }

  onSubmit() {
    if (this.form.valid) {

      this.produtosService
        .getProdutoByCodigo(this.form.value.fornec.codigo)
        .get()
        .subscribe(document => {
          if (document.size > 0) {
            this.produtosService.flashMessageToExist(
              this.form.value.fornec.codigo
            );
          } else {

            this.produtosService
              .newProduto(this.form.value.fornec)
              .then(a => {
                this.produtosService.flashMessageToNew(
                  this.form.value.fornec.codigo
                );
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
  }

  onBackClicked() {
    this.location.back();
  }
}
