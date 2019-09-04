import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaEmpleosPage } from './lista-empleos.page';
import { LoginPageModule } from '../../login/login.module';
import { EmpleosFormPageModule } from '../empleos-form/empleos-form.module';
import { FichaEmpleoPageModule } from './ficha-empleo/ficha-empleo.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageModule,
    EmpleosFormPageModule,
    FichaEmpleoPageModule
  ],
  declarations: [ListaEmpleosPage],
  entryComponents: [ListaEmpleosPage]
})
export class ListaEmpleosPageModule {}
