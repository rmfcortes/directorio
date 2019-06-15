import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public netStatus = true;

  constructor(private network: Network) { }

  initNetWatch() {
      // watch network for a disconnection
    this.network.onDisconnect().subscribe(() => {
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          this.netStatus = false;
        }
      }, 3000);
    });

    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      setTimeout(() => {
        this.netStatus = true;
      }, 1000);
    });
  }
}
