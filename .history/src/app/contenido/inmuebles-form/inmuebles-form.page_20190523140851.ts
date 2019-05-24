import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AnunciosService } from 'src/app/services/anuncios.service';
@Component({
  selector: 'app-inmuebles-form',
  templateUrl: './inmuebles-form.page.html',
  styleUrls: ['./inmuebles-form.page.scss'],
})
export class InmueblesFormPage implements OnInit {

  casa = {
    titulo: '',
    precio: '',
    fecha: null,
    tipoInmueble: 'casa',
    recamaras: '',
    baños: '',
    cochera: '',
    superficie: '',
    descripcion: '',
    direccion: '',
    tipo: 'gratuito',
    id: '',
    uid: '',
    telefono: '',
  };

  terreno = {
    titulo: '',
    precio: '',
    fecha: null,
    tipoInmueble: 'terreno',
    superficie: '',
    descripcion: '',
    direccion: '',
    tipo: 'gratuito',
    id: '',
    uid: '',
    telefono: '',
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
  }

}
