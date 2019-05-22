import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActionSheetController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-bazar-form',
  templateUrl: './bazar-form.page.html',
  styleUrls: ['./bazar-form.page.scss'],
})
export class BazarFormPage implements OnInit {

  categorias: any;
  categoria = '';

  imageResponse: any;
  options: any;

  fotoPorCambiar: number;
  fotosListas = true;
  fotos = ['', '', ''];

  imagenPreview: string;
  imagen64: string;

  constructor(private location: Location,
              public actionSheetController: ActionSheetController,
              private categoriaService: CategoriasService,
              private imagePicker: ImagePicker,
              private camera: Camera) { }

  ngOnInit() {
    this.getCategoriasBazar();
  }

  getCategoriasBazar() {
    const catSub = this.categoriaService.getCategoriasBazar().subscribe(cat => {
      catSub.unsubscribe();
      this.categorias = Object.keys(cat);
    });
  }

  agregarImagen() {
    // this.fileChooser.open()
    //   .then(uri => console.log(uri))
    //   .catch(e => console.log(e));
    this.options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      maximumImagesCount: 3,

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
    this.imageResponse = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
      }
      console.log(this.imageResponse);
    }, (err) => {
      alert(err);
    });
  }

  async activaCamara() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    try {
      const imageData = await this.camera.getPicture(options);
      if (this.fotoPorCambiar !== null) {
        this.fotos[this.fotoPorCambiar] = 'data:image/jpeg;base64,' + imageData;
        return;
      }
      this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = imageData;
      console.log(this.imagen64);
    } catch (err) {
      console.log('Error en camara', JSON.stringify(err));
    }

  }

  async presentActionSheet() {
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
            console.log('Cancel clicked');
          }
      }]
    });
    await actionSheet.present();
  }

  async presentActionSheetEditar(foto) {
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
            this.fotoPorCambiar = '';
            console.log('Cancel clicked');
          }
      }]
    });
    await actionSheet.present();
  }

  quitaFoto() {
    console.log('Quitar foto');
  }

  regresar() {
    this.location.back();
  }

}
