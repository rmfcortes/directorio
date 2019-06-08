import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GoogleMaps, GoogleMap, Marker, MarkerOptions, MarkerIcon } from '@ionic-native/google-maps/ngx';
import { NegociosService } from 'src/app/services/negocios.service';
import { Environment } from '@ionic-native/google-maps';
import { RutasService } from 'src/app/services/rutas.service';
import { Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  map: GoogleMap;
  loader: any;

  negocio: any;
  id: string;
  navegar: boolean;
  infoReady: boolean;

  lat = 20.622894;
  lng = -103.415830;
  lat2 = 20.626197;
  lng2 = -103.408674;

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService,
              private rutaService: RutasService,
              private platform: Platform,
              private geolocation: Geolocation,
              private loadingCtrl: LoadingController,
              private location: Location) { }

  async ngOnInit() {
    await this.platform.ready();
  }

  async ionViewDidEnter() {
    this.presentLoading();
    this.getDatos();
  }

  getDatos() {
    this.activatedRoute.params.subscribe(data => {
      this.id = data['id'];
      this.navegar = data['navegar'];
      const negSub = this.negocioService.getNegocio(this.id).subscribe(result => {
        this.negocio = result;
        console.log(this.negocio);
        this.infoReady = true;
        negSub.unsubscribe();
        this.loadMap();
      });
    });
  }

  async loadMap() {
    Environment.setEnv({
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA',
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA'
    });
    this.map = GoogleMaps.create('map', {
      camera: {
        target: {lat: this.lat, lng: this.lng},
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

    const icon: MarkerIcon = {
      url: 'assets/images/icono-localizador-tienda.png',
      size: {
        width: 32,
        height: 35
      }
    };

    const marker: Marker = await this.map.addMarker({
      position: {
        lat: this.negocio.lat,
        lng: this.negocio.lng
      },
      icon: icon
    });

    marker.showInfoWindow();

    if (this.navegar) {
      this.getRuta();
    } else {
      this.loader.dismiss();
    }
  }

  async getRuta() {
    const ubicacion = await this.geolocation.getCurrentPosition();
    const icon: MarkerIcon = {
      url: 'assets/images/person_pin_circle_black_192x192.png',
      size: {
        width: 32,
        height: 35
      }
    };
    await this.map.addMarker({
      position: {
        lat: ubicacion.coords.latitude,
        lng: ubicacion.coords.longitude
      },
      icon: icon
    });
    console.log(ubicacion);
    this.rutaService.getRuta(ubicacion.coords.latitude, ubicacion.coords.longitude, this.negocio.lat, this.negocio.lng)
      .then((puntos: any) => {
        console.log(puntos);
        this.map.addPolyline({
          points : puntos,
          color : '#ff4f38',
          width: 7,
          geodesic : false
          });
        this.loader.dismiss();
      })
      .catch(err => console.log(err));
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

  regresar() {
    this.location.back();
  }

}
