import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaBazarPage } from './ficha-bazar.page';

describe('FichaBazarPage', () => {
  let component: FichaBazarPage;
  let fixture: ComponentFixture<FichaBazarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaBazarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaBazarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
