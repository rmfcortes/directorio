import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoadingController, AlertController  } from '@ionic/angular';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  id: string;
  uid: string;
  categoria: string;
  origen: string;

  comentario = {
    comentario: '',
    puntos: null,
    fecha: new Date(),
    url: '',
    usuario: ''
  };

  infoReady = false;
  loader: any;

  constructor(private activedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private usuarioService: UsuarioService,
              private loadingCtrl: LoadingController,
              public alertController: AlertController) { }

  ngOnInit() {
    this.getParams();
    this.getUserInfo();
  }

  getParams() {
    this.activedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.comentario.puntos = data['calificacion'];
      this.origen = '/lista/' + this.categoria + '/' + this.id;
    });
  }

  getUserInfo() {
    this.authService.revisa().then((user: any) => {
      if (user) {
        this.comentario.url = user.photoURL;
        this.comentario.usuario = user.displayName;
        this.infoReady = true;
        this.uid = user.uid;
        this.getComentario();
      }
      console.log(user);
    });
  }

  getComentario() {
    const userSub = this.usuarioService.getComentario(this.uid, this.id).subscribe((data: any) => {
      userSub.unsubscribe();
      if (data) {
        this.comentario.comentario = data.comentario;
      }
    });
  }

  async publicarComentario() {
    await this.presentLoading();
    await this.usuarioService.publicarComentario(this.comentario, this.uid, this.id);
    this.loader.dismiss();
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
            this.router.navigate(['/lista', this.categoria, this.id]);
          }
        }
      ]
    });

    await alert.present();
  }

}
