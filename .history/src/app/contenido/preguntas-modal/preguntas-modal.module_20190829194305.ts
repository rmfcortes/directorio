import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AgmCoreModule } from '@agm/core';

import { PreguntasModalPage } from './preguntas-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [PreguntasModalPage],
  entryComponents: [PreguntasModalPage]
})
export class PreguntasModalPageModule {}
