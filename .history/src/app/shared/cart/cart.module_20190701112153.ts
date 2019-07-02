import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CartComponent } from './cart.component';
import { FormsModule } from '@angular/forms';
import { CartModalModule } from 'src/app/contenido/cart-modal/cart-modal.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CartModalModule,
    IonicModule,
  ],
  declarations: [CartComponent],
  exports: [CartComponent]
})
export class CartComponentModule {}
