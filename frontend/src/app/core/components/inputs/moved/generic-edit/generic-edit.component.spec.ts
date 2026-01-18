// import { render, screen } from '@testing-library/angular';
// import {
//   FirstGroupFirstInputLabel,
//   FirstGroupLabel,
//   FirstGroupSecondInputLabel,
//   GenericEditInfo,
//   GetFormGroup,
//   SecondGroupFirstInputLabel,
//   SecondGroupLabel,
//   SecondGroupsecondInputLabel,
// } from '../../../../tests/consts/generic-edit.consts';
// import { GenericEditComponent } from './generic-edit.component';
// import userEvent from '@testing-library/user-event';

// describe('Generic edit component  tests', () => {
//   test('Component should render', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });

//     expect(screen).toBeDefined();
//   });

//   test('First group should has proper label', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });

//     expect(screen.getByText(FirstGroupLabel)).toBeDefined();
//   });

//   test('Second group should has proper label', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });

//     expect(screen.getByText(SecondGroupLabel)).toBeDefined();
//   });

//   test('First group first input should has proper label', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });

//     expect(screen.getByText(FirstGroupFirstInputLabel)).toBeDefined();
//   });

//   test('First group second input should has proper label', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });

//     expect(screen.getByText(FirstGroupSecondInputLabel)).toBeDefined();
//   });

//   test('Second group first input should has proper label', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });

//     expect(screen.getByText(SecondGroupFirstInputLabel)).toBeDefined();
//   });

//   test('Second group second input should has proper label', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });

//     expect(screen.getByText(SecondGroupsecondInputLabel)).toBeDefined();
//   });

//   test('Component should has 2 text inputs', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });
//     expect(screen.getAllByRole('textbox')).toHaveLength(2);
//   });

//   test('Component should has 2 combobox elements', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });
//     expect(screen.getAllByRole('combobox')).toHaveLength(2);
//   });
//   test('Change first input shuld change formcontrol in firstformgroup', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });
//     const user = userEvent.setup();
//     await user.type(screen.getAllByRole('textbox')[0], 'Test');
//     expect(formGroup.value.first.testgroup1).toBe('Test');
//   });
//   test('Change second input shuld change formcontrol in firstformgroup', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });
//     const user = userEvent.setup();
//     await user.type(screen.getAllByRole('textbox')[1], 'Testek');
//     expect(formGroup.value.second.testgroup3).toBe('Testek');
//   });
//   test('Click on first combobox should open option', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getAllByRole('combobox')[0]);
//     expect(screen.getAllByRole('option').length > 0).toBe(true);
//   });
//   test('Click on second combobox should show option', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getAllByRole('combobox')[1]);
//     expect(screen.getAllByRole('option').length > 0).toBe(true);
//   });
//   test('Click on option in first combobox should change control value in group', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getAllByRole('combobox')[0]);
//     await user.click(screen.getAllByRole('option')[1]);
//     expect(formGroup.value.first.testgroup2).toBe('Test 1');
//   });
//   test('Click on option in second combobox should change control value in group', async () => {
//     const formGroup = GetFormGroup();
//     await render(GenericEditComponent, {
//       componentInputs: {
//         genericEditInfo: GenericEditInfo,
//         formGroup,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getAllByRole('combobox')[1]);
//     await user.click(screen.getAllByRole('option')[1]);
//     expect(formGroup.value.second.testgroup4).toBe('Test 1');
//   });
// });
