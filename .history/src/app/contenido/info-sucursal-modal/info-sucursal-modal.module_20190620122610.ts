import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoSucursalModalPage } from './info-sucursal-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [InfoSucursalModalPage],
  entryComponents: [InfoSucursalModalPage]
})
export class InfoSucursalModalPageModule {}
