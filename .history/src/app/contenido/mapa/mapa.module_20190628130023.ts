import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaPage } from './mapa.page';

import { AgmCoreModule } from '@agm/core';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2bkQuBBHIVNcwmzQRFG6sIdx4WNWGL_0'
    }),
  ],
  declarations: [MapaPage],
  providers: [GoogleMaps, Geolocation],
  entryComponents: [MapaPage]
})
export class MapaPageModule {}
