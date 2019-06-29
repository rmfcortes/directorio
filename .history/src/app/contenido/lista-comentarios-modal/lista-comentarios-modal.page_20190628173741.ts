import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NegociosService } from 'src/app/services/negocios.service';
import { Comentarios } from 'src/app/interfaces/negocio.interface';

@Component({
  selector: 'app-lista-comentarios-modal',
  templateUrl: './lista-comentarios-modal.page.html',
  styleUrls: ['./lista-comentarios-modal.page.scss'],
})
export class ListaComentariosModalPage implements OnInit {

  @Input() data: string;

  comentarios: Comentarios[];
  lastKey = '';
  batch = 15;
  noMore = false;

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
    const comentarios: Comentarios[] = await this.negocioService.getOpiniones(this.data, this.batch + 1);
    this.lastKey = comentarios[0].id;
    if (comentarios.length === this.batch + 1) {
      comentarios.shift();
    } else {
      this.noMore = true;
    }
    this.comentarios = comentarios.reverse();
    console.log(this.comentarios);
  }

  async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const opiniones: Comentarios[] = await this.negocioService.getOpiniones(this.batch + 1, this.lastKey);
    if (opiniones) {
      this.lastKey = opiniones[0].id;
      if (opiniones.length === this.batch + 1) {
        opiniones.shift();
      } else {
        this.noMore = true;
      }
      this.comentarios = this.comentarios.concat(opiniones.reverse());
    }

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
