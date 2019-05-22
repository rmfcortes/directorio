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
  options: any;

  fotoPorCambiar: number;
  fotosListas = false;
  fotosPreview = [];
  fotosBase64 = [];

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

  async agregarImagen() {
    console.log('Agregar');
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
      console.log(results);
      results.forEach(result => {
        this.fotosPreview.push('data:image/jpeg;base64,' + result);
        this.fotosBase64.push(result);
        this.fotosListas = true;
      });
      console.log(this.fotosPreview);

    } catch (err) {
      alert(err);
    }
  }

  async cambiarImagen() {
    console.log(this.fotoPorCambiar);
    this.options = {
      maximumImagesCount: 1,
      width: 200,
      height: 200,
      quality: 25,
      outputType: 1
    };
    try {
      const result = await this.imagePicker.getPictures(this.options);
      console.log(result);
      this.fotosPreview[this.fotoPorCambiar] = 'data:image/jpeg;base64,' + result;
      this.fotosBase64[this.fotoPorCambiar] = result;
      this.fotoPorCambiar = null;
      console.log(this.fotosPreview);
    } catch (err) {
      alert(err);
    }
  }

  activaCamara() {
    console.log(this.fotoPorCambiar);
    const options: CameraOptions = {
      quality: 30,
      // targetWidth: 200,
      // targetHeight: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false
    };
    this.camera.getPicture(options)
      .then(imageData => {
        if (this.fotoPorCambiar) {
          this.fotosPreview[this.fotoPorCambiar] = 'data:image/jpeg;base64,' + imageData;
          this.fotosBase64[this.fotoPorCambiar] = imageData;
          console.log(this.fotosBase64);
          this.fotoPorCambiar = null;
          return;
        }
        console.log('No foto por Cambiar');
        this.fotosPreview.push('data:image/jpeg;base64,' + imageData);
        this.fotosBase64.push(imageData);
        this.fotosListas = true;
        console.log(this.fotosBase64);
      })
      .catch(err => console.log('Error en camara', JSON.stringify(err)));

  }

  async presentActionSheet() {
    console.log(this.fotoPorCambiar);
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
            this.fotoPorCambiar = null;
            console.log('Cancel clicked');
          }
      }]
    });
    await actionSheet.present();
  }

  quitaFoto() {
    this.fotosPreview.splice(this.fotoPorCambiar, 1);
    this.fotosBase64.splice(this.fotoPorCambiar, 1);
    this.fotoPorCambiar = null;
    console.log(this.fotosBase64);
  }

  regresar() {
    this.location.back();
  }

}
