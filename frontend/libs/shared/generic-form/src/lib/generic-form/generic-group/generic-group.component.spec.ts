import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { GenericGroupComponent } from './generic-group.component';

import { FormControl, FormGroup } from '@angular/forms';
import { GenericEdit, GenericInput } from '../types';

export const GroupLabelExample = 'Example group label';
export const GenericInputLabel1 = 'Text label 1';
export const GenericInputLabel2 = 'Text label 2';
export const GenericInput1: GenericInput = {
  type: 'text',
  validators: [],
  formControlName: 'test',
  label: GenericInputLabel1,
  placeholder: '',
  cols: '2',
};
export const GenericInput2: GenericInput = {
  type: 'selectable',
  validators: [],
  formControlName: 'test1',
  label: GenericInputLabel2,
  placeholder: '',
  useSelectablePipe: false,
  selectableValues: ['Test 1', 'Test 2','Test 3'],
  cols: '2',
};
export const GetGenericFormGroup = (): FormGroup => {
    return new FormGroup({
        test: new FormControl(null),
        test1: new FormControl(null)
    })
}
export const GenericGroupExample: GenericEdit = {
  group: {
    label: GroupLabelExample,
    groupName: 'general',
  },
  rowHeight: '100px',
  inputs: [GenericInput1, GenericInput2],
};


describe('Generic group tests', () => {
  test('Should render component', async () => {
    const newFormGroup = GetGenericFormGroup();
    await render(GenericGroupComponent, {
      componentInputs: {
        genericEditGroup: GenericGroupExample,
        groupForm: newFormGroup,
      },
    });

    expect(screen).toBeDefined();
  });

  test('Should has proper label for group', async () => {
    const newFormGroup = GetGenericFormGroup();
    await render(GenericGroupComponent, {
      componentInputs: {
        genericEditGroup: GenericGroupExample,
        groupForm: newFormGroup,
      },
    });
    expect(screen.getByText(GroupLabelExample)).toBeDefined();
  });
  test('Should has proper label for first input', async () => {
    const newFormGroup = GetGenericFormGroup();
    await render(GenericGroupComponent, {
      componentInputs: {
        genericEditGroup: GenericGroupExample,
        groupForm: newFormGroup,
      },
    });

    expect(screen.getByText(GenericInputLabel1)).toBeDefined();
  });
  test('Should has proper label for second input', async () => {
    const newFormGroup = GetGenericFormGroup();
    await render(GenericGroupComponent, {
      componentInputs: {
        genericEditGroup: GenericGroupExample,
        groupForm: newFormGroup,
      },
    });

    expect(screen.getByText(GenericInputLabel2)).toBeDefined();
  });

  test('Should has input type test', async () => {
    const newFormGroup = GetGenericFormGroup();
    await render(GenericGroupComponent, {
      componentInputs: {
        genericEditGroup: GenericGroupExample,
        groupForm: newFormGroup,
      },
    });

    expect(screen.getByRole('textbox')).toBeDefined();
  });

  test('Should has combobox', async () => {
    const newFormGroup = GetGenericFormGroup();
    await render(GenericGroupComponent, {
      componentInputs: {
        genericEditGroup: GenericGroupExample,
        groupForm: newFormGroup,
      },
    });

    expect(screen.getByRole('combobox')).toBeDefined();
  });

  test('Checnge input should trigger changeing formgroup first constorl', async () => {
    const newFormGroup = GetGenericFormGroup();
    await render(GenericGroupComponent, {
      componentInputs: {
        genericEditGroup: GenericGroupExample,
        groupForm: newFormGroup,
      },
    });

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'Test');
    expect(newFormGroup.value.test).toBe('Test');
  });

  test('Checnge combobox should trigger changeing formgroup second constorl', async () => {
    const newFormGroup = GetGenericFormGroup();
    await render(GenericGroupComponent, {
      componentInputs: {
        genericEditGroup: GenericGroupExample,
        groupForm: newFormGroup,
      },
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getAllByRole('option')[1]);
    expect(newFormGroup.value.test1).toBe('Test 1');
  });
});
