import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Pregunta } from 'src/app/interfaces/negocio.interface';
import { PreguntasService } from 'src/app/services/preguntas.service';
import { UidService } from 'src/app/services/uid.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-preguntas-modal',
  templateUrl: './preguntas-modal.component.html',
  styleUrls: ['./preguntas-modal.component.scss'],
})
export class PreguntasModalComponent implements OnInit {

  @Input() id: string;
  @Input() categoria: string;

  uid: string;

  infoReady = false;
  hasPreguntas = false;
  preguntas: Pregunta[];

  duda: string;

  lastKey: string;
  batch = 12;
  noMore = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private preguntaService: PreguntasService,
    private usuarioService: UsuarioService,
    private uidService: UidService
  ) { }

  ngOnInit() {
    this.uid = this.uidService.getUid();
    console.log(this.uid);
    this.getPreguntas();
  }

  async getPreguntas() {
    return new Promise(async (resolve, reject) => {
      this.preguntas = await this.preguntaService.getPreguntasNegocio(this.id);
      if (this.preguntas.length > 0) {
        this.hasPreguntas = true;
      } else {
        this.hasPreguntas = false;
      }
      this.infoReady = true;
      resolve();
    });
  }

  async loadPreguntas(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const preguntas: Pregunta[] = await this.preguntaService.getPreguntas(this.batch + 1, this.lastKey);
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

  async preguntar() {
    const nuevaPregunta: Pregunta = {
      pregunta: this.duda,
      respuesta: '',
      categoria: this.categoria,
      remitente: this.id,
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

  async presentAlertError(error) {
    const alert = await this.alertController.create({
      header: 'Ups, algo salió mal, intenta de nuevo',
      message: error,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }

  async regresar() {
    await this.modalController.dismiss();
  }

}
