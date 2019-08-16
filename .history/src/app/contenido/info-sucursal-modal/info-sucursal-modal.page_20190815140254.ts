import { Component, Input } from '@angular/core';
import { NegociosService } from 'src/app/services/negocios.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-sucursal-modal',
  templateUrl: './info-sucursal-modal.page.html',
  styleUrls: ['./info-sucursal-modal.page.scss'],
})
export class InfoSucursalModalPage {

  @Input() value: any;
  negocio: any;
  despliegueHorario = false;
  infoReady = false;

  constructor(
    private negocioService: NegociosService,
    private modalController: ModalController
  ) { }

  async ionViewDidEnter() {
    const result = await this.negocioService.getSucursalNegocio(this.value.id, this.value.nombre);
    this.negocio = {...this.value, ...result};
    this.infoReady = true;
  }

  async regresar() {
    await this.modalController.dismiss();
  }

}
