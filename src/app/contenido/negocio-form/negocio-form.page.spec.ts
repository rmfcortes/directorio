import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegocioFormPage } from './negocio-form.page';

describe('NegocioFormPage', () => {
  let component: NegocioFormPage;
  let fixture: ComponentFixture<NegocioFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegocioFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegocioFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
