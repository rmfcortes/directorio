import { Component, OnInit, Input, NgZone, ViewChild, ElementRef } from '@angular/core';
import { RutasService } from 'src/app/services/rutas.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MapsAPILoader, LatLngLiteral} from '@agm/core';
import { } from 'googlemaps';
import { Polygon } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  @Input() data;
  @ViewChild('txtHome') public searchElement: ElementRef;
  @ViewChild('polygono') public polygon: Polygon;

  infoReady: boolean;
  rutaReady = false;
  puntos = [];
  dir: string;

  zoom = 14;
  lat = 20.622894;
  lng = -103.415830;
  latMe: number;
  lngMe: number;

  paths: Array<LatLngLiteral> = [
    { lat: 20.646484, lng: -103.405841},
    { lat: 20.630761, lng: -103.435879},
    { lat: 20.607058, lng: -103.401536},
    { lat: 20.625923, lng: -103.385865},
    { lat: 20.641256, lng: -103.389539},
    { lat: 20.646484, lng: -103.405841},
  ];

  direccion: string;
  addDireccion = false;

  poly: any;

  constructor(private rutaService: RutasService,
              private geolocation: Geolocation,
              private ngZone: NgZone,
              private mapsAPILoader: MapsAPILoader,
              private toastController: ToastController,
              private modalCtrl: ModalController) { }

  async ngOnInit() {
  }

  async ionViewDidEnter() {
    this.getDatos();
  }

  async getDatos() {
    if (this.data) {
      this.lat = this.data.lat;
      this.lng = this.data.lng;
      return;
    } else {
      this.poly = new google.maps.Polygon({
        paths: [
          new google.maps.LatLng(20.646484, -103.405841),
          new google.maps.LatLng(20.630761, -103.435879),
          new google.maps.LatLng(20.607058, -103.401536),
          new google.maps.LatLng(20.625923, -103.385865),
          new google.maps.LatLng(20.641256, -103.389539),
          new google.maps.LatLng(20.646484, -103.405841),
        ]
      });
      setTimeout(() => {
        this.setAutocomplete();
      }, 1000);
    }
  }

  async navegar() {
    // const ubicacion = await this.geolocation.getCurrentPosition();
    const ubicacion = {
      coords: {
        latitude: 22.572358,
        longitude: -102.247675
      }
    };
    console.log(ubicacion);
    try {
      const puntos: any = await this.rutaService.getRuta(ubicacion.coords.latitude, ubicacion.coords.longitude, this.lat, this.lng);
      console.log(puntos);
      this.puntos = puntos;
      this.rutaReady = true;
    } catch (error) {
      console.log(error);
    }
  }

  setAutocomplete() {
    this.mapsAPILoader.load().then(async () => {
      const nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
      const autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
              // get the place result
              const place: google.maps.places.PlaceResult = autocomplete.getPlace();

              // verify result
              if (place.geometry === undefined || place.geometry === null) {
                  return;
              }
              // set latitude, longitude and zoom
              this.lat = place.geometry.location.lat();
              this.lng = place.geometry.location.lng();
              this.direccion = place.formatted_address;
              this.addDireccion = true;
              this.zoom = 18;
              console.log(google.maps.geometry.poly.containsLocation(place.geometry.location, this.poly));
              this.presentToast();
          });
      });
    });
  }

  guardarDireccion() {
    const dir =  {
      lat: this.lat,
      lng: this.lng,
      direccion: this.direccion
    };
    this.modalCtrl.dismiss({direccion: dir});
  }

  guardaLoc(evento) {
    this.lat = evento.coords.lat;
    this.lng = evento.coords.lng;
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Arrastra el pin rojo del mapa para mejorar la precisión de tu ubicación si es necesario.' +
      ' Si la posición es correcta, sólo da click en "GUARDAR"',
      buttons: [{
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

}
