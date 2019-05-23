import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoadingController, AlertController  } from '@ionic/angular';
import { NegociosService } from 'src/app/services/negocios.service';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  uid: string;
  categoria: string;
  origen: string;

  comentario = {
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
  loader: any;

  constructor(private activedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private negocioService: NegociosService,
              private usuarioService: UsuarioService,
              private loadingCtrl: LoadingController,
              public alertController: AlertController) { }

  ngOnInit() {
    this.getParams();
    this.getUserInfo();
  }

  getParams() {
    this.activedRoute.params.subscribe(data => {
      this.comentario.id = data['id'];
      this.categoria = data['categoria'];
      this.comentario.puntos = data['calificacion'];
      this.origen = '/lista/' + this.categoria + '/' + this.comentario.id;
    });
  }

  getUserInfo() {
    this.authService.revisa().then((user: any) => {
      if (user) {
        if ( user.photoURL ) {
          this.comentario.url = user.photoURL;
        }
        this.comentario.usuario = user.displayName;
        this.infoReady = true;
        this.uid = user.uid;
        this.getComentario();
      }
      console.log(user);
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
    try {
      await this.presentLoading();
      const negSub = this.negocioService.getNegocio(this.comentario.id).subscribe(async (negocio: any) => {
        negSub.unsubscribe();
        this.comentario.nombre = negocio.nombre;
        this.comentario.urlNegocio = negocio.url[0];
        await this.usuarioService.publicarComentario(this.comentario, this.uid);
        this.loader.dismiss();
        this.presentAlertConfirm();
      });
    } catch (error) {
      this.loader.dismiss();
      this.presentAlertError(error);
    }
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Reseña publicada con éxito',
      message: `Muchas gracias ${this.comentario.usuario}, tu comentario será publicado y otros usuarios podrán conocer tu experiencia.
      Si quieres hacer un cambio pulsa Editar, de lo contrario Aceptar`,
      buttons: [
        {
          text: 'Editar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
            this.router.navigate(['/lista', this.categoria, this.comentario.id]);
          }
        }
      ]
    });

    await alert.present();
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

}
