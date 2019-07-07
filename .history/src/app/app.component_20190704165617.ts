import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UidService } from './services/uid.service';
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
    private uidService: UidService,
    private networkService: NetworkService,
    private router: Router,
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
      imageLoaderConfig.enableSpinner(false);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void { }
}
