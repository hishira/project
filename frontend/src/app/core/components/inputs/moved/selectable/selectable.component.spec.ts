// import { render, screen } from '@testing-library/angular';
// import userEvent from '@testing-library/user-event';
// import {
//   SelectPipeGroupValues,
//   SelectTestValidators,
//   SelectTestValues,
//   TranslatedGroupsValues,
// } from '../../../../tests/consts/selectable-component.consts';
// import { TestUtils } from '../../../../tests/utils/TestUtils';
// import { SelectableComponent } from './selectable.component';

// //TODO testy po 12.10
// describe('Selectable component tests', () => {
//   test('should render component', async () => {
//     await render(SelectableComponent);
//     expect(screen).toBeDefined();
//   });

//   test('Should has valid label', async () => {
//     await render(SelectableComponent, {
//       componentInputs: {
//         label: 'Testing label',
//       },
//     });
//     expect(screen.getByText('Testing label')).toBeDefined();
//   });

//   test('Should has combobox role element', async () => {
//     await render(SelectableComponent);
//     expect(screen.getByRole('combobox')).toBeDefined();
//   });

//   test('with empty values input shoould has no option role element', async () => {
//     await render(SelectableComponent);
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     expect(screen.getAllByRole('option')).toHaveLength(1); //only null available;
//   });

//   test('Should render proper number of option', async () => {
//     await render(SelectableComponent, {
//       componentInputs: {
//         values: SelectTestValues,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     expect(screen.getAllByRole('option')).toHaveLength(4);
//   });

//   test('Click on option should update form', async () => {
//     const { fixture } = await render(SelectableComponent, {
//       componentInputs: {
//         values: SelectTestValues,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     const option = screen.getAllByRole('option')[1];
//     await user.click(option);
//     const formValue = fixture.componentInstance.valueControl.value;
//     expect(formValue).toBe('Test 1');
//   });

//   test('Form value field should trigger onChange funcnttion', async () => {
//     const { fixture } = await render(SelectableComponent, {
//       componentInputs: {
//         values: SelectTestValues,
//       },
//     });
//     const spyer = jest.spyOn(fixture.componentInstance, 'onChange');
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     const option = screen.getAllByRole('option')[1];
//     await user.click(option);
//     expect(spyer).toBeCalled();
//   });

//   test('Validation based on input validation should work as well', async () => {
//     const { fixture } = await render(SelectableComponent, {
//       componentInputs: {
//         values: SelectTestValues,
//         validators: SelectTestValidators,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     const option = screen.getAllByRole('option')[1];
//     await user.click(option);
//     expect(fixture.componentInstance.valueControl.invalid).toBe(true);
//   });

//   test('On default error appear in form, should show error message', async () => {
//     await render(SelectableComponent, {
//       componentInputs: {
//         values: SelectTestValues,
//         validators: SelectTestValidators,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     const option = screen.getAllByRole('option')[1];
//     await user.click(option);
//     expect(screen.getByText('Address email jest niepoprawny')).toBeDefined();
//   });

//   test('Using database pipe translation should show corrent option value', async () => {
//     await render(SelectableComponent, {
//       componentInputs: {
//         values: SelectPipeGroupValues,
//         validators: SelectTestValidators,
//         usePipe: true,
//         pipeModule: 'group',
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     const textOptionValues = screen
//       .getAllByRole('option')
//       .map((element) => element.textContent?.trim()).filter(k=>!!k);
//     TestUtils.checkVallueFromArray(textOptionValues, ...TranslatedGroupsValues);
//   });
// });
