import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContenidoPage } from './contenido.page';
import { ContenidoRoutingModule } from './contenido.routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContenidoRoutingModule
  ],
  declarations: [ContenidoPage]
})
export class ContenidoPageModule {}
