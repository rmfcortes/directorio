import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPasillosPage } from './lista-pasillos.page';

describe('ListaPasillosPage', () => {
  let component: ListaPasillosPage;
  let fixture: ComponentFixture<ListaPasillosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPasillosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPasillosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
