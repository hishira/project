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
