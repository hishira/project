import { render, screen } from '@testing-library/angular';
import { ChipSelectableComponent } from './chip-selectable.component';
import userEvent from '@testing-library/user-event';
import { TestScreenUtils } from './../tests/utils';
describe('Chip-selectable component tests', () => {
  test('Should render component', async () => {
    await render(ChipSelectableComponent);
    expect(screen).toBeDefined();
  });

  test('Should has proper label', async () => {
    await render(ChipSelectableComponent, {
      componentInputs: {
        label: 'Test label',
      },
    });
    expect(TestScreenUtils.getElementByText('Test label')).toBeDefined();
  });

  test('Should has combobox role element', async () => {
    await render(ChipSelectableComponent);
    expect(TestScreenUtils.getComboBoxElement()).toBeDefined();
  });

  test('Should has option elements', async () => {
    await render(ChipSelectableComponent);
    const user = userEvent.setup();
    const compobox = TestScreenUtils.getComboBoxElement();
    await user.click(compobox);
    expect(screen.getAllByRole('option')).toHaveLength(8);
  });

  

  test('Clicking on option should add chip element', async () => {
    const { fixture } = await render(ChipSelectableComponent);
    const user = userEvent.setup();
    await user.click(TestScreenUtils.getComboBoxElement());
    await user.click(TestScreenUtils.getOptionNthElement(0));
    expect(fixture.componentInstance.selectedChipValues.length).toBe(1);
  });

  test('Remove chip should remove it from component lists', async () => {
    const { fixture } = await render(ChipSelectableComponent);
    const user = userEvent.setup();
    await user.click(TestScreenUtils.getComboBoxElement());
    await user.click(TestScreenUtils.getOptionNthElement(0));
    expect(fixture.componentInstance.selectedChipValues.length).toBe(1);
    await user.click(TestScreenUtils.getButtonElement());
    expect(fixture.componentInstance.selectedChipValues.length).toBe(0);
  });

  test('Remove chip schould trigger removeKeyword function', async () => {
    const { fixture } = await render(ChipSelectableComponent);
    const user = userEvent.setup();
    const spyer = vi.spyOn(fixture.componentInstance, 'removeKeyword');
    await user.click(TestScreenUtils.getComboBoxElement());
    await user.click(TestScreenUtils.getOptionNthElement(0));
    await user.click(TestScreenUtils.getButtonElement());
    expect(spyer).toBeCalled();
  });

  test('Selecting opiotn should trigger onChange function', async()=>{
    const {fixture} = await render(ChipSelectableComponent);
    const user = userEvent.setup();
    const spyer = vi.spyOn(fixture.componentInstance, 'onChange');
    await user.click(TestScreenUtils.getComboBoxElement());
    await user.click(TestScreenUtils.getOptionNthElement(0));
    expect(spyer).toBeCalled();
})
});
