// import { render, screen } from '@testing-library/angular';
// import userEvent from '@testing-library/user-event';
// import {
//   GenericGroupExample,
//   GenericInputLabel1,
//   GenericInputLabel2,
//   GetGenericFormGroup,
//   GroupLabelExample,
// } from '../../../../../tests/consts/generic-group.consts';
// import { GenericGroupComponent } from './generic-group.component';

// describe('Generic group tests', () => {
//   test('Should render component', async () => {
//     const newFormGroup = GetGenericFormGroup();
//     await render(GenericGroupComponent, {
//       componentInputs: {
//         genericEditGroup: GenericGroupExample,
//         groupForm: newFormGroup,
//       },
//     });

//     expect(screen).toBeDefined();
//   });

//   test('Should has proper label for group', async () => {
//     const newFormGroup = GetGenericFormGroup();
//     await render(GenericGroupComponent, {
//       componentInputs: {
//         genericEditGroup: GenericGroupExample,
//         groupForm: newFormGroup,
//       },
//     });
//     expect(screen.getByText(GroupLabelExample)).toBeDefined();
//   });
//   test('Should has proper label for first input', async () => {
//     const newFormGroup = GetGenericFormGroup();
//     await render(GenericGroupComponent, {
//       componentInputs: {
//         genericEditGroup: GenericGroupExample,
//         groupForm: newFormGroup,
//       },
//     });

//     expect(screen.getByText(GenericInputLabel1)).toBeDefined();
//   });
//   test('Should has proper label for second input', async () => {
//     const newFormGroup = GetGenericFormGroup();
//     await render(GenericGroupComponent, {
//       componentInputs: {
//         genericEditGroup: GenericGroupExample,
//         groupForm: newFormGroup,
//       },
//     });

//     expect(screen.getByText(GenericInputLabel2)).toBeDefined();
//   });

//   test('Should has input type test', async () => {
//     const newFormGroup = GetGenericFormGroup();
//     await render(GenericGroupComponent, {
//       componentInputs: {
//         genericEditGroup: GenericGroupExample,
//         groupForm: newFormGroup,
//       },
//     });

//     expect(screen.getByRole('textbox')).toBeDefined();
//   });

//   test('Should has combobox', async () => {
//     const newFormGroup = GetGenericFormGroup();
//     await render(GenericGroupComponent, {
//       componentInputs: {
//         genericEditGroup: GenericGroupExample,
//         groupForm: newFormGroup,
//       },
//     });

//     expect(screen.getByRole('combobox')).toBeDefined();
//   });

//   test('Checnge input should trigger changeing formgroup first constorl', async () => {
//     const newFormGroup = GetGenericFormGroup();
//     await render(GenericGroupComponent, {
//       componentInputs: {
//         genericEditGroup: GenericGroupExample,
//         groupForm: newFormGroup,
//       },
//     });

//     const user = userEvent.setup();
//     await user.type(screen.getByRole('textbox'), 'Test');
//     expect(newFormGroup.value.test).toBe('Test');
//   });

//   test('Checnge combobox should trigger changeing formgroup second constorl', async () => {
//     const newFormGroup = GetGenericFormGroup();
//     await render(GenericGroupComponent, {
//       componentInputs: {
//         genericEditGroup: GenericGroupExample,
//         groupForm: newFormGroup,
//       },
//     });

//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     await user.click(screen.getAllByRole('option')[1]);
//     expect(newFormGroup.value.test1).toBe('Test 1');
//   });
// });
