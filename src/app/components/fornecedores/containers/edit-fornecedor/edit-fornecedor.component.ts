import { Fornecedor } from "./../../../../models/fornecedor.model";

import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { FornecedorService } from "src/app/services/fornecedor.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { InfoModalComponent } from "src/app/components/shared/info-modal.component.ts/info-modal.component";
import { ConfirmModalComponent } from "src/app/components/shared/confirm-modal/confirm-modal.component";

@Component({
  selector: "app-add-fornecedor",
  template: `
    <br />
    <form [formGroup]="form" (ngSubmit)="onSubmit($event)">
      <app-fornecedor-form-edit
        [parent]="form"
        [arrayFornecedores]="arrayDataSource"
        [fornecedores]="fornecedores"
        [myControl]="myControl"
        (find)="findData($event)"
        (next)="nextData($event)"
        (previous)="previousData($event)"
        (cep)="findAdress($event)"
        (back)="onBackClicked()"
        (delete)="deleteFornecedor()"
      >
      </app-fornecedor-form-edit>
    </form>
  `
})
export class EditFornecedorComponent implements OnInit {
  fornecedor: Fornecedor;
  fornecedores: Fornecedor[] = [];
  arrayDataSource = [];
  myControl = new FormControl();

  id: string;

  form = this.fb.group({
    fornec: this.fb.group({
      nome: ["", Validators.required],
      cep: "",
      endereco: ["", Validators.required],
      bairro: ["", Validators.required],
      cidade: ["", Validators.required],
      estado: ["", Validators.required],
      contato: ["", Validators.required],
      telefone: "",
      celular: "",
      email: "",
      cnpj: ""
    })
  });

  constructor(
    private fornecedoresService: FornecedorService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fornecedoresService.getFornecedores().subscribe(fornecedores => {
      this.fornecedores = fornecedores.map(a => ({ ...a }));
      this.arrayDataSource = [];
      this.fornecedores.map(a => {
        this.arrayDataSource.push(a.nome);
      });
    });

    // Get id from url
    this.id = this.route.snapshot.params["id"];

    // Get fornecedor
    this.fornecedoresService.getFornecedor(this.id).subscribe(fornecedor => {
      this.fornecedor = fornecedor;
      this.myControl.setValue(this.fornecedor.nome);
      if (this.fornecedor) {
        this.form.controls.fornec.setValue({
          nome: this.fornecedor.nome,
          cep: this.fornecedor.cep,
          endereco: this.fornecedor.endereco,
          bairro: this.fornecedor.bairro,
          cidade: this.fornecedor.cidade,
          estado: this.fornecedor.estado,
          contato: this.fornecedor.contato,
          telefone: this.fornecedor.telefone,
          celular: this.fornecedor.celular,
          email: this.fornecedor.email,
          cnpj: this.fornecedor.cnpj
        });

        this.form.controls.fornec.disable();
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      let id = this.fornecedor.id;
      this.fornecedor = this.form.value.fornec;
      this.fornecedor.id = id;

      this.fornecedoresService
        .updateFornecedor(this.fornecedor)
        .then(a => {
          this.fornecedoresService.flashMessageToUpdate(this.fornecedor.nome);
          this.form.disable();

          this.fornecedoresService.getFornecedores().subscribe(fornecedores => {
            this.fornecedores = fornecedores.map(a => ({ ...a }));
            this.arrayDataSource = [];
            this.fornecedores.map(a => {
              this.arrayDataSource.push(a.nome);
            });
          });

          this.myControl.setValue(this.fornecedor.nome);
        })
        .catch(error => {
          this.dialog.open(InfoModalComponent, {
            data: { title: "Erro", message: error.message }
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
          data: { title: "Erro", message: error.message }
        });
      });
  }

  onBackClicked() {
    this.location.back();
  }

  deleteFornecedor() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    let fornecedor = { ...this.fornecedor };
    dialogConfig.data = {
      message: `Deseja realmente remover o fornecedor`,
      item: `${this.fornecedor.nome}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.fornecedoresService
            .deleteFornecedor(this.fornecedor.id)
            .then(a => {
              this.fornecedoresService.flashMessageToDelete(fornecedor.nome);
              this.form.reset();
              this.router.navigate([""]);
            })
            .catch(error => {
              this.dialog.open(InfoModalComponent, {
                data: { title: "Erro", message: error.message }
              });
            });
        }
      });
  }

  findData(e) {
    this.fornecedor = this.fornecedores.find(a => a.nome == e);
    if (this.fornecedor) {

      this.myControl.setValue(this.fornecedor.nome);

      this.form.controls.fornec.setValue({
        nome: this.fornecedor.nome,
        cep: this.fornecedor.cep,
        endereco: this.fornecedor.endereco,
        bairro: this.fornecedor.bairro,
        cidade: this.fornecedor.cidade,
        estado: this.fornecedor.estado,
        contato: this.fornecedor.contato,
        telefone: this.fornecedor.telefone,
        celular: this.fornecedor.celular,
        email: this.fornecedor.email,
        cnpj: this.fornecedor.cnpj
      });
    }
  }

  nextData(e) {
    console.log(e);

    let index = this.fornecedores.findIndex(a => a.nome == e);
    if (index != -1 && index != this.fornecedores.length - 1) {

      this.fornecedor = { ...this.fornecedores[index + 1] };
      this.myControl.setValue(this.fornecedor.nome);

      this.form.controls.fornec.setValue({
        nome: this.fornecedor.nome,
        cep: this.fornecedor.cep,
        endereco: this.fornecedor.endereco,
        bairro: this.fornecedor.bairro,
        cidade: this.fornecedor.cidade,
        estado: this.fornecedor.estado,
        contato: this.fornecedor.contato,
        telefone: this.fornecedor.telefone,
        celular: this.fornecedor.celular,
        email: this.fornecedor.email,
        cnpj: this.fornecedor.cnpj
      });
    }
  }

  previousData(e) {

    let index = this.fornecedores.findIndex(a => a.nome == e);
    if (index != -1 && index > 0) {
      this.fornecedor = { ...this.fornecedores[index - 1] };

      this.myControl.setValue(this.fornecedor.nome);

      this.form.controls.fornec.setValue({
        nome: this.fornecedor.nome,
        cep: this.fornecedor.cep,
        endereco: this.fornecedor.endereco,
        bairro: this.fornecedor.bairro,
        cidade: this.fornecedor.cidade,
        estado: this.fornecedor.estado,
        contato: this.fornecedor.contato,
        telefone: this.fornecedor.telefone,
        celular: this.fornecedor.celular,
        email: this.fornecedor.email,
        cnpj: this.fornecedor.cnpj
      });
    }
  }
}
