import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { GenericInputComponent } from './generic-input.component';
import { Validators } from '@angular/forms';
import { of } from 'rxjs';
import { ControlData, FetchingAutoCompleteSerivce } from 'common-forms';
import { GenericInput } from '../types';

export const TestData = 'Test';
export const TestData1 = 'Test 1';
export const TestData2 = 'Test 2';
export const TestData3 = 'Test 3';
export const TestObject = {
  id: 'test',
  value: 'test',
  equals: function (value: ControlData) {
    return typeof value === 'object'
      ? value?.id === this.id
      : value === this.value;
  },
};
export const TestObject1 = {
  id: 'test 1',
  value: 'test',
  equals: function (value: ControlData) {
    return typeof value === 'object'
      ? value?.id === this.id
      : value === this.value;
  },
};
export const TestObject2 = {
  id: 'test 2',
  value: 'test',
  equals: function (value: ControlData) {
    return typeof value === 'object'
      ? value?.id === this.id
      : value === this.value;
  },
};
export const TestObject3 = {
  id: 'test 3',
  value: 'test',
  equals: function (value: ControlData) {
    return typeof value === 'object'
      ? value?.id === this.id
      : value === this.value;
  },
};

export const TestViewData = {
  viewData: TestData,
  controlData: TestObject,
};
export const TestViewData1 = {
  viewData: TestData1,
  controlData: TestObject1,
};
export const TestViewData2 = {
  viewData: TestData2,
  controlData: TestObject2,
};
export const TestViewData3 = {
  viewData: TestData3,
  controlData: TestObject3,
};
export const TestAutoCompleteDataArray = [
  {
    getViewDate: () => TestViewData,
  },
  {
    getViewDate: () => TestViewData1,
  },
  {
    getViewDate: () => TestViewData2,
  },
  {
    getViewDate: () => TestViewData3,
  },
];

export const TextInputProperties = {
  type: 'text',
  validators: [],
  formControlName: 'assistant',
  label: 'Asystent klienta',
  placeholder: '',
  cols: '2',
};

export const TextInputPropertiesWithValidator = {
  ...TextInputProperties,
  validators: [Validators.email],
};
export const AddressInputProperties = {
  type: 'address',
  validators: [],
  formControlName: 'address',
  addressObjectValidator: {
    street: [Validators.required],
    city: [Validators.required],
    country: [Validators.required],
  },
  label: '',
  placeholder: '',
  cols: '4',
};

export const SelectableValues = ['Test', 'Test 1', 'Test 2', 'Test 3'];
export const SelectableInputLabel = 'Test label';
export const SelectableInputProperties: GenericInput = {
  type: 'selectable',
  validators: [],
  formControlName: 'selectable',
  label: SelectableInputLabel,
  placeholder: '',
  cols: '4',
  useSelectablePipe: false,
  selectableValues: SelectableValues,
};
export const ChipSelectableInputLabel = 'Test chip label';
export const ChipSelectableInputProperties: GenericInput = {
  type: 'chip-selectable',
  formControlName: 'serviceTypes',
  label: ChipSelectableInputLabel,
  placeholder: '',
  cols: '2',
};
export const AutoCompleteGenericLabel = 'Test autocomplete label';
export const AutocompleteExampleFetchingService: FetchingAutoCompleteSerivce = {
  getData() {
    return of(TestAutoCompleteDataArray);
  },
};
export const AutoCompleteGenerigInputProperties: GenericInput = {
  type: 'autocomplete',
  validators: [],
  formControlName: 'opiekun',
  label: AutoCompleteGenericLabel,
  placeholder: '',
  fetchingService: AutocompleteExampleFetchingService,
  cols: '2',
};

//TODO testy po 12.10
describe('Generic input', () => {
  test('Should render component', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: TextInputProperties as any,
      },
    });
    expect(screen).toBeDefined();
  });
  test('Component should has input', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: TextInputProperties as any,
      },
    });
    expect(screen.getByRole('textbox')).toBeDefined();
  });
  test("Component should has propper 'Asysten klienta' label", async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: TextInputProperties as any,
      },
    });
    expect(screen.getByText('Asystent klienta')).toBeInTheDocument();
  });
  test('Input should has proper type text', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: TextInputProperties as any,
      },
    });
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });
  test('Input change should change form value', async () => {
    const user = userEvent.setup();
    const { fixture } = await render(GenericInputComponent, {
      inputs: {
        genericInput: TextInputProperties as any,
      },
    });
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    const controlValue = fixture.componentInstance.formControl.value;
    expect(controlValue).toBe('test');
  });
  test('Should validation work', async () => {
    const user = userEvent.setup();
    const { fixture } = await render(GenericInputComponent, {
      inputs: {
        genericInput: TextInputPropertiesWithValidator as any,
      },
    });
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    const errors = fixture.componentInstance.formControl.errors;
    expect(errors).toHaveProperty('email');
  });
  test('Address generic input', async () => {
    // Not necessary to test all address possibility, all aspects of address should
    // be tested in address component
    const user = userEvent.setup();

    const { fixture } = await render(GenericInputComponent, {
      inputs: {
        genericInput: AddressInputProperties as any,
      },
    });
    const input = screen.getAllByRole('textbox');
    //Test 'Ulica i nr' input
    await user.type(input[0], 'Manhatan');
    const controlValue = fixture.componentInstance.formControl.value;
    const errors = fixture.componentInstance.formControl.errors;
    expect(input).toHaveLength(6);
    expect(controlValue).toHaveProperty('street');
    expect(errors).toHaveProperty('addressError');
    expect(screen).toBeDefined();
  });

  test('Selectable generic input should proper label', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: SelectableInputProperties,
      },
    });

    expect(screen.getByText(SelectableInputLabel)).toBeDefined();
  });

  test('Selectable generic input should has combobox', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: SelectableInputProperties,
      },
    });

    expect(screen.getByRole('combobox')).toBeDefined();
  });

  test('Selectable should hase proper option elements', async () => {
    const user = userEvent.setup();
    await render(GenericInputComponent, {
      inputs: {
        genericInput: SelectableInputProperties,
      },
    });

    await user.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(
      SelectableValues.length + 1
    ); // includes null
  });

  test('Chip selectable should has proper label', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: ChipSelectableInputProperties,
      },
    });

    expect(screen.getByText(ChipSelectableInputLabel)).toBeDefined();
  });

  test('Chip selectable should has combobox element', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: ChipSelectableInputProperties,
      },
    });

    expect(screen.getByRole('combobox')).toBeDefined();
  });

  test('Chip selectable should has options element', async () => {
    const user = userEvent.setup();
    await render(GenericInputComponent, {
      inputs: {
        genericInput: ChipSelectableInputProperties,
      },
    });
    await user.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toBeDefined();
  });

  test('Autocomplete generic input should has proper label', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: AutoCompleteGenerigInputProperties,
      },
    });
    expect(screen.getByText(AutoCompleteGenericLabel)).toBeDefined();
  });
  test('Autocomplete generic input should has combobox control', async () => {
    await render(GenericInputComponent, {
      inputs: {
        genericInput: AutoCompleteGenerigInputProperties,
      },
    });
    expect(screen.getByRole('combobox')).toBeDefined();
  });
  test('Autocomplete generic input should has options control', async () => {
    const user = userEvent.setup();
    await render(GenericInputComponent, {
      inputs: {
        genericInput: AutoCompleteGenerigInputProperties,
      },
    });
    await user.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toBeDefined();
  });
});
