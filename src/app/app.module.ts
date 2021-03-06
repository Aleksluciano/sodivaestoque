import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrintComponent } from './components/vendas/print.component';
import { HeaderComponent } from './components/navigation/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { FornecedoresListaComponent } from './components/fornecedores/components/fornecedores-lista/fornecedores-lista.component';
import { FornecedoresComponent } from './components/fornecedores/containers/fornecedores-lista/fornecedores.component';
import { ConfirmModalComponent } from './components/shared/confirm-modal/confirm-modal.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

// tslint:disable-next-line: max-line-length
import {MatTableModule, MatSidenavModule, MatListModule, MatTabsModule, MatBadgeModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatMenuModule, MatSortModule, MatDialogModule, MatAutocompleteModule, MatSelectModule, MatToolbarModule, MatChipsModule, MatButtonToggleGroup, MatButtonToggleModule, MatRadioModule, MatDatepickerModule, MAT_DATE_LOCALE, MatNativeDateModule, MatPaginatorModule, MatTooltipModule, MatCheckboxModule} from '@angular/material';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { FornecedorFormComponent } from './components/fornecedores/components/fornecedor-form/fornecedor-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddFornecedorComponent } from './components/fornecedores/containers/add-fornecedor/add-fornecedor.component';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { NgxViacepModule } from '@brunoc/ngx-viacep';
import { NgxMaskModule } from 'ngx-mask';
import { AmazingTimePickerModule } from 'amazing-time-picker';
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
import { NgxCurrencyModule } from 'ngx-currency';
import {DatePipe, registerLocaleData} from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavListComponent } from './components/navigation/sidenav-list/sidenav-list.component';
import { VendaFormComponent } from './components/vendas/venda-form/venda-form.component';
import { SenhaComponent } from './components/senha/senha.component';
import { VendasListaComponent } from './components/vendas/vendas-lista/vendas-lista.component';
import { VendaFormEditComponent } from './components/vendas/venda-form-edit/venda-form-edit.component';
import { FaturamentoComponent } from './components/faturamento/faturamento.component';
import { DespesasComponent } from './components/despesas/despesas.component';
import { BalancoComponent } from './components/balanco/balanco.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { EstatisticasComponent } from './components/estatisticas/estatisticas.component';
import { CartoesComponent } from './components/cartoes/cartoes.component';
import { CaixaComponent } from './components/caixa/caixa.component';
import { CreateAgendaComponent } from './components/agenda/create-agenda/create-agenda.component';


export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  nullable: false
};

registerLocaleData(ptBr);
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
    SidenavListComponent,
    HeaderComponent,

    ////////
    ConfirmModalComponent,
    InfoModalComponent,
    VendaFormComponent,
    VendasListaComponent,
    SenhaComponent,
    VendaFormEditComponent,
    PrintComponent,
    FaturamentoComponent,
    DespesasComponent,
    BalancoComponent,
    AgendaComponent,
    EstatisticasComponent,
    CartoesComponent,
    CaixaComponent,
    CreateAgendaComponent,
    CreateAgendaComponent,
    //////////

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
    MatToolbarModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatCheckboxModule,
    NgbModule,

   ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),


    ///////
    NgFlashMessagesModule.forRoot(),
    NgxViacepModule,
    NgxMaskModule.forRoot(),
    ////////
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)


  ],
  providers: [MatDatepickerModule, DatePipe, { provide: LOCALE_ID, useValue: 'pt' }],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmModalComponent, InfoModalComponent, PrintComponent, CreateAgendaComponent]
})
export class AppModule {

}
