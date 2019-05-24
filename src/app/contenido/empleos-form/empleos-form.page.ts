import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AnunciosService } from 'src/app/services/anuncios.service';

@Component({
  selector: 'app-empleos-form',
  templateUrl: './empleos-form.page.html',
  styleUrls: ['./empleos-form.page.scss'],
})
export class EmpleosFormPage implements OnInit {

  empleo = {
    titulo: '',
    requisitos: '',
    experienciaIndispensable: '',
    experienciaDeseable: '',
    horario: '',
    precio: '',
    tiempo: '',
    descripcion: '',
    fecha: null,
    empresa: '',
    tipo: 'gratuito',
    id: '',
    uid: '',
    telefono: '',
    lugar: '',
  };

  infoReady = false;
  subiendoAnuncio = false;

  constructor(private location: Location,
              public actionSheetController: ActionSheetController,
              public alertController: AlertController,
              private activedRoute: ActivatedRoute,
              private db: AngularFireDatabase,
              private anuncioService: AnunciosService) { }

  ngOnInit() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      const param = data['id'];
      if ( param === 'nuevo') {
        const id = await this.db.createPushId();
        this.empleo.id = id;
        this.infoReady = true;
        console.log(this.empleo);
        return;
      }
      try {
        this.empleo.id = param;
        const anuncio: any = await this.anuncioService.getAnuncioEmpleo(param);
        this.empleo = anuncio;
        this.infoReady = true;
        console.log(param);
        console.log(this.empleo);
      } catch (error) {
        console.log(error);
      }
    });
  }

  async publicar() {
    console.log(this.empleo);
    this.subiendoAnuncio = true;
    this.empleo.fecha = Date.now();
    try {
      const resp = await this.anuncioService.publicarEmpleo(this.empleo);
      if (resp) {
        this.subiendoAnuncio = false;
        this.presentAlertConfirm();
      }
    } catch (error) {
      this.presentAlertError();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Tarea completada',
      message: `Tu anuncio fue publicado con éxito, en breve podrás ver los cambios`,
      buttons: [
        {
          text: 'Editar',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.location.back();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: `Algo salió mal al momento de publicar tu anuncio. Por favor intenta de nuevo`,
      buttons: [
        {
          text: 'Salir',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.location.back();
          }
        }, {
          text: 'Intentar de nuevo',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  regresar() {
    this.location.back();
  }

}
