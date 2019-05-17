import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleMaps, GoogleMap, Marker } from '@ionic-native/google-maps/ngx';
import { NegociosService } from 'src/app/services/negocios.service';
import { Environment } from '@ionic-native/google-maps';
import { RutasService } from 'src/app/services/rutas.service';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  map: GoogleMap;

  negocio: any;
  id: string;
  navegar: boolean;
  origen: string;
  infoReady: boolean;

  lat = 20.622894;
  lng = -103.415830;
  lat2 = 20.626197;
  lng2 = -103.408674;

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService,
              private rutaService: RutasService,
              private platform: Platform,
              private geolocation: Geolocation) { }

  async ngOnInit() {
    await this.platform.ready();
    this.getDatos();
  }

  ionViewDidEnter() {
    console.log('Did Enter');
    this.loadMap();

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
        this.origen = '/lista/' + this.negocio.categoria + '/' + this.negocio.id;
      });
    });
  }

  loadMap() {
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

    const marker: Marker = this.map.addMarkerSync({
      icon: 'red',
      animation: 'DROP',
      position: {
        lat: this.lat,
        lng: this.lng
      }
    });
    marker.showInfoWindow();
    if (this.navegar) {
      this.getRuta();
    }
  }

  async getRuta() {
    const ubicacion = await this.geolocation.getCurrentPosition();
    console.log(ubicacion);
    this.rutaService.getRuta(this.lat, this.lng, this.lat2, this.lng2)
      .then((puntos: any) => {
        console.log(puntos);
        this.map.addPolyline({
          points : puntos,
          color : '#ff4f38',
          width: 7,
          geodesic : false
          });
      })
      .catch(err => console.log(err));
  }

}
