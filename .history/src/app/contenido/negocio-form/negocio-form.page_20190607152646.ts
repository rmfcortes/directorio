import { Component, OnInit, NgZone } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

import { AngularFireDatabase } from '@angular/fire/database';

import { AnunciosService } from 'src/app/services/anuncios.service';

@Component({
  selector: 'app-negocio-form',
  templateUrl: './negocio-form.page.html',
  styleUrls: ['./negocio-form.page.scss'],
})
export class NegocioFormPage implements OnInit {

  options: any;
  negocio: any;
  fotoPorCambiar: number;
  fotosPreview = [];
  fotosBase64 = [];
  fotosListas = false;
  subiendoAnuncio = false;

  constructor(
    private location: Location,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private activedRoute: ActivatedRoute,
    private anuncioService: AnunciosService,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private crop: Crop,
    private base64: Base64,
    private ngZone: NgZone,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      const param = data['id'];
      if ( param === 'nuevo') {
        const id = await this.db.createPushId();
        this.negocio.id = id;
        return;
      }
      try {
        this.negocio.id = param;
        const anuncio: any = await this.anuncioService.getAnuncioBazar(param);
        this.negocio = anuncio;
        this.fotosPreview = Object.values(anuncio.url);
        this.fotosBase64 = [...this.fotosPreview];
        this.fotosListas = true;
      } catch (error) {
        console.log(error);
      }
    });
  }

  async presentActionSheet() {
    if (this.subiendoAnuncio) { return; }
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Escoge una imagen de tu galería',
        icon: 'images',
        handler: () => {
            this.agregarImagen();
        }
      }, {
        text: 'Toma una foto de la cámara',
        icon: 'camera',
        handler: () => {
          this.activaCamara();
        }
      }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
      }]
    });
    await actionSheet.present();
  }

  async agregarImagen() {
    this.options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      // maximumImagesCount: permitido,
      maximumImagesCount: 1,

      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      width: 600,
      height: 600,
      // quality of resized image, defaults to 100
      quality: 100,

      // window.imagePicker.OutputType.FILE_URI (0) or
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 0
    };
    try {
      let results = await this.imagePicker.getPictures(this.options);
      results = 'file://' + results;
      let newImage = await this.crop.crop(results, {quality: 100});
      newImage = 'file://' + newImage;
      const img64 = await this.base64.encodeFile(newImage);
      const base = img64.split('data:image/*;charset=utf-8;base64,')[1];
      this.ngZone.run(() => {
      if (this.fotoPorCambiar || this.fotoPorCambiar === 0) {
        this.fotosPreview[this.fotoPorCambiar] = img64;
        this.fotosBase64[this.fotoPorCambiar] = base;
        this.fotoPorCambiar = null;
      } else {
        this.fotosPreview.push(img64);
        this.fotosBase64.push(base);
      }
      this.fotosListas = true;
      });

    } catch (err) {
      alert(err);
    }
  }

  async activaCamara() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 600,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    try {
      let imageData = await this.camera.getPicture(options);
      imageData = 'file://' + imageData;
      let newImage = await this.crop.crop(imageData, {quality: 100});
      newImage = 'file://' + newImage;
      const img64 = await this.base64.encodeFile(newImage);
      const base = img64.split('data:image/*;charset=utf-8;base64,')[1];

      this.ngZone.run(() => {
        if (this.fotoPorCambiar || this.fotoPorCambiar === 0) {
          this.fotosPreview[this.fotoPorCambiar] = img64;
          this.fotosBase64[this.fotoPorCambiar] = base;
          this.fotoPorCambiar = null;
          return;
        }
        this.fotosPreview.push(img64);
        this.fotosBase64.push(base);
        this.fotosListas = true;
      });
    } catch (err) {
      console.log('Error en camara', JSON.stringify(err))
    }

  }

  regresar() {
    this.location.back();
  }

}
