import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ClasificadosService } from 'src/app/services/clasificados.service';
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

  noMore = false;
  batch = 12;
  lazyBatch = 6;
  lastKey = '';

  constructor(
    private empleosService: ClasificadosService,
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
    const anunSub = this.empleosService.getEmpleos(this.batch + 1).valueChanges()
      .subscribe(async (anuncios: any) => {
        anunSub.unsubscribe();
        if (anuncios.length > 0) {
          console.log(anuncios);
          this.lastKey = anuncios[0].id;
          if (anuncios.length === this.batch + 1) {
            anuncios.shift();
          } else {
            this.noMore = true;
          }
          this.empleos = anuncios.reverse();
          this.hasEmpleos = true;
          this.infoReady = true;
          console.log(this.empleos);
        } else {
          this.infoReady = true;
          this.empleos = [];
          this.hasEmpleos = false;
        }
      });
  }

  loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const s = this.empleosService.getEmpleos(this.lazyBatch + 1, this.lastKey).valueChanges()
      .subscribe((anuncios: any) => {
        s.unsubscribe();
        if (anuncios) {
          this.lastKey = anuncios[0].id;
          if (anuncios.length === this.lazyBatch + 1) {
            anuncios.shift();
          } else {
            this.noMore = true;
          }
          this.empleos = this.empleos.concat(anuncios.reverse());
          console.log(this.empleos);
        }
      });

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
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
