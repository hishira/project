import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import { ParseValueInptuDirective } from './parse-value-input.directive';

describe('parse-value-input directive tests', () => {
  test('Should render', async () => {
    await render('<input crm-parse-value-input />', {
      imports: [ParseValueInptuDirective],
      providers: [NgControl],
    });
    expect(screen).toBeDefined();
  });

  test('Should not render', async () => {
    const promise = render('<div crm-parse-value-input /> <div>', {
      imports: [ParseValueInptuDirective],
      providers: [NgControl],
    });
    expect(promise).resolves.toThrowError(Error);
  });

  test('Directive should do it job', async () => {
    //TODO Check for directive function job
    const formControl = new FormControl();
    const dataVariable = 'dataPath';
    const { fixture } = await render(
      `<input crm-parse-value-input [formControl]="formControl" [dataVariable]="dataVariable" />`,
      {
        imports: [ParseValueInptuDirective, ReactiveFormsModule],
        providers: [NgControl],
        componentProperties: {
          formControl,
          dataVariable,
        },
      }
    );
    formControl.setValue({ dataPath: 'test' });
    formControl.updateValueAndValidity();
    fixture.detectChanges();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
      '[object Object]'
    );
  });
});
