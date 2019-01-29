import { LoginComponent } from './components/login/login.component';
import { FornecedoresListaComponent } from './components/fornecedores/components/fornecedores-lista/fornecedores-lista.component';
import { FornecedoresComponent } from './components/fornecedores/containers/fornecedores-lista/fornecedores.component';
import { ConfirmModalComponent } from './components/shared/confirm-modal/confirm-modal.component'

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import {MatTableModule, MatSidenavModule, MatListModule, MatTabsModule, MatBadgeModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatMenuModule, MatSortModule, MatDialogModule, MatAutocompleteModule, MatSelectModule} from "@angular/material";
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { FornecedorFormComponent } from './components/fornecedores/components/fornecedor-form/fornecedor-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddFornecedorComponent } from './components/fornecedores/containers/add-fornecedor/add-fornecedor.component';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { NgxViacepModule } from '@brunoc/ngx-viacep';
import { NgxMaskModule } from 'ngx-mask';
import { InfoModalComponent } from './components/shared/info-modal.component.ts/info-modal.component';
import { FornecedorFormEditComponent } from './components/fornecedores/components/fornecedor-form-edit/fornecedor-form-edit.component';
import { EditFornecedorComponent } from './components/fornecedores/containers/edit-fornecedor/edit-fornecedor.component';
import { ClientesComponent } from './components/clientes/containers/clientes-lista/clientes.component';
import { ClientesListaComponent } from './components/clientes/components/clientes-form-lista/clientes-lista.component';
import { ClienteFormComponent } from './components/clientes/components/cliente-form/cliente-form.component';
import { ClienteFormEditComponent } from './components/clientes/components/cliente-form-edit/cliente-form-edit.component';
import { AddClienteComponent } from './components/clientes/containers/add-cliente/add-cliente.component';
import { EditClienteComponent } from './components/clientes/containers/edit-cliente/edit-cliente.component';
import { ProdutosComponent } from './components/produtos/containers/produtos-lista/produtos.component';
import { ProdutosListaComponent } from './components/produtos/components/produtos-lista/produtos-lista.component';
import { ProdutoFormComponent } from './components/produtos/components/produto-form/produto-form.component';
import { ProdutoFormEditComponent } from './components/produtos/components/produto-form-edit/produto-form-edit.component';
import { AddProdutoComponent } from './components/produtos/containers/add-produto/add-produto.component';
import { EditProdutoComponent } from './components/produtos/containers/edit-produto/edit-produto.component';
import { NgxCurrencyModule } from "ngx-currency";
import {DatePipe, registerLocaleData} from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { FlexLayoutModule } from '@angular/flex-layout';

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: false
};

registerLocaleData(ptBr)
@NgModule({
  declarations: [
    AppComponent,
    //////////////
    FornecedoresComponent,
    FornecedoresListaComponent,
    FornecedorFormComponent,
    FornecedorFormEditComponent,
    AddFornecedorComponent,
    EditFornecedorComponent,
    ///////////////
    ClientesComponent,
    ClientesListaComponent,
    ClienteFormComponent,
    ClienteFormEditComponent,
    AddClienteComponent,
    EditClienteComponent,
    /////////
    ProdutosComponent,
    ProdutosListaComponent,
    ProdutoFormComponent,
    ProdutoFormEditComponent,
    AddProdutoComponent,
    EditProdutoComponent,
    LoginComponent,
    ////////
    ConfirmModalComponent,
    InfoModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ///////
    AngularFireModule.initializeApp(environment.firebase, 'sodivaestoque'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    //////////
    BrowserAnimationsModule,
    MatTableModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSelectModule,
   ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),


    ///////
    NgFlashMessagesModule.forRoot(),
    NgxViacepModule,
    NgxMaskModule.forRoot(),
    ////////
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)


  ],
  providers: [DatePipe,{ provide: LOCALE_ID, useValue: 'pt' }],
  bootstrap: [AppComponent],
  entryComponents:[ConfirmModalComponent, InfoModalComponent]
})
export class AppModule {

}
