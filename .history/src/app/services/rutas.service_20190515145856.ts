import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  API_KEY: string;
  API_URL: string;

  constructor(public http: HttpClient) {
    this.API_KEY = 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA';
    this.API_URL = `https://maps.googleapis.com/maps/api/directions/json?key=${this.API_KEY}&`;
  }

  // origin=Disneyland&destination=Universal+Studios+Hollywood&key=
  getRuta(lat, lng, lat2, lng2) {

    const headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
     let options = new RequestOptions({ headers:headers,withCredentials: true});

    const url = `${this.API_URL}origin=${lat},${lng}&destination=${lat2},${lng2}`;
    this.http.get(url).subscribe(response => {
      console.log(response);
    });

  }
}
