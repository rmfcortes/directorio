import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegociosPage } from './negocios.page';

describe('NegociosPage', () => {
  let component: NegociosPage;
  let fixture: ComponentFixture<NegociosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegociosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegociosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
