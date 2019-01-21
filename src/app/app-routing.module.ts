import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FornecedoresComponent } from './components/fornecedores/containers/fornecedores/fornecedores.component';

const routes: Routes = [
  {path: "", component: FornecedoresComponent},
  // {  path: "", loadChildren: "./components/fornecedores/forcedores.module#FornecedoresModule"},
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
