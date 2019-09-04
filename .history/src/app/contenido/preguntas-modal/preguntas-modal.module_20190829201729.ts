import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreguntasModalComponent } from './preguntas-modal.component';
import { LoginPageModule } from '../login/login.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageModule
  ],
  declarations: [PreguntasModalComponent],
  entryComponents: [PreguntasModalComponent]
})
export class PreguntasModalComponentModule {}
