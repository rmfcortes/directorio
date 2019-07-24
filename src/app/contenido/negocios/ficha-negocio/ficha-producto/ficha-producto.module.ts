import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichaProductoPage } from './ficha-producto.page';
import { CartComponentModule } from 'src/app/shared/cart/cart.module';
import { LoginPageModule } from 'src/app/contenido/login/login.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartComponentModule,
    LoginPageModule
  ],
  declarations: [FichaProductoPage],
  entryComponents: [FichaProductoPage]
})
export class FichaProductoPageModule {}
