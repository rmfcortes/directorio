import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AgmCoreModule } from '@agm/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';


import { NegocioFormPage } from './negocio-form.page';
import { HorarioModalPageModule } from '../horario-modal/horario-modal.module';
import { CropModalPageModule } from '../crop-modal/crop-modal.module';


const routes: Routes = [
  {
    path: '',
    component: NegocioFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CropModalPageModule,
    HorarioModalPageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2bkQuBBHIVNcwmzQRFG6sIdx4WNWGL_0',
      libraries: ['places']
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [NegocioFormPage],
  exports: [NegocioFormPage],
  providers: [ImagePicker, Camera],
})
export class NegocioFormPageModule {}
