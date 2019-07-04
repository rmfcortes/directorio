import { Component, OnInit } from '@angular/core';
import { UidService } from 'src/app/services/uid.service';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  uid: string;

  constructor(
    private modalController: ModalController,
    private uidService: UidService,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.uid = await this.uidService.getUid();
    if (!this.uid) {
      this.presentLogin('inicio');
      return;
    }
  }

  async presentLogin(type) {
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { tipo: type }
    });

    modal.onDidDismiss().then(async () => {
      this.uid = await this.uidService.getUid();
      if (this.uid) {
        
      }
    });
    return await modal.present();
  }

}
