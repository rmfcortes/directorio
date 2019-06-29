import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, ModalController } from '@ionic/angular';
import { UidService } from 'src/app/services/uid.service';
import { Calificacion } from 'src/app/interfaces/negocio.interface';
import { Comentario } from 'src/app/interfaces/comentario.interface';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  @Input() calificacion: Calificacion;

  uid: string;
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
    private uidService: UidService,
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
    this.comentario.id = this.calificacion.id;
    this.comentario.puntos = this.calificacion.puntos;
    this.comentario.nombre = this.calificacion.nombre;
    this.comentario.urlNegocio = this.calificacion.urlNegocio;
  }

  getUserInfo() {
    const s = this.uidService.usuario.subscribe((user: any) => {
      if (user !== 'inactivo' && user) {
        if (user.foto) {
          this.comentario.url = user.foto;
        }
        this.comentario.usuario = user.nombre;
        this.uid = user.uid;
        this.infoReady = true;
        s.unsubscribe();
        this.getComentario();
      }
    });
  }

  getComentario() {
    const userSub = this.usuarioService.getComentario(this.uid, this.comentario.id).subscribe((data: any) => {
      userSub.unsubscribe();
      if (data) {
        this.comentario.comentario = data.comentario;
      }
    });
  }

  async publicarComentario() {
    this.publicando = true;
    try {
      await this.usuarioService.publicarComentario(this.comentario, this.uid);
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
