import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMaps, GoogleMap, Marker, LatLng } from '@ionic-native/google-maps/ngx';
import { NegociosService } from 'src/app/services/negocios.service';
import { LoadingController, Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Environment } from '@ionic-native/google-maps';

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
    cantidad: 0,
    promedio: 0,
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

  dias = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService,
              private loadingCtrl: LoadingController,
              private datePipe: DatePipe,
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
        this.infoReady = true;
        negSub.unsubscribe();
        // this.loadMap();
        this.getValoraciones();
      });
    });
  }

  loadMap() {
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
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

  getValoraciones() {
    const valorSub = this.negocioService.getValoraciones(this.id).subscribe( (data: any) => {
      this.valoraciones = data;
      console.log(this.valoraciones);
      valorSub.unsubscribe();
      this.getCantidadValoraciones();
    });
  }

  getCantidadValoraciones() {
    this.calificaciones.forEach( calificacion => {
      const listaFiltrada = this.valoraciones.comentarios.filter( p => parseInt(p.puntos, 10) === calificacion.valor);
      console.log(listaFiltrada);
      calificacion.cantidad = listaFiltrada.length;
    });
    this.isOpen();
  }

  isOpen() {
    const fecha = new Date();
    const dia = this.datePipe.transform(fecha, 'EEEE');
    const i = this.dias.indexOf(dia);
    if (!this.negocio.horario[i].activo) {
      this.status = 'Cerrado';
      this.statusGral = 'Cerrado';
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
            this.loader.dismiss();
            return;
          } else if ( now > aCTime) {
            const diferencia = cTime - now;
            if (diferencia < 3600000) {
              this.status = `Cierra pronto ${this.negocio.horario[i].horaCierre}`;
              this.statusGral = 'Abierto';
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
            this.loader.dismiss();
            // clase alerta
            return;
          }
          this.status = 'Abierto';
          this.statusGral = 'Abierto';
          this.loader.dismiss();
        }
      } else {
        this.status = 'Cerrado';
        this.statusGral = 'Cerrado';
        this.loader.dismiss();
      }
    }

  }

}
