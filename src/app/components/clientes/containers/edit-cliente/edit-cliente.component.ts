import { Cliente } from "./../../../../models/cliente.model";

import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { ClienteService } from "src/app/services/cliente.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { InfoModalComponent } from "src/app/components/shared/info-modal.component.ts/info-modal.component";
import { ConfirmModalComponent } from "src/app/components/shared/confirm-modal/confirm-modal.component";

@Component({
  selector: "app-add-cliente",
  template: `
    <br />
    <form [formGroup]="form" (ngSubmit)="onSubmit($event)">
      <app-cliente-form-edit
        [parent]="form"
        [arrayClientes]="arrayDataSource"
        [clientes]="clientes"
        [myControl]="myControl"
        (find)="findData($event)"
        (next)="nextData($event)"
        (previous)="previousData($event)"
        (cep)="findAdress($event)"
        (back)="onBackClicked()"
        (delete)="deleteCliente()"
      >
      </app-cliente-form-edit>
    </form>
  `
})
export class EditClienteComponent implements OnInit {
  cliente: Cliente;
  clientes: Cliente[] = [];
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
      telefone: "",
      celular: "",
      email: "",
      cpf: "",
      rg: "",
    })
  });

  constructor(
    private clientesService: ClienteService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.clientesService.getClientes().subscribe(clientes => {
      this.clientes = clientes.map(a => ({ ...a }));
      this.arrayDataSource = [];
      this.clientes.map(a => {
        this.arrayDataSource.push(a.nome);
      });
    });

    // Get id from url
    this.id = this.route.snapshot.params["id"];

    // Get cliente
    this.clientesService.getCliente(this.id).subscribe(cliente => {
      this.cliente = cliente;
      this.myControl.setValue(this.cliente.nome);
      if (this.cliente) {
        this.form.controls.fornec.setValue({
          nome: this.cliente.nome,
          cep: this.cliente.cep,
          endereco: this.cliente.endereco,
          bairro: this.cliente.bairro,
          cidade: this.cliente.cidade,
          estado: this.cliente.estado,
          telefone: this.cliente.telefone,
          celular: this.cliente.celular,
          email: this.cliente.email,
          cpf: this.cliente.cpf,
          rg: this.cliente.rg,
        });

        this.form.controls.fornec.disable();
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      let id = this.cliente.id;
      this.cliente = this.form.value.fornec;
      this.cliente.id = id;

      this.clientesService
        .updateCliente(this.cliente)
        .then(a => {
          this.clientesService.flashMessageToUpdate(this.cliente.nome);
          this.form.disable();

          this.clientesService.getClientes().subscribe(clientes => {
            this.clientes = clientes.map(a => ({ ...a }));
            this.arrayDataSource = [];
            this.clientes.map(a => {
              this.arrayDataSource.push(a.nome);
            });
          });

          this.myControl.setValue(this.cliente.nome);
        })
        .catch(error => {
          this.dialog.open(InfoModalComponent, {
            data: { title: "Erro", message: error.message }
          });
        });
    }
  }

  findAdress(event: string) {
    this.clientesService
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

  deleteCliente() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    let cliente = { ...this.cliente };
    dialogConfig.data = {
      message: `Deseja realmente remover o cliente`,
      item: `${this.cliente.nome}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.clientesService
            .deleteCliente(this.cliente.id)
            .then(a => {
              this.clientesService.flashMessageToDelete(cliente.nome);
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
    this.cliente = this.clientes.find(a => a.nome == e);
    if (this.cliente) {
      this.myControl.setValue(this.cliente.nome);
      this.form.controls.fornec.setValue({
        nome: this.cliente.nome,
        cep: this.cliente.cep,
        endereco: this.cliente.endereco,
        bairro: this.cliente.bairro,
        cidade: this.cliente.cidade,
        estado: this.cliente.estado,
        telefone: this.cliente.telefone,
        celular: this.cliente.celular,
        email: this.cliente.email,
        cpf: this.cliente.cpf,
        rg: this.cliente.rg
      });
    }
  }

  nextData(e) {
    console.log(e);

    let index = this.clientes.findIndex(a => a.nome == e);
    if (index != -1 && index != this.clientes.length - 1) {
      this.cliente = { ...this.clientes[index + 1] };
      this.myControl.setValue(this.cliente.nome);
      this.form.controls.fornec.setValue({
        nome: this.cliente.nome,
        cep: this.cliente.cep,
        endereco: this.cliente.endereco,
        bairro: this.cliente.bairro,
        cidade: this.cliente.cidade,
        estado: this.cliente.estado,
        telefone: this.cliente.telefone,
        celular: this.cliente.celular,
        email: this.cliente.email,
        cpf: this.cliente.cpf,
        rg: this.cliente.rg
      });
    }
  }

  previousData(e) {
    console.log(e);
    let index = this.clientes.findIndex(a => a.nome == e);
    if (index != -1 && index > 0) {
      this.cliente = { ...this.clientes[index - 1] };
      this.myControl.setValue(this.cliente.nome);
      this.form.controls.fornec.setValue({
        nome: this.cliente.nome,
        cep: this.cliente.cep,
        endereco: this.cliente.endereco,
        bairro: this.cliente.bairro,
        cidade: this.cliente.cidade,
        estado: this.cliente.estado,
        telefone: this.cliente.telefone,
        celular: this.cliente.celular,
        email: this.cliente.email,
        cpf: this.cliente.cpf,
        rg: this.cliente.rg
      });
    }
  }
}
