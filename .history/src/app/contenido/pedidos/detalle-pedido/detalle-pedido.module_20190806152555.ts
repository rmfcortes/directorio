import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartModalComponent } from './cart-modal.component';
import { MapaPageModule } from '../mapa/mapa.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaPageModule
  ],
  declarations: [CartModalComponent],
  entryComponents: [CartModalComponent]
})
export class CartModalModule {}
