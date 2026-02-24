import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { MutliSelectWithSearchComponent } from './multi-select-with-search.component';
import { AutocomepleteDataView, ControlData, FetchingAutoCompleteSerivce } from '../autocomplete/autocomplete.component';
import { Observable, of } from 'rxjs';
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
const TestFetchingAutoCompleteService: FetchingAutoCompleteSerivce = {
  getData: function (): Observable<AutocomepleteDataView[]> {
    return of(TestAutoCompleteDataArray);
  },
};
describe('Multi select with search component spec', () => {
  test('Should render component', async () => {
    await render(MutliSelectWithSearchComponent, {componentInputs: {
        fetchingService: TestFetchingAutoCompleteService,
      },});
    expect(screen).toBeDefined();
  });

  test('Should render label', async () => {
    await render(MutliSelectWithSearchComponent, {
      componentInputs: {
        label: 'Test',
        fetchingService: TestFetchingAutoCompleteService
      },
    });

    expect(screen.getByText('Test')).toBeDefined();
  });

  //TODO: Check this option
  test('Default should not see any option', async () => {
    await render(MutliSelectWithSearchComponent, {componentInputs: {
        fetchingService: TestFetchingAutoCompleteService,
      },});

    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    expect(screen.queryAllByRole('option')).toHaveLength(4);
  });

  test('Should show correct option provider by input service', async () => {
    await render(MutliSelectWithSearchComponent, {
      componentInputs: {
        fetchingService: TestFetchingAutoCompleteService,
      },
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    expect(screen.queryAllByRole('option')).toHaveLength(4);
  });

  test('Should use getData function from input service', async () => {
    const spyer = vi.spyOn(TestFetchingAutoCompleteService, 'getData');
    await render(MutliSelectWithSearchComponent, {
      componentInputs: {
        fetchingService: TestFetchingAutoCompleteService,
      },
    });
    expect(spyer).toBeCalled();
  });

  test('Should run onChange function when some of option is selected', async () => {
    const { fixture } = await render(MutliSelectWithSearchComponent, {
      componentInputs: {
        fetchingService: TestFetchingAutoCompleteService,
      },
    });
    const spyer = vi.spyOn(fixture.componentInstance, 'onChange');
    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.queryAllByRole('option')[0]);
    expect(spyer).toBeCalled();
  });

  test('Selected value from combo should trigger handle function', async () => {
    const { fixture } = await render(MutliSelectWithSearchComponent, {
      componentInputs: {
        fetchingService: TestFetchingAutoCompleteService,
      },
    });
    const spyer = vi.spyOn(fixture.componentInstance, 'handle');
    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.queryAllByRole('option')[0]);
    expect(spyer).toBeCalled();
  });

  test('Should be visible selected element', async () => {
    await render(MutliSelectWithSearchComponent, {
      componentInputs: {
        fetchingService: TestFetchingAutoCompleteService,
      },
    });
    const user = userEvent.setup();
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.queryAllByRole('option')[0]);
    expect(screen.getByText('test')).toBeDefined();
  });
});
