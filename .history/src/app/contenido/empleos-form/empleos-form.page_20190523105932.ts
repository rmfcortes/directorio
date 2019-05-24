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

  getParams() {
    this.activedRoute.params.subscribe(data => {
      const param = data['id'];
      if ( param === 'nuevo') {
        const id = this.db.createPushId();
        this.empleo.id = id;
        return;
      }
      this.empleo.id = param;
      const anunSub = this.anuncioService.getAnuncioBazar(this.empleo.uid, param)
        .subscribe((anuncio: any) => {
          this.empleo = anuncio;
          anunSub.unsubscribe();
        });
    });
  }

  regresar() {
    this.location.back();
  }

}
