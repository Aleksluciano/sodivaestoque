import { Component, OnInit, ViewChild } from '@angular/core';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { Fornecedor } from 'src/app/models/fornecedor.model';

import {
  MatTableDataSource,
  MatDialogConfig,
  MatDialog
} from '@angular/material';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fornecedores',
  template: `
    <br />

    <app-fornecedores-lista
      [fornecedores]="dataSource"
      [displayedColumns]="displayedColumns"
      (delete)="onDeleteClick($event)"
      (filter)="applyFilter($event)"
      (newItem)="newItem()"
      (edit)="onEditClick($event)"
    >
    </app-fornecedores-lista>
  `
})
export class FornecedoresComponent implements OnInit {
  displayedColumns: string[] = [
    'Indice',
    'Nome',
    'Endereço',
    'Bairro',
    'Cidade',
    'Estado',
    'Contato',
    'Telefone',
    'Celular',
    'Email',
    'Cnpj',
    'Ações'
  ];
  fornecedores: Fornecedor[] = [];
  dataSource: MatTableDataSource<Fornecedor>;

  popupOpen = false;

  constructor(
    private fornecedoresService: FornecedorService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.fornecedoresService.getFornecedores().subscribe(fornecedores => {
      this.fornecedores = fornecedores;
      this.dataSource = new MatTableDataSource(this.fornecedores);
    });
  }

  onDeleteClick(event: Fornecedor) {
    this.popupOpen = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      message: `Deseja realmente remover o fornecedor`,
      item: `${event.nome}`
    };
    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .subscribe(result => {
        this.popupOpen = false;
        if (result) { this.fornecedoresService.deleteFornecedor(event.id); }
      });
  }

  onEditClick(event: Fornecedor) {
    this.router.navigate([`/edit/${event.id}`]);
  }

  applyFilter(filterValue: string) {
    if (filterValue) { this.dataSource.filter = filterValue.trim().toLowerCase(); }
  }

  newItem() {
    if (!this.popupOpen) {
    this.router.navigate(['/add']);
    }
  }
}
