import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaEmpleoPage } from './ficha-empleo.page';

describe('FichaEmpleoPage', () => {
  let component: FichaEmpleoPage;
  let fixture: ComponentFixture<FichaEmpleoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaEmpleoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaEmpleoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
