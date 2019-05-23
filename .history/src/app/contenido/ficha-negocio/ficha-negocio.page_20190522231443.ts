import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform, AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

import { GoogleMaps, GoogleMap, Marker } from '@ionic-native/google-maps/ngx';
import { Environment } from '@ionic-native/google-maps';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { NegociosService } from 'src/app/services/negocios.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage implements OnInit {

  map: GoogleMap;

  categoria: string;
  id: string;
  origen: string;
  negocio: any;
  loader: any;
  infoReady = false;
  despliegueHorario = false;
  statusGral: string;
  status: string;

  valoraciones = {
    resumen: {
      cantidad: 0,
      promedio: 0,
    },
    comentarios: [{
      comentario: '',
      usuario: '',
      url: '',
      fecha: '',
      puntos: ''
    }]
  };

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  calificaciones = [
    {
    valor: 5,
    cantidad: 0,
    },
    {
    valor: 4,
    cantidad: 0,
    },
    {
    valor: 3,
    cantidad: 0,
    },
    {
    valor: 2,
    cantidad: 0,
    },
    {
    valor: 1,
    cantidad: 0,
    }
  ];

  opiniones = [];

  dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  categorias = 'resumen';
  puntuacion = 0;

  guardado = false;
  guardando = false;

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService,
              private authService: AuthService,
              private usuarioService: UsuarioService,
              private loadingCtrl: LoadingController,
              public alertController: AlertController,
              private callNumber: CallNumber,
              private datePipe: DatePipe,
              private router: Router,
              private platform: Platform) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.presentLoading();
    this.getDatos();
  }

  getDatos() {
    this.activatedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.origen = '/lista/' + this.categoria;
      const negSub = this.negocioService.getNegocio(this.id).subscribe(result => {
        this.negocio = result;
        console.log(this.negocio);
        negSub.unsubscribe();
        this.isFavorito();
      });
    });
  }

  async isFavorito() {
    try {
      const resp = await this.usuarioService.getFavorito(this.negocio.id);
      if (resp) {
        this.guardado = true;
      } else {
        this.guardado = false;
      }
    } catch (err) {
      this.presentAlertError(err);
    }
    // this.loadMap();
    this.getValoraciones();
  }

  /* loadMap() {
    Environment.setEnv({
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA',
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA'
    });
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {lat: this.negocio.lat, lng: this.negocio.lng},
        zoom: 16
      },
      controls: {
        compass: false,
        myLocationButton: false,
        zoom: false,
        mapToolbar: false,
        indoorPicker: false,
      }
    });

    const marker: Marker = this.map.addMarkerSync({
      icon: 'red',
      animation: 'DROP',
      position: {
        lat: this.negocio.lat,
        lng: this.negocio.lng
      }
    });
    marker.showInfoWindow();
    this.getValoraciones();
  } */

  

  getValoraciones() {
    const valorSub = this.negocioService.getValoraciones(this.id).subscribe( (data: any) => {
      this.valoraciones = data;
      valorSub.unsubscribe();
      this.getCantidadValoraciones();
    });
  }

  getCantidadValoraciones() {
    this.calificaciones.forEach( calificacion => {
      const listaFiltrada = Object.values(this.valoraciones.comentarios).filter( p => parseInt(p.puntos, 10) === calificacion.valor);
      calificacion.cantidad = listaFiltrada.length || 0.1;
    });
    this.getOpinionesMuestra();
  }

  getOpinionesMuestra() {
    this.opiniones = Object.values(this.valoraciones.comentarios).slice();
    this.opiniones.sort((a, b) => parseInt(b.puntos, 10) - parseInt(a.puntos, 10));
    this.opiniones = this.opiniones.slice(0, 3);
    this.isOpen();
  }

  isOpen() {
    const fecha = new Date();
    const dia = this.datePipe.transform(fecha, 'EEEE');
    const i = this.dias.indexOf(dia);
    if (!this.negocio.horario[i].activo) {
      this.status = 'Cerrado';
      this.statusGral = 'Cerrado';
      this.infoReady = true;
      this.loader.dismiss();
      return;
    }
    const horas = this.negocio.horario[i].horaApertura.split(':');
    const cierre = this.negocio.horario[i].horaCierre.split(':');
    const hora = horas[0];
    const min = horas[1];
    const chora = cierre[0];
    const cmin = cierre[1];
    const  aTime = fecha.setHours(parseInt(hora, 10), parseInt(min, 10));
    const  cTime = fecha.setHours(parseInt(chora, 10), parseInt(cmin, 10));
    let reapertura;
    let aCTime;
    let cierreComida;
    let cCTime;
    if (this.negocio.horario[i].reapertura) {
      reapertura = this.negocio.horario[i].reapertura.split(':');
      const horaC = reapertura[0];
      const minC = reapertura[1];
      aCTime = fecha.setHours(parseInt(horaC, 10), parseInt(minC, 10));
    }

    if (this.negocio.horario[i].cierreComida) {
      cierreComida = this.negocio.horario[i].cierreComida.split(':');
      const horaC = cierreComida[0];
      const minC = cierreComida[1];
      cCTime = fecha.setHours(parseInt(horaC, 10), parseInt(minC, 10));
    }
    if (this.negocio.horario[i].activo === true ) {
      const now = Date.now();
      if (now > aTime && now < cTime) {
        if (this.negocio.horario[i].comida) {
          if ( now > cCTime && now < aCTime) {
            this.status = `Cerrado. Abre: ${this.negocio.horario[i].reapertura}`;
            this.statusGral = 'Cerrado';
            this.infoReady = true;
            this.loader.dismiss();
            return;
          } else if ( now > aCTime) {
            const diferencia = cTime - now;
            if (diferencia < 3600000) {
              this.status = `Cierra pronto ${this.negocio.horario[i].horaCierre}`;
              this.statusGral = 'Abierto';
              this.infoReady = true;
              this.loader.dismiss();
              // clase alerta
              return;
            }
            this.status = 'Abierto';
            this.statusGral = 'Abierto';
          } else {
            const diferencia = cCTime - now;
            if (diferencia < 3600000) {
              this.status = `Cierra pronto ${this.negocio.horario[i].cierreComida}.
                            Abre nuevamente: ${this.negocio.horario[i].reapertura}`;
              this.statusGral = 'Abierto';
              this.infoReady = true;
              this.loader.dismiss();
              // clase alerta
              return;
            }
            this.status = 'Abierto';
            this.statusGral = 'Abierto';
          }
        } else {
          const diferencia = cTime - now;
          if (diferencia < 3600000) {
            this.status = `Cierra pronto ${this.negocio.horario[i].horaCierre}`;
            this.statusGral = 'Abierto';
            this.infoReady = true;
            this.loader.dismiss();
            // clase alerta
            return;
          }
          this.status = 'Abierto';
          this.statusGral = 'Abierto';
          this.infoReady = true;
          this.loader.dismiss();
        }
      } else {
        this.status = 'Cerrado';
        this.statusGral = 'Cerrado';
        this.infoReady = true;
        this.loader.dismiss();
      }
    }

  }

  llamar() {
    this.callNumber.callNumber(this.negocio.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async agregarFavorito() {
    this.guardando = true;
    const favorito = {
      nombre: this.negocio.nombre,
      url: this.negocio.url[0],
      descripcion: this.negocio.descripcion,
      id: this.negocio.id
    };
    try {
      await this.usuarioService.guardarFavorito(favorito);
      this.guardando = false;
      this.guardado = true;
    } catch (error) {
      this.guardando = false;
      this.presentAlertError(error);
    }
  }

  async rateChange(event) {
    const user: any = await this.authService.revisa();
    if (!user) {
      this.router.navigate(['/login', this.negocio.categoria, this.negocio.id, 'calificar', this.puntuacion]);
      return;
    }
    this.router.navigate(['/calificar', this.negocio.id, this.puntuacion]);
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
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
