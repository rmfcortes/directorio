import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Calificacion } from 'src/app/interfaces/negocio.interface';
import { Comentario } from 'src/app/interfaces/comentario.interface';
import { Usuario } from 'src/app/interfaces/usuario.interfaces';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  @Input() data: Calificacion;

  user: Usuario;
  publicando = false;

  comentario: Comentario = {
    comentario: '',
    puntos: null,
    fecha: new Date(),
    url: '../../../assets/images/no-foto-perfil.png',
    urlNegocio: '',
    usuario: '',
    id: '',
    nombre: ''
  };

  infoReady = false;

  constructor(
    private usuarioService: UsuarioService,
    private modalCtrl: ModalController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
    this.getUserInfo();
  }

  getParams() {
    this.comentario.id = this.data.id;
    this.comentario.puntos = this.data.puntos;
    this.comentario.nombre = this.data.nombre;
    this.comentario.urlNegocio = this.data.urlNegocio;
  }

  async getUserInfo() {
    this.user = await this.usuarioService.getUidAndPhoto();
    console.log(this.user);
    if (this.user) {
      if (this.user.foto) {
        this.comentario.url = this.user.foto;
      }
      this.comentario.usuario = this.user.nombre;
      this.infoReady = true;
      this.getComentario();
    }
  }

  getComentario() {
    const userSub = this.usuarioService.getComentario(this.user.uid, this.comentario.id).subscribe((data: any) => {
      userSub.unsubscribe();
      if (data) {
        this.comentario.comentario = data.comentario;
      }
    });
  }

  async publicarComentario() {
    this.publicando = true;
    try {
      await this.usuarioService.publicarComentario(this.comentario, this.user.uid);
      this.publicando = false;
      this.modalCtrl.dismiss(this.comentario);
    } catch (error) {
      this.publicando = false;
      this.presentAlertError(error);
    }
  }

  async presentAlertError(error) {
    const alert = await this.alertController.create({
      header: 'Ups, algo salió mal, intenta de nuevo',
      message: error,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }

  regresar() {
    this.modalCtrl.dismiss(null);
  }

}
