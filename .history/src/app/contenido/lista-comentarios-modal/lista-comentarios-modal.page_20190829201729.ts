import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NegociosService } from 'src/app/services/negocios.service';
import { Comentarios, Pregunta } from 'src/app/interfaces/negocio.interface';

@Component({
  selector: 'app-lista-comentarios-modal',
  templateUrl: './lista-comentarios-modal.page.html',
  styleUrls: ['./lista-comentarios-modal.page.scss'],
})
export class ListaComentariosModalPage implements OnInit {

  @Input() data: any;

  comentarios: Comentarios[];
  preguntas: Pregunta[];
  isPregunta = false;
  lastKey = '';
  batch = 15;
  noMore = false;

  constructor(
    private modalCtrl: ModalController,
    private negocioService: NegociosService,
  ) { }

  async ionViewDidEnter() {
    if (this.data.origen === 'comentarios') {
      this.isPregunta = false;
      this.getComentarios();
    } else if (this.data.origen === 'preguntas') {
      this.isPregunta = true;
      this.getPreguntas();
    }
  }

  async getComentarios() {
    const comentarios: Comentarios[] = await this.negocioService.getOpiniones(this.data.id, this.batch + 1);
    this.lastKey = comentarios[0].id;
    if (comentarios.length === this.batch + 1) {
      comentarios.shift();
    } else {
      this.noMore = true;
    }
    this.comentarios = comentarios.reverse();
    console.log(this.comentarios);
  }

  async getPreguntas() {
    const preguntas: Pregunta[] = await this.negocioService.getPreguntas(this.data.id, this.batch + 1);
    this.lastKey = preguntas[0].id;
    if (preguntas.length === this.batch + 1) {
      preguntas.shift();
    } else {
      this.noMore = true;
    }
    this.preguntas = preguntas.reverse();
    console.log(this.preguntas);
  }

  async loadPreguntas(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const preguntas: Pregunta[] = await this.negocioService.getPreguntas(this.batch + 1, this.lastKey);
    if (preguntas) {
      this.lastKey = preguntas[0].id;
      if (preguntas.length === this.batch + 1) {
        preguntas.shift();
      } else {
        this.noMore = true;
      }
      this.preguntas = this.preguntas.concat(preguntas.reverse());
    }

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  async loadComentarios(event) {
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

  async preguntar() {
    const nuevaPregunta: Pregunta = {
      pregunta: this.duda,
      respuesta: '',
      categoria: this.categoria,
      remitente: this.data.id,
    };
    try {
      await this.usuarioService.publicarPregunta(nuevaPregunta, this.categoria, this.uid);
      this.preguntas.unshift(nuevaPregunta);
      this.duda = '';
      return;
    } catch (err) {
      this.presentAlertError(err);
    }
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
