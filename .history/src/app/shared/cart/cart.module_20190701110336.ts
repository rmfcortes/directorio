import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CartComponent } from './cart.component';
import { FormsModule } from '@angular/forms';
import { HorarioModalPage } from 'src/app/contenido/horario-modal/horario-modal.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HorarioModalPage,
    IonicModule,
  ],
  declarations: [CartComponent],
  exports: [CartComponent]
})
export class CartComponentModule {}
