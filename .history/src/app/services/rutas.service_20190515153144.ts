import { Injectable } from '@angular/core';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  API_KEY: string;
  API_URL: string;

  constructor(public http: HTTP) {
    this.API_KEY = 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA';
    this.API_URL = `https://maps.googleapis.com/maps/api/directions/json?key=${this.API_KEY}&`;
  }

  // origin=Disneyland&destination=Universal+Studios+Hollywood&key=
  getRuta(lat, lng, lat2, lng2) {

    const url = `${this.API_URL}origin=${lat},${lng}&destination=${lat2},${lng2}`;
    this.http.get(url, {}, {}).then(data => {
      console.log(data.status);
      console.log(data.data); // data received by server
      console.log(data.headers);
      console.log(JSON.parse(data.data));

      /* let decodedPoints = GoogleMaps.getPlugin().geometry.encoding.decodePath(
        // not sure if this is the exact path to the overview_polyline attribute...
        data.routes[0].overview_polyline.points;
        ); */
    });

  }
}
