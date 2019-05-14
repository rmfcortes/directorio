import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.page.html',
  styleUrls: ['./contenido.page.scss'],
})
export class ContenidoPage implements OnInit {

  constructor(private menu: MenuController) { 
    this.menu.enable(true, 'content1');
   }

  ngOnInit() {
  }

}
