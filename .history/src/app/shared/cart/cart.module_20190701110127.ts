import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CartComponent } from './cart.component';
import { FormsModule } from '@angular/forms';
import { InfoSucursalModalPageModule } from 'src/app/contenido/info-sucursal-modal/info-sucursal-modal.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InfoSucursalModalPageModule,
    IonicModule,
  ],
  declarations: [CartComponent],
  exports: [CartComponent]
})
export class CartComponentModule {}
