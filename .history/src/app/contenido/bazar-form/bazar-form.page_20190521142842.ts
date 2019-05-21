import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bazar-form',
  templateUrl: './bazar-form.page.html',
  styleUrls: ['./bazar-form.page.scss'],
})
export class BazarFormPage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  regresar() {
    this.location.back();
  }

}
