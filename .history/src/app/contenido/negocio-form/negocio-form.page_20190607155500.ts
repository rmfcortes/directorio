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
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-negocio-form',
  templateUrl: './negocio-form.page.html',
  styleUrls: ['./negocio-form.page.scss'],
})
export class NegocioFormPage implements OnInit {

  options: any;
  fotoPorCambiar: number;
  fotosPreview = [];
  fotosBase64 = [];
  fotosListas = false;
  subiendoAnuncio = false;
  categorias = [];

  negocio = {
    nombre: '',
    descripcion: '',
    telefono: '',
    direccion: '',
    categoria: '',
    horario: [],
    lat: null,
    lng: null,
    servicioDomicilio: false,
    url: {},
    rate: 0,
    preguntas: 0
  };

  constructor(
    private location: Location,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private activedRoute: ActivatedRoute,
    private anuncioService: AnunciosService,
    private categoriasService: CategoriasService,
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
    this.getCategorias();
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

  async getCategorias() {
    const cat: any = await this.categoriasService.getCategoriasObject();
    if (cat) {
      this.categorias = cat;
      console.log(this.categorias);
    }
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

  async presentActionSheetEditar(foto) {
    if (this.subiendoAnuncio) { return; }
    this.fotoPorCambiar = foto;
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Cambiar',
        icon: 'create',
        handler: () => {
          this.presentActionSheet();
        }
      }, {
        text: 'Eliminar',
        icon: 'trash',
        handler: () => {
          this.quitaFoto();
        }
      }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            this.fotoPorCambiar = null;
          }
      }]
    });
    await actionSheet.present();
  }

  quitaFoto() {
    this.fotosPreview.splice(this.fotoPorCambiar, 1);
    this.fotosBase64.splice(this.fotoPorCambiar, 1);
    this.fotoPorCambiar = null;
    if (!this.fotosPreview) {
      this.fotosListas = false;
    }
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

  async publicar() {
    console.log(this.negocio);
    this.subiendoAnuncio = true;
    this.negocio.fecha = Date.now();
    try {
      const urls = await this.anuncioService
        .publicarFotosBazar(this.fotosBase64, this.negocio.id);
      this.negocio.url = urls;
      const resp = await this.anuncioService.publicarNegocio(this.negocio);
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
