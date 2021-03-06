import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { IonicModule } from '@ionic/angular';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

import { InmueblesFormPage } from './inmuebles-form.page';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapsApiKey,
      libraries: ['places']
    }),
  ],
  providers: [ImagePicker, Camera, Crop, Base64],
  declarations: [InmueblesFormPage],
  entryComponents: [InmueblesFormPage]
})
export class InmueblesFormPageModule {}
