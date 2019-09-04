import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreguntasModalComponent } from './preguntas-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [PreguntasModalComponent],
  entryComponents: [PreguntasModalComponent]
})
export class PreguntasModalComponentModule {}
