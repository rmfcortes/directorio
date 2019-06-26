import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { CartComponent } from './cart.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [CartComponent],
  entryComponents: [CartComponent]
})
export class CartComponentModule {}
