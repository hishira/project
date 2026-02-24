// import { render, screen } from '@testing-library/angular';
// import userEvent from '@testing-library/user-event';
// import { TestFetchingAutoCompleteService } from '../../../../tests/consts/autocomplete-component.consts';
// import { TestObject } from '../../../../tests/consts/shared.consts';
// import { TestUtils } from '../../../../tests/utils/TestUtils';
// import { AutocompleteComponent } from './autocomplete.component';
// //TODO testy po 12.10
// describe('Autocomplete component tests', () => {
//   test('Should render component', async () => {
//     await render(AutocompleteComponent);
//     expect(screen).toBeDefined();
//   });

//   test('With label input shoud render proper label', async () => {
//     await render(AutocompleteComponent, {
//       componentInputs: {
//         label: 'Test label',
//       },
//     });

//     expect(screen.getByText('Test label')).toBeDefined();
//   });

//   test('Default should not see any option', async () => {
//     await render(AutocompleteComponent);

//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     expect(screen.queryAllByRole('option')).toHaveLength(0);
//   });

//   test('Should show correct option provider by input service', async () => {
//     await render(AutocompleteComponent, {
//       componentInputs: {
//         fetchingService: TestFetchingAutoCompleteService,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     expect(screen.queryAllByRole('option')).toHaveLength(4);
//   });

//   test('Should use getData function from input service', async () => {
//     const spyer = jest.spyOn(TestFetchingAutoCompleteService, 'getData');
//     await render(AutocompleteComponent, {
//       componentInputs: {
//         fetchingService: TestFetchingAutoCompleteService,
//       },
//     });
//     expect(spyer).toBeCalled();
//   });

//   test('Should run onChange function when some of option is selected', async () => {
//     const { fixture } = await render(AutocompleteComponent, {
//       componentInputs: {
//         fetchingService: TestFetchingAutoCompleteService,
//       },
//     });
//     const spyer = jest.spyOn(fixture.componentInstance, 'onChange');
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     await user.click(screen.queryAllByRole('option')[0]);
//     expect(spyer).toBeCalled();
//   });

//   test('Control value after selection from option should be proper value', async () => {
//     const { fixture } = await render(AutocompleteComponent, {
//       componentInputs: {
//         fetchingService: TestFetchingAutoCompleteService,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     await user.click(screen.queryAllByRole('option')[0]);
//     const controlValues = fixture.componentInstance.formControl.value;
//     TestUtils.hasObjectProperProperties(controlValues, 'id', 'value');
//     TestUtils.testObjectCorrespond(controlValues, TestObject);
//   });
// });

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { vi } from 'vitest';

// Angular Material modules
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Testowany komponent i zależności
import { AutocompleteComponent } from './autocomplete.component';
import { ParseValueInptuDirective } from '../directives/parse-value-input.directive';

// Mock danych – implementacja interfejsu AutocomepleteDataView
const mockOptions = [
  {
    getViewDate: () => ({ viewData: 'Warszawa', controlData: { id: 1, name: 'Warszawa' } }),
  },
  {
    getViewDate: () => ({ viewData: 'Kraków', controlData: { id: 2, name: 'Kraków' } }),
  },
  {
    getViewDate: () => ({ viewData: 'Gdańsk', controlData: { id: 3, name: 'Gdańsk' } }),
  },
];

// Mock serwisu dostarczającego dane
const mockFetchingService = {
  getData: () => of(mockOptions),
};

describe('AutocompleteComponent', () => {
  // Funkcja pomocnicza do renderowania komponentu z domyślnymi importami
  const setup = async (inputs: Partial<AutocompleteComponent> = {}) => {
    const view = await render(AutocompleteComponent, {
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,         // wyłączenie animacji – kluczowe dla Material
        ParseValueInptuDirective,     // zakładając, że ścieżka jest poprawna
      ],
      componentInputs: {
        ...inputs,
      },
    });
    return { ...view, user: userEvent.setup() };
  };

  it('powinien renderować komponent z domyślnymi właściwościami', async () => {
    await setup();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('powinien wyświetlić podaną etykietę (label)', async () => {
    await setup({ label: 'Testowa etykieta' });
    expect(screen.getByText('Testowa etykieta')).toBeInTheDocument();
  });

  it('nie powinien pokazywać żadnych opcji, gdy nie dostarczono serwisu', async () => {
    const { user } = await setup();
    const input = screen.getByRole('combobox');
    await user.click(input);
    // Nawet po kliknięciu opcje nie powinny się pojawić
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('powinien pokazać opcje z serwisu po kliknięciu', async () => {
    const { user } = await setup({ fetchingService: mockFetchingService });
    const input = screen.getByRole('combobox');
    await user.click(input);

    // Oczekujemy na pojawienie się opcji (asynchroniczne ładowanie)
    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Warszawa');
  });

  it('powinien filtrować opcje na podstawie wpisywanego tekstu', async () => {
    const { user } = await setup({ fetchingService: mockFetchingService });
    const input = screen.getByRole('combobox');
    await user.click(input);

    // Upewniamy się, że opcje się załadowały
    await screen.findByText('Warszawa');

    // Wpisujemy fragment nazwy
    await user.type(input, 'kra');

    // Powinna pozostać tylko opcja "Kraków"
    const options = await screen.findAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Kraków');
  });

  it('po wybraniu opcji powinien wywołać onChange i output valueChange', async () => {
    const onChangeMock = vi.fn();
    const onValueChangeMock = vi.fn();
    const { fixture, user } = await setup({ fetchingService: mockFetchingService });

    // Rejestrujemy mocki
    fixture.componentInstance.registerOnChange(onChangeMock);
    fixture.componentInstance.valueChange.subscribe(onValueChangeMock);

    const input = screen.getByRole('combobox');
    await user.click(input);
    const options = await screen.findAllByRole('option');
    await user.click(options[0]); // wybór "Warszawa"

    // Sprawdzamy, czy wartości zostały przekazane
    expect(onChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Warszawa' })
    );
    expect(onValueChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Warszawa' })
    );
    // Dodatkowo formControl powinien mieć wybraną wartość
    expect(fixture.componentInstance.formControl.value).toEqual(
      expect.objectContaining({ id: 1, name: 'Warszawa' })
    );
  });

  it('powinien ustawić wartość przez writeValue', async () => {
    const { fixture } = await setup();
    const testValue = { id: 5, name: 'Poznań' };
    fixture.componentInstance.writeValue(testValue);
    expect(fixture.componentInstance.formControl.value).toEqual(testValue);
  });

  it('powinien wywołać onTouch po opuszczeniu pola (blur)', async () => {
    const onTouchMock = vi.fn();
    const { fixture, user } = await setup();

    fixture.componentInstance.registerOnTouched(onTouchMock);
    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.tab(); // symulacja utraty focusa

    expect(onTouchMock).toHaveBeenCalled();
  });
});