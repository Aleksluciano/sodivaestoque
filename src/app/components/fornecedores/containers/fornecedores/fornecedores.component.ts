import { Component, OnInit } from '@angular/core';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { Fornecedor } from 'src/app/models/fornecedor.model';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.css']
})
export class FornecedoresComponent implements OnInit {

  displayedColumns: string[] = ['Indice','Nome', 'Endereço', 'Bairro', 'Cidade', 'Estado', 'Contato', 'Telefone', 'Celular','Email', 'Cnpj', 'Ações'];
  fornecedores: Fornecedor[];
  dataSource: MatTableDataSource<Fornecedor>;

  form = this.fb.group({
    fornec: this.fb.group({
    nome: '',
    cep: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    contato: '',
    telefone: '',
    celular: '',
    email: '',
    cnpj: '',
  })
})

    constructor(
      private fornecedoresService: FornecedorService,
      private fb: FormBuilder) { }

    ngOnInit() {
      this.fornecedoresService.getFornecedores().subscribe( fornecedores => {
        this.fornecedores = fornecedores;
        this.dataSource = new MatTableDataSource(this.fornecedores);
    })
  }


  onSubmit() {



    if(this.form.valid)
    this.fornecedoresService.newFornecedor(this.form.value.fornec);
  }

  onDeleteClick(event: Fornecedor){
    console.log(event)
      this.fornecedoresService.deleteFornecedor(event);
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }


}
