import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';

import { InfoSucursalModalPage } from './info-sucursal-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2bkQuBBHIVNcwmzQRFG6sIdx4WNWGL_0'
    }),
  ],
  declarations: [InfoSucursalModalPage],
  entryComponents: [InfoSucursalModalPage]
})
export class InfoSucursalModalPageModule {}
