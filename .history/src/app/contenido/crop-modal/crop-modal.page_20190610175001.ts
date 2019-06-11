import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-crop-modal',
  templateUrl: './crop-modal.page.html',
  styleUrls: ['./crop-modal.page.scss'],
})
export class CropModalPage implements OnInit {

  @Input() value: string;
  @ViewChild('angularCropper') public angularCropper: AngularCropperjsComponent;
  cropperOptions: any;

  myImage = null;
  scaleValX = 1;
  scaleValY = 1;

  constructor(private modalController: ModalController) {
    this.cropperOptions = {
      dragMode: 'crop',
      aspectRatio: 16 / 9,
      autoCrop: true,
      movable: true,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.8,
    };
   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.myImage = this.value;
    console.log(this.myImage);
  }

  reset() {
    this.angularCropper.cropper.reset();
  }

  clear() {
    this.angularCropper.cropper.clear();
  }

  rotate() {
    this.angularCropper.cropper.rotate(90);
  }

  zoom(zoomIn: boolean) {
    const factor = zoomIn ? 0.1 : -0.1;
    this.angularCropper.cropper.zoom(factor);
  }

  scaleX() {
    this.scaleValX = this.scaleValX * -1;
    this.angularCropper.cropper.scaleX(this.scaleValX);
  }

  scaleY() {
    this.scaleValY = this.scaleValY * -1;
    this.angularCropper.cropper.scaleY(this.scaleValY);
  }

  move(x, y) {
    this.angularCropper.cropper.move(x, y);
  }

  save() {
    const croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas(
      {
        width: 480,
        height: 270,
        minWidth: 256,
        minHeight: 256,
        maxWidth: 480,
        maxHeight: 270,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high',
      }
    ).toDataURL('image/jpeg', (100 / 100));
    this.modalController.dismiss(croppedImgB64String);
  }

  async regresar() {
    await this.modalController.dismiss();
  }

}
