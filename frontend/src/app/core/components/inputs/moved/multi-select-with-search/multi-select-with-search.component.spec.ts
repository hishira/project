// import { render, screen } from '@testing-library/angular';
// import userEvent from '@testing-library/user-event';
// import { TestFetchingAutoCompleteService } from '../../../../tests/consts/autocomplete-component.consts';
// import { MutliSelectWithSearchComponent } from './multi-select-with-search.component';

// describe('Multi select with search component spec', () => {
//   test('Should render component', async () => {
//     await render(MutliSelectWithSearchComponent);
//     expect(screen).toBeDefined();
//   });

//   test('Should render label', async () => {
//     await render(MutliSelectWithSearchComponent, {
//       componentInputs: {
//         label: 'Test',
//       },
//     });

//     expect(screen.getByText('Test')).toBeDefined();
//   });

//   test('Default should not see any option', async () => {
//     await render(MutliSelectWithSearchComponent);

//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     expect(screen.queryAllByRole('option')).toHaveLength(0);
//   });

//   test('Should show correct option provider by input service', async () => {
//     await render(MutliSelectWithSearchComponent, {
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
//     await render(MutliSelectWithSearchComponent, {
//       componentInputs: {
//         fetchingService: TestFetchingAutoCompleteService,
//       },
//     });
//     expect(spyer).toBeCalled();
//   });

//   test('Should run onChange function when some of option is selected', async () => {
//     const { fixture } = await render(MutliSelectWithSearchComponent, {
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

//   test('Selected value from combo should trigger handle function', async () => {
//     const { fixture } = await render(MutliSelectWithSearchComponent, {
//       componentInputs: {
//         fetchingService: TestFetchingAutoCompleteService,
//       },
//     });
//     const spyer = jest.spyOn(fixture.componentInstance, 'handle');
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     await user.click(screen.queryAllByRole('option')[0]);
//     expect(spyer).toBeCalled();
//   });

//   test('Should be visible selected element', async () => {
//     await render(MutliSelectWithSearchComponent, {
//       componentInputs: {
//         fetchingService: TestFetchingAutoCompleteService,
//       },
//     });
//     const user = userEvent.setup();
//     await user.click(screen.getByRole('combobox'));
//     await user.click(screen.queryAllByRole('option')[0]);
//     expect(screen.getByText('test')).toBeDefined();
//   });
// });
