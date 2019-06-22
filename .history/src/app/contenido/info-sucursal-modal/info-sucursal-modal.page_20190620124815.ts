import { Component, OnInit, Input } from '@angular/core';
import { NegociosService } from 'src/app/services/negocios.service';

@Component({
  selector: 'app-info-sucursal-modal',
  templateUrl: './info-sucursal-modal.page.html',
  styleUrls: ['./info-sucursal-modal.page.scss'],
})
export class InfoSucursalModalPage implements OnInit {

  @Input() value: any;
  negocio: object;
  despliegueHorario = false;
  infoReady = false;

  constructor(
    private negocioService: NegociosService
  ) { }

  ngOnInit() {
    console.log(this.value);
  }

  async ionViewDidEnter() {
    const result = await this.negocioService.getSucursalNegocio(this.value.id, this.value.nombre);
    console.log(result);
    this.negocio = {...this.value, ...result};
    this.infoReady = true;
    console.log(this.negocio);
  }

}
