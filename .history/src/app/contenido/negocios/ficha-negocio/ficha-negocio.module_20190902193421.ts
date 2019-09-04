import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FichaNegocioPage } from './ficha-negocio.page';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { ScrollVanishDirective } from 'src/app/directives/scroll-vanish.directive';

import { InfoSucursalModalPageModule } from '../../info-sucursal-modal/info-sucursal-modal.module';
import { CartComponentModule } from 'src/app/shared/cart/cart.module';
import { LoginPageModule } from '../../../login/login.module';
import { MapaPageModule } from '../../mapa/mapa.module';
import { ListaComentariosModalPageModule } from '../../lista-comentarios-modal/lista-comentarios-modal.module';
import { ListaPasillosPageModule } from './lista-pasillos/lista-pasillos.module';
import { FichaProductoPageModule } from './ficha-producto/ficha-producto.module';
import { PreguntasModalComponentModule } from '../../preguntas-modal/preguntas-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartComponentModule,
    LoginPageModule,
    MapaPageModule,
    ListaPasillosPageModule,
    FichaProductoPageModule,
    ListaComentariosModalPageModule,
    PreguntasModalComponentModule,
    InfoSucursalModalPageModule,
  ],
  declarations: [FichaNegocioPage, ScrollVanishDirective],
  providers: [DatePipe, CallNumber],
  entryComponents: [FichaNegocioPage]
})
export class FichaNegocioPageModule {}
