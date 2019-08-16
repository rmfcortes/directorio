import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { MapsAPILoader} from '@agm/core';
import { } from 'googlemaps';
import { AnunciosService } from 'src/app/services/anuncios.service';
@Component({
  selector: 'app-inmuebles-form',
  templateUrl: './inmuebles-form.page.html',
  styleUrls: ['./inmuebles-form.page.scss'],
})
export class InmueblesFormPage implements OnInit {

  @Input() tipo;
  @ViewChild('txtHome') public searchElement: ElementRef;

  options: any;

  inmueble = {
    titulo: '',
    contacto: '',
    precio: null,
    fecha: null,
    tipoInmueble: '',
    recamaras: null,
    wc: null,
    cochera: null,
    superficie: null,
    descripcion: '',
    direccion: '',
    tipo: 'gratuito',
    id: '',
    uid: '',
    telefono: null,
    url: {},
    lat: null,
    lng: null,
    tipoVenta: '',
    preguntas: 0
  };

  fotoPorCambiar: number;
  fotosListas = false;
  fotosPreview = [];
  fotosBase64 = [];

  infoReady = false;
  direccionReady = false;
  subiendoAnuncio = false;

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private modalCtrl: ModalController,
    private mapsAPILoader: MapsAPILoader,
    private imagePicker: ImagePicker,
    private db: AngularFireDatabase,
    private ngZone: NgZone,
    private camera: Camera,
    private base64: Base64,
    private crop: Crop,
    private anuncioService: AnunciosService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.infoReady = false;
    this.getParams();
  }

  async getParams() {
    if ( this.tipo === 'nuevo') {
      const id = await this.db.createPushId();
      this.inmueble.id = id;
      setTimeout(() => {
        this.setAutocomplete();
      }, 500);
      return;
    }
    try {
      this.inmueble.id = this.tipo;
      const anuncio: any = await this.anuncioService.getAnuncioInmueble(this.inmueble.id);
      this.inmueble = anuncio;
      this.fotosPreview = Object.values(anuncio.url);
      this.fotosBase64 = [...this.fotosPreview];
      this.fotosListas = true;
      this.direccionReady = true;
      setTimeout(() => {
        this.setAutocomplete();
      }, 500);
      console.log(this.fotosPreview);
    } catch (error) {
      console.log(error);
    }
  }

  setAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      const nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
      const autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
        types: ['address']
    });
      autocomplete.addListener('place_changed', () => {
          console.log('Lo intenta');
          this.ngZone.run(() => {
              // get the place result
              const place: google.maps.places.PlaceResult = autocomplete.getPlace();

              // verify result
              if (place.geometry === undefined || place.geometry === null) {
                  return;
              }
              // set latitude, longitude and zoom
              this.inmueble.lat = place.geometry.location.lat();
              this.inmueble.lng = place.geometry.location.lng();
              this.inmueble.direccion = place.formatted_address;
              this.direccionReady = true;
          });
      });
    });
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

  guardaLoc(evento) {
    this.inmueble.lat = evento.coords.lat;
    this.inmueble.lng = evento.coords.lng;
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
    console.log(this.inmueble);
    this.subiendoAnuncio = true;
    this.inmueble.fecha = Date.now();
    try {
      const urls = await this.anuncioService
        .publicarFotosInmueble(this.fotosBase64, this.inmueble.id);
      this.inmueble.url = urls;
      const resp = await this.anuncioService.publicarInmueble(this.inmueble);
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
