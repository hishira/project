import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { GenericForm } from './generic-form';

describe('GenericForm', () => {
  let component: GenericForm;
  let fixture: ComponentFixture<GenericForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericForm],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericForm);
    fixture.componentRef.setInput('genericEditInfo', []);
    fixture.componentRef.setInput('formGroup', new FormGroup({}));
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
