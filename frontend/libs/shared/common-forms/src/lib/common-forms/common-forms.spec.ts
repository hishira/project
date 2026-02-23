import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonForms } from './common-forms';

describe('CommonForms', () => {
  let component: CommonForms;
  let fixture: ComponentFixture<CommonForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonForms],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonForms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
