import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichaProductoPage } from './ficha-producto.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [FichaProductoPage],
  entryComponents: [FichaProductoPage]
})
export class FichaProductoPageModule {}
