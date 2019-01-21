import { FornecedoresListaComponent } from './components/fornecedores/components/fornecedores-lista/fornecedores-lista.component';
import { FornecedoresComponent } from './components/fornecedores/containers/fornecedores/fornecedores.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import {MatTableModule, MatSidenavModule, MatListModule, MatTabsModule, MatBadgeModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatMenuModule} from "@angular/material";
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { FornecedorFormComponent } from './components/fornecedores/components/fornecedor-form/fornecedor-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    //////////////
    FornecedoresComponent,
    FornecedoresListaComponent,
    FornecedorFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ///////
    AngularFireModule.initializeApp(environment.firebase, 'sodivaestoque'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    //////////
    BrowserAnimationsModule,
    MatTableModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
