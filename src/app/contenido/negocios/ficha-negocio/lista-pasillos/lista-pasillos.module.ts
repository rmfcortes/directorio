import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPasillosPage } from './lista-pasillos.page';
import { CartComponentModule } from 'src/app/shared/cart/cart.module';
import { FichaProductoPageModule } from '../ficha-producto/ficha-producto.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartComponentModule,
    FichaProductoPageModule
  ],
  declarations: [ListaPasillosPage],
  entryComponents: [ListaPasillosPage]
})
export class ListaPasillosPageModule {}
