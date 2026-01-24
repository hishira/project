import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserGeneralInformation } from './edit-user-general-information';

describe('EditUserGeneralInformation', () => {
  let component: EditUserGeneralInformation;
  let fixture: ComponentFixture<EditUserGeneralInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserGeneralInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserGeneralInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
