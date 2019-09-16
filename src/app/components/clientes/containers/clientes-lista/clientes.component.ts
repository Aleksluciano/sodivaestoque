import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';

import {
  MatTableDataSource,
  MatDialogConfig,
  MatDialog
} from '@angular/material';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  template: `
    <br />

    <app-clientes-lista
      [clientes]="dataSource"
      [displayedColumns]="displayedColumns"
      (delete)="onDeleteClick($event)"
      (filter)="applyFilter($event)"
      (newItem)="newItem()"
      (edit)="onEditClick($event)"
    >
    </app-clientes-lista>
  `
})
export class ClientesComponent implements OnInit {
  displayedColumns: string[] = [
    'Indice',
    'Nome',
    'Obs',
    'Endereço',
    'Bairro',
    'Cidade',
    'Estado',
    //'Telefone',
    'Celular',
    //'Email',
    // "Cpf",
    // "Rg",
    'Ações'
  ];
  clientes: Cliente[] = [];
  dataSource: MatTableDataSource<Cliente>;
  popupOpen = false;

  constructor(
    private fornecedoresService: ClienteService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.fornecedoresService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      this.dataSource = new MatTableDataSource(this.clientes);
    });
  }

  onDeleteClick(event: Cliente) {
    this.popupOpen = true;
    const   dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      message: `Deseja realmente remover o cliente`,
      item: `${event.nome}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        this.popupOpen = false;
        if (result) { this.fornecedoresService.deleteCliente(event.id); }
      });
  }

  onEditClick(event: Cliente) {
    this.router.navigate([`clientes/edit/${event.id}`]);
  }

  applyFilter(filterValue: string) {
    if (filterValue) { this.dataSource.filter = filterValue.trim().toLowerCase(); }
  }

  newItem() {

    if (!this.popupOpen) {
    this.router.navigate(['clientes/add']);
    }
  }
}
