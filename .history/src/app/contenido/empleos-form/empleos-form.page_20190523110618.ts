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
    categoria: '',
    descripcion: '',
    fecha: null,
    empresa: '',
    tipo: 'gratuito',
    id: '',
    uid: ''
  };

  constructor(private location: Location,
              public actionSheetController: ActionSheetController,
              public alertController: AlertController,
              private activedRoute: ActivatedRoute,
              private db: AngularFireDatabase,
              private anuncioService: AnunciosService) { }

  ngOnInit() {
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      const param = data['id'];
      if ( param === 'nuevo') {
        const id = this.db.createPushId();
        this.empleo.id = id;
        return;
      }
      try {
        this.empleo.id = param;
        const anuncio: any = await this.anuncioService.getAnuncioBazar(param);
        this.empleo = anuncio;
      } catch (error) {
        console.log(error);
      }
    });
  }

  regresar() {
    this.location.back();
  }

}
