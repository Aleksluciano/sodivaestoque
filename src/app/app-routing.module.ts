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
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "fornecedores", component: FornecedoresComponent, canActivate:[AuthGuard]},
  {path: "add", component: AddFornecedorComponent, canActivate:[AuthGuard]},
  {path: "edit/:id", component: EditFornecedorComponent, canActivate:[AuthGuard]},
  {path: "clientes", component: ClientesComponent, canActivate:[AuthGuard]},
  {path: "clientes/add", component: AddClienteComponent, canActivate:[AuthGuard]},
  {path: "clientes/edit/:id", component: EditClienteComponent, canActivate:[AuthGuard]},
  {path: "produtos", component: ProdutosComponent, canActivate:[AuthGuard]},
  {path: "produtos/add", component: AddProdutoComponent, canActivate:[AuthGuard]},
  {path: "produtos/edit/:id", component: EditProdutoComponent, canActivate:[AuthGuard]}
  // {  path: "", loadChildren: "./components/fornecedores/forcedores.module#FornecedoresModule"},
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
