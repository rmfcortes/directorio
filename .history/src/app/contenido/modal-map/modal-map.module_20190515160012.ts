import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalMapComponent } from './modal-map.component';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';


@NgModule({
    declarations: [ModalMapComponent],
    imports: [
      IonicModule,
      CommonModule
    ],
    providers: [GoogleMaps]
})

export class MapComponentModule {}
