import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { InfoModalComponent } from 'src/app/components/shared/info-modal.component.ts/info-modal.component';

@Component({
  selector: 'app-add-fornecedor',
  template: `
    <br />
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <app-fornecedor-form
        [parent]="form"
        (cep)="findAdress($event)"
        (back)="onBackClicked()"
      >
      </app-fornecedor-form>
    </form>
  `
})
export class AddFornecedorComponent implements OnInit {
  form = this.fb.group({
    fornec: this.fb.group({
      nome: ['', Validators.required],
      cep: '',
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      contato: ['', Validators.required],
      telefone: '',
      celular: '',
      email: '',
      cnpj: ''
    })
  });

  constructor(
    private fornecedoresService: FornecedorService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      this.fornecedoresService
        .newFornecedor(this.form.value.fornec)
        .then(a => {
          this.fornecedoresService.flashMessageToNew(
            this.form.value.fornec.nome
          );
          this.form.reset();
          this.router.navigate(['fornecedores']);
        })
        .catch(error => {
          this.dialog.open(InfoModalComponent, {
            data: { title: 'Erro', message: error.message }
          });
        });
    }
  }

  findAdress(event: string) {
    this.fornecedoresService
      .searchCep(event)
      .then(endereco => {
        this.form.controls.fornec.patchValue({
          cep: endereco.cep,
          estado: endereco.uf,
          cidade: endereco.localidade,
          bairro: endereco.bairro,
          endereco: endereco.logradouro
        });
      })
      .catch(error => {
        this.dialog.open(InfoModalComponent, {
          data: { title: 'Erro', message: error.message }
        });
      });
  }

  onBackClicked() {
    this.location.back();
  }
}
