import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPasillosPage } from './lista-pasillos.page';
import { CartComponentModule } from 'src/app/shared/cart/cart.module';
import { LoginPageModule } from '../login/login.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageModule,
    CartComponentModule
  ],
  declarations: [ListaPasillosPage],
  entryComponents: [ListaPasillosPage]
})
export class ListaPasillosPageModule {}
