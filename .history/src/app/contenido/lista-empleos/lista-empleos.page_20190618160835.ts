import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ClasificadosService } from 'src/app/services/clasificados.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { VariablesService } from 'src/app/services/variables.service';

@Component({
  selector: 'app-lista-empleos',
  templateUrl: './lista-empleos.page.html',
  styleUrls: ['./lista-empleos.page.scss'],
})
export class ListaEmpleosPage implements OnInit {

  infoReady: boolean;
  empleos = [];
  hasEmpleos: boolean;

  ruta = '/inmuebles-form/nuevo';
  contactUs = false;

  constructor(
    private empleosService: ClasificadosService,
    private authService: AuthService,
    private userService: UsuarioService,
    private uidService: UidService,
    private variableService: VariablesService,
    private router: Router,
    public alertController: AlertController
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getEmpleos();
  }

  getEmpleos() {
    const anunSub = this.empleosService.getEmpleos().subscribe((empleos: any) => {
      anunSub.unsubscribe();
      if (empleos) {
        this.hasEmpleos = true;
        this.empleos = empleos;
        console.log(this.empleos);
        this.infoReady = true;
      } else {
        this.infoReady = true;
        this.empleos = [];
        this.hasEmpleos = false;
      }
    });
  }

  async presentAlertConfirm() {
    const user = await this.authService.revisa();
    let msg;
    if (user) {
      msg = 'Te redigiremos a Mis Anuncios para que puedas publicarlo';
    } else {
      msg = 'Necesitas tener una cuenta para publicar anuncios, es muy sencillo crearla, te redigiremos a la página de ingreso';
    }
    const alert = await this.alertController.create({
      header: '¿Quieres publicar un anuncio?',
      message: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            if (user) {
              this.getAnunciosUsuario();
            } else {
              this.router.navigate(['/login', 'menu']);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async agregarAnuncio() {
    const user = await this.uidService.getUid();
    if (!user) {
      this.variableService.setPagina(this.ruta);
      this.router.navigate(['/login', 'anuncio']);
      return;
    }
    this.getAnunciosUsuario();
  }

  async getAnunciosUsuario() {
    const publicados = await this.userService.getAnunciosPublicados();
    if (!publicados) {
      this.router.navigate([this.ruta]);
      return;
    }
    let permitidos = await this.userService.getAnunciosPermitidos();
    if (!permitidos) {
      permitidos = 1;
    }
    if (publicados < permitidos) {
      this.router.navigate([this.ruta]);
    } else {
      this.contactUs = true;
    }
  }

}
