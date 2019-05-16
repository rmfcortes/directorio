import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  API_KEY: string;
  API_URL: string;

  constructor() {
    this.API_KEY = 'AIzaSyAFtykUh1rRQOUyqSWHn4lLt1yaNZedXGA';
    this.API_URL = `https://maps.googleapis.com/maps/api/directions/json?key=${this.API_KEY}&`;
  }

  getRuta(lat, lng) {
    const url = ``
  }
}
