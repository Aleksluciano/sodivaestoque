import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FornecedoresComponent } from './components/fornecedores/containers/fornecedores-lista/fornecedores.component';
import { AddFornecedorComponent } from './components/fornecedores/containers/add-fornecedor/add-fornecedor.component';
import { EditFornecedorComponent } from './components/fornecedores/containers/edit-fornecedor/edit-fornecedor.component';
import { AddClienteComponent } from './components/clientes/containers/add-cliente/add-cliente.component';
import { EditClienteComponent } from './components/clientes/containers/edit-cliente/edit-cliente.component';
import { ClientesComponent } from './components/clientes/containers/clientes-lista/clientes.component';
import { ProdutosComponent } from './components/produtos/containers/produtos-lista/produtos.component';
import { AddProdutoComponent } from './components/produtos/containers/add-produto/add-produto.component';
import { EditProdutoComponent } from './components/produtos/containers/edit-produto/edit-produto.component';

const routes: Routes = [
  {path: "", component: FornecedoresComponent},
  {path: "add", component: AddFornecedorComponent},
  {path: "edit/:id", component: EditFornecedorComponent},
  {path: "clientes", component: ClientesComponent},
  {path: "clientes/add", component: AddClienteComponent},
  {path: "clientes/edit/:id", component: EditClienteComponent},
  {path: "produtos", component: ProdutosComponent},
  {path: "produtos/add", component: AddProdutoComponent},
  {path: "produtos/edit/:id", component: EditProdutoComponent}
  // {  path: "", loadChildren: "./components/fornecedores/forcedores.module#FornecedoresModule"},
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
