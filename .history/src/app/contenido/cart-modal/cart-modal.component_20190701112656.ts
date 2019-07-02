import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {

  @Input() cart;
  @Input() cuenta;

  constructor() { }

  ngOnInit() {}

}
