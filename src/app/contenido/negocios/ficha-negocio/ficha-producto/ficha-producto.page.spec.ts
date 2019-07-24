import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaProductoPage } from './ficha-producto.page';

describe('FichaProductoPage', () => {
  let component: FichaProductoPage;
  let fixture: ComponentFixture<FichaProductoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaProductoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
