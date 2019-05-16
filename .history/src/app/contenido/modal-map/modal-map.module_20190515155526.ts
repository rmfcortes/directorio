import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalMapComponent } from './modal-map.component';


@NgModule({
    declarations: [
        ModalMapComponent
    ],
    imports: [
      IonicModule,
      CommonModule
    ],
    exports: [
        ModalMapComponent
    ]
})

export class MapComponentModule {}
