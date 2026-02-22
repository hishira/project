// import { render, screen } from '@testing-library/angular';
// import userEvent from '@testing-library/user-event';
// import {
//   AddressInputProperties,
//   AutoCompleteGenericLabel,
//   AutoCompleteGenerigInputProperties,
//   ChipSelectableInputLabel,
//   ChipSelectableInputProperties,
//   SelectableInputLabel,
//   SelectableInputProperties,
//   SelectableValues,
//   TextInputProperties,
//   TextInputPropertiesWithValidator,
// } from '../../../../../tests/consts/generic-input.consts';
// import { GenericInputComponent } from './generic-input.component';

// //TODO testy po 12.10
// describe('Generic input', () => {
//   test('Should render component', async () => {
//     await render(GenericInputComponent, {
//       componentProperties: {
//         genericInput: TextInputProperties as any,
//       },
//     });
//     expect(screen).toBeDefined();
//   });
//   test('Component should has input', async () => {
//     await render(GenericInputComponent, {
//       componentProperties: {
//         genericInput: TextInputProperties as any,
//       },
//     });
//     expect(screen.getByRole('textbox')).toBeDefined();
//   });
//   test("Component should has propper 'Asysten klienta' label", async () => {
//     await render(GenericInputComponent, {
//       componentProperties: {
//         genericInput: TextInputProperties as any,
//       },
//     });
//     expect(screen.getByText('Asystent klienta')).toBeInTheDocument();
//   });
//   test('Input should has proper type text', async () => {
//     await render(GenericInputComponent, {
//       componentProperties: {
//         genericInput: TextInputProperties as any,
//       },
//     });
//     expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
//   });
//   test('Input change should change form value', async () => {
//     const user = userEvent.setup();
//     const { fixture } = await render(GenericInputComponent, {
//       componentProperties: {
//         genericInput: TextInputProperties as any,
//       },
//     });
//     const input = screen.getByRole('textbox');
//     await user.type(input, 'test');
//     const controlValue = fixture.componentInstance.formControl.value;
//     expect(controlValue).toBe('test');
//   });
//   test('Should validation work', async () => {
//     const user = userEvent.setup();
//     const { fixture } = await render(GenericInputComponent, {
//       componentProperties: {
//         genericInput: TextInputPropertiesWithValidator as any,
//       },
//     });
//     const input = screen.getByRole('textbox');
//     await user.type(input, 'test');
//     const errors = fixture.componentInstance.formControl.errors;
//     expect(errors).toHaveProperty('email');
//   });
//   test('Address generic input', async () => {
//     // Not necessary to test all address possibility, all aspects of address should
//     // be tested in address component
//     const user = userEvent.setup();

//     const { fixture } = await render(GenericInputComponent, {
//       componentProperties: {
//         genericInput: AddressInputProperties as any,
//       },
//     });
//     const input = screen.getAllByRole('textbox');
//     //Test 'Ulica i nr' input
//     await user.type(input[0], 'Manhatan');
//     const controlValue = fixture.componentInstance.formControl.value;
//     const errors = fixture.componentInstance.formControl.errors;
//     expect(input).toHaveLength(6);
//     expect(controlValue).toHaveProperty('street');
//     expect(errors).toHaveProperty('addressError');
//     expect(screen).toBeDefined();
//   });

//   test('Selectable generic input should proper label', async () => {
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: SelectableInputProperties,
//       },
//     });

//     expect(screen.getByText(SelectableInputLabel)).toBeDefined();
//   });

//   test('Selectable generic input should has combobox', async () => {
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: SelectableInputProperties,
//       },
//     });

//     expect(screen.getByRole('combobox')).toBeDefined();
//   });

//   test('Selectable should hase proper option elements', async () => {
//     const user = userEvent.setup();
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: SelectableInputProperties,
//       },
//     });

//     await user.click(screen.getByRole('combobox'));
//     expect(screen.getAllByRole('option')).toHaveLength(
//       SelectableValues.length + 1
//     ); // includes null
//   });

//   test('Chip selectable should has proper label', async () => {
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: ChipSelectableInputProperties,
//       },
//     });

//     expect(screen.getByText(ChipSelectableInputLabel)).toBeDefined();
//   });

//   test('Chip selectable should has combobox element', async () => {
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: ChipSelectableInputProperties,
//       },
//     });

//     expect(screen.getByRole('combobox')).toBeDefined();
//   });

//   test('Chip selectable should has options element', async () => {
//     const user = userEvent.setup();
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: ChipSelectableInputProperties,
//       },
//     });
//     await user.click(screen.getByRole('combobox'));
//     expect(screen.getAllByRole('option')).toBeDefined();
//   });

//   test('Autocomplete generic input should has proper label', async () => {
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: AutoCompleteGenerigInputProperties,
//       },
//     });
//     expect(screen.getByText(AutoCompleteGenericLabel)).toBeDefined();
//   });
//   test('Autocomplete generic input should has combobox control', async () => {
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: AutoCompleteGenerigInputProperties,
//       },
//     });
//     expect(screen.getByRole('combobox')).toBeDefined();
//   });
//   test('Autocomplete generic input should has options control', async () => {
//     const user = userEvent.setup();
//     await render(GenericInputComponent, {
//       componentInputs: {
//         genericInput: AutoCompleteGenerigInputProperties,
//       },
//     });
//     await user.click(screen.getByRole('combobox'));
//     expect(screen.getAllByRole('option')).toBeDefined();
//   });
// });
