import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GoogleMaps, GoogleMap, Marker, MarkerOptions, MarkerIcon } from '@ionic-native/google-maps/ngx';
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

  navegar: string;
  infoReady: boolean;

  lat = 20.622894;
  lng = -103.415830;

  constructor(private activatedRoute: ActivatedRoute,
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

  async getDatos() {
    this.activatedRoute.params.subscribe(async (data) => {
      this.lat = data['lat'];
      this.lng = data['lng'];
      this.loadMap();
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
        lat: this.lat,
        lng: this.lng
      },
      icon: icon
    });

    marker.showInfoWindow();

    this.infoReady = true;
    this.loader.dismiss();
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
    this.rutaService.getRuta(ubicacion.coords.latitude, ubicacion.coords.longitude, this.lat, this.lng)
      .then((puntos: any) => {
        console.log(puntos);
        this.map.addPolyline({
          points : puntos,
          color : '#ff4f38',
          width: 7,
          geodesic : false
          });
        this.infoReady = true;
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
