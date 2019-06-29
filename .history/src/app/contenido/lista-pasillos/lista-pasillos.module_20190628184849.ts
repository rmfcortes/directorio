import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPasillosPage } from './lista-pasillos.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [ListaPasillosPage],
  entryComponents: [ListaPasillosPage]
})
export class ListaPasillosPageModule {}
