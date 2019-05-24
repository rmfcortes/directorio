import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AnunciosService } from 'src/app/services/anuncios.service';
@Component({
  selector: 'app-inmuebles-form',
  templateUrl: './inmuebles-form.page.html',
  styleUrls: ['./inmuebles-form.page.scss'],
})
export class InmueblesFormPage implements OnInit {

  options: any;

  inmueble = {
    titulo: '',
    precio: '',
    fecha: null,
    tipoInmueble: '',
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
    url: {}
  };

  fotoPorCambiar: number;
  fotosListas = false;
  fotosPreview = [];
  fotosBase64 = [];

  infoReady = false;
  subiendoAnuncio = false;

  constructor(private location: Location,
              private ngZone: NgZone,
              private imagePicker: ImagePicker,
              private camera: Camera,
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
        this.inmueble.id = id;
        return;
      }
      try {
        this.inmueble.id = param;
        const anuncio: any = await this.anuncioService.getAnuncioInmueble(param);
        this.inmueble = anuncio;
        this.fotosPreview = Object.values(anuncio.url);
        this.fotosBase64 = [...this.fotosPreview];
        this.fotosListas = true;
        console.log(this.fotosPreview);
      } catch (error) {
        console.log(error);
      }
    });
  }

  async agregarImagen() {
    const permitido = 3 - this.fotosPreview.length;
    // this.fileChooser.open()
    //   .then(uri => console.log(uri))
    //   .catch(e => console.log(e));
    this.options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      maximumImagesCount: permitido,

      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      width: 200,
      height: 200,
      // quality of resized image, defaults to 100
      quality: 25,

      // window.imagePicker.OutputType.FILE_URI (0) or
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 1
    };
    try {
      const results = await this.imagePicker.getPictures(this.options);
      this.ngZone.run(() => {
        results.forEach(result => {
          this.fotosPreview.push('data:image/jpeg;base64,' + result);
          this.fotosBase64.push(result);
          this.fotosListas = true;
        });
      });

    } catch (err) {
      alert(err);
    }
  }

  async cambiarImagen() {
    this.options = {
      maximumImagesCount: 1,
      width: 200,
      height: 200,
      quality: 25,
      outputType: 1
    };
    try {
      const result = await this.imagePicker.getPictures(this.options);
      this.ngZone.run(() => {
        this.fotosPreview[this.fotoPorCambiar] = 'data:image/jpeg;base64,' + result;
        this.fotosBase64[this.fotoPorCambiar] = result;
        this.fotoPorCambiar = null;
      });
    } catch (err) {
      alert(err);
    }
  }

  async activaCamara() {
    const options: CameraOptions = {
      quality: 30,
      targetWidth: 200,
      targetHeight: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false
    };
    try {
      const imageData = await this.camera.getPicture(options);
      this.ngZone.run(() => {
        if (this.fotoPorCambiar || this.fotoPorCambiar === 0) {
          this.fotosPreview[this.fotoPorCambiar] = 'data:image/jpeg;base64,' + imageData;
          this.fotosBase64[this.fotoPorCambiar] = imageData;
          this.fotoPorCambiar = null;
          return;
        }
        this.fotosPreview.push('data:image/jpeg;base64,' + imageData);
        this.fotosBase64.push(imageData);
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
          if (this.fotoPorCambiar || this.fotoPorCambiar === 0 ) {
            this.cambiarImagen();
          } else {
            this.agregarImagen();
          }
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
    console.log(this.inmueble);
    this.subiendoAnuncio = true;
    this.inmueble.fecha = Date.now();
    try {
      const urls = await this.anuncioService
        .publicarFotosBazar(this.fotosBase64, this.inmueble.id);
      this.inmueble.url = urls;
      const resp = await this.anuncioService.publicarBazar(this.inmueble);
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
