import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioModalPage } from './horario-modal.page';

describe('HorarioModalPage', () => {
  let component: HorarioModalPage;
  let fixture: ComponentFixture<HorarioModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorarioModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
