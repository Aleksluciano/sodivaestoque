import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FornecedoresComponent } from './components/fornecedores/containers/fornecedores-lista/fornecedores.component';
import { AddFornecedorComponent } from './components/fornecedores/containers/add-fornecedor/add-fornecedor.component';
import { EditFornecedorComponent } from './components/fornecedores/containers/edit-fornecedor/edit-fornecedor.component';
import { AddClienteComponent } from './components/clientes/containers/add-cliente/add-cliente.component';
import { EditClienteComponent } from './components/clientes/containers/edit-cliente/edit-cliente.component';
import { ClientesComponent } from './components/clientes/containers/clientes-lista/clientes.component';

const routes: Routes = [
  {path: "", component: FornecedoresComponent},
  {path: "add", component: AddFornecedorComponent},
  {path: "edit/:id", component: EditFornecedorComponent},
  {path: "clientes", component: ClientesComponent},
  {path: "clientes/add", component: AddClienteComponent},
  {path: "clientes/edit/:id", component: EditClienteComponent}
  // {  path: "", loadChildren: "./components/fornecedores/forcedores.module#FornecedoresModule"},
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
