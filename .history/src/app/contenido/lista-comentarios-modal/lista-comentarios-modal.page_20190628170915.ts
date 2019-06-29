import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NegociosService } from 'src/app/services/negocios.service';
import { ComentarioVistaPrevia } from 'src/app/interfaces/negocio.interface';

@Component({
  selector: 'app-lista-comentarios-modal',
  templateUrl: './lista-comentarios-modal.page.html',
  styleUrls: ['./lista-comentarios-modal.page.scss'],
})
export class ListaComentariosModalPage implements OnInit {

  @Input() data: string;

  comentarios: ComentarioVistaPrevia[];
  batch = 15;

  constructor(
    private modalCtrl: ModalController,
    private negocioService: NegociosService,
  ) { }

  ngOnInit() {
    console.log('Init');
  }

  async ionViewDidEnter() {
    this.getDatos();
  }

  async getDatos() {
    this.comentarios = await this.negocioService.getOpiniones(this.data, this.batch);
    console.log(this.comentarios);
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
