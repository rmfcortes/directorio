import { Component, OnInit, NgZone, Input } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';

import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

import { AngularFireDatabase } from '@angular/fire/database';

import { CategoriasService } from 'src/app/services/categorias.service';
import { AnunciosService } from 'src/app/services/anuncios.service';

@Component({
  selector: 'app-bazar-form',
  templateUrl: './bazar-form.page.html',
  styleUrls: ['./bazar-form.page.scss'],
})
export class BazarFormPage implements OnInit {

  @Input() id;

  categorias: any;
  options: any;

  producto = {
    categoria: '',
    descripcion: '',
    fecha: null,
    preguntas: 0,
    id: '',
    precio: '',
    telefono: '',
    tipo: 'gratuito',
    titulo: '',
    uid: '',
    url: {}
  };

  fotoPorCambiar: number;
  fotosListas = false;
  fotosPreview = [];
  fotosBase64 = [];

  subiendoAnuncio = false;

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private modalCtrl: ModalController,
    private imagePicker: ImagePicker,
    private db: AngularFireDatabase,
    private base64: Base64,
    private ngZone: NgZone,
    private camera: Camera,
    private crop: Crop,
    private categoriaService: CategoriasService,
    private anuncioService: AnunciosService,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getCategoriasBazar();
    this.getParams();
  }

  getCategoriasBazar() {
    const catSub = this.categoriaService.getCategoriasBazar().subscribe(cat => {
      catSub.unsubscribe();
      this.categorias = Object.keys(cat);
    });
  }

  async getParams() {
    if ( this.id === 'nuevo') {
      const id = await this.db.createPushId();
      this.producto.id = id;
      return;
    }
    try {
      this.producto.id = this.id;
      const anuncio: any = await this.anuncioService.getAnuncioBazar(this.id);
      this.producto = anuncio;
      this.fotosPreview = Object.values(anuncio.url);
      this.fotosBase64 = [...this.fotosPreview];
      this.fotosListas = true;
      console.log(this.fotosPreview);
    } catch (error) {
      console.log(error);
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

  async publicar() {
    console.log(this.producto);
    this.subiendoAnuncio = true;
    this.producto.fecha = Date.now();
    try {
      const urls = await this.anuncioService
        .publicarFotosBazar(this.fotosBase64, this.producto.id);
      this.producto.url = urls;
      const resp = await this.anuncioService.publicarBazar(this.producto);
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
            this.modalCtrl.dismiss();
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
            this.modalCtrl.dismiss();
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
    this.modalCtrl.dismiss();
  }

}
