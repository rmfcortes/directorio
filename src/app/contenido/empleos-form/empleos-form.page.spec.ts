import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleosFormPage } from './empleos-form.page';

describe('EmpleosFormPage', () => {
  let component: EmpleosFormPage;
  let fixture: ComponentFixture<EmpleosFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpleosFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleosFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
