import { Component, OnInit } from '@angular/core';
import { UidService } from 'src/app/services/uid.service';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../../login/login.page';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario.interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  uid: string;
  user: Usuario;

  infoReady = false;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService,
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
    this.user = await this.usuarioService.getUidAndPhoto();
    this.infoReady = true;
  }

  async presentLogin(type) {
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { tipo: type }
    });

    modal.onDidDismiss().then(async () => {
      this.uid = await this.uidService.getUid();
      if (this.uid) {
        this.user = await this.usuarioService.getUidAndPhoto();
      }
    });
    return await modal.present();
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
