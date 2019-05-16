import { Component, Input, OnInit } from '@angular/core';
import { Environment } from '@ionic-native/google-maps/ngx';
import { GoogleMap, GoogleMaps } from '@ionic-native/google-maps';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.scss'],
})
export class ModalMapComponent implements OnInit {

  @Input() destino: any;
  map: GoogleMap;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.loadMap();
    console.log(this.destino);
  }

  loadMap() {
    Environment.setEnv({
      API_KEY_FOR_BROWSER_DEBUG: 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA',
      API_KEY_FOR_BROWSER_RELEASE: 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA'
    });
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {lat: this.destino.lat, lng: this.destino.lng},
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
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
