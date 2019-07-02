import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CartComponent } from './cart.component';
import { FormsModule } from '@angular/forms';
import { HorarioModalPageModule } from 'src/app/contenido/horario-modal/horario-modal.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HorarioModalPageModule,
    IonicModule,
  ],
  declarations: [CartComponent],
  exports: [CartComponent]
})
export class CartComponentModule {}
