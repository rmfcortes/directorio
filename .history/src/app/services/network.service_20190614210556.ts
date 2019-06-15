import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public netStatus = true;

  constructor(
    private network: Network,
    private toastCtrl: ToastController) {
      this.presentToast('prueba');
    }

  initNetWatch() {
      // watch network for a disconnection
    this.network.onDisconnect().subscribe(() => {
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          this.netStatus = false;
          this.presentToast('Conexión a internet perdida');
        }
      }, 3000);
    });

    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      setTimeout(() => {
        this.netStatus = true;
        this.presentToast('Conexión a internet establecida');
      }, 1000);
    });
  }

  async presentToast(mensaje) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }


}
