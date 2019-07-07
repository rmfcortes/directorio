import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { NetworkService } from './services/network.service';
import { ImageLoaderConfigService } from 'ionic-image-loader';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private networkService: NetworkService,
    private imageLoaderConfig: ImageLoaderConfigService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.networkService.initNetWatch();
      this.authService.revisa();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.imageLoaderConfig.enableSpinner(false);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void { }
}
