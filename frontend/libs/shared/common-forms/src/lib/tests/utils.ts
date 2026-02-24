import { screen } from "@testing-library/dom";
import {expect} from 'vitest'
export class TestScreenUtils {
    static getComboBoxElement(): HTMLElement{
        return screen.getByRole('combobox');
    }

    static getElementByText(textContent: string): HTMLElement {
        return screen.getByText(textContent);
    }

    static getOptionElement(): HTMLElement {
        return screen.getByRole('option');
    }

    static getOptionNthElement(elementNumber: number): HTMLElement {
        return screen.getAllByRole('option')[elementNumber];
    }

    static getButtonElement(): HTMLElement{
        return screen.getByRole('button');
    }
}

type ArryayTestType = string | null | number | object | unknown;
export class TestUtils {
  static isNotFunction(...properties: any[]): boolean {
    return !(
      properties.filter((prop) => typeof prop === 'function').length > 0
    );
  }

  static hasObjectProperProperties(
    testedObject: Record<string, unknown>,
    ...properties: string[]
  ) {
    properties.forEach((property) => {
      expect(testedObject).toHaveProperty(property);
    });
  }

  static testObjectCorrespond(
    testedObject: Record<string, unknown>,
    correspondObjectWithValues: Record<string, unknown>
  ) {
    Object.keys(correspondObjectWithValues).forEach((key) => {
      TestUtils.isNotFunction(
        testedObject[key],
        correspondObjectWithValues[key]
      ) && expect(testedObject[key]).toBe(correspondObjectWithValues[key]);
    });
  }

  static checkVallueFromArray(
    arryToCheckec: ArryayTestType[],
    ...testValues: ArryayTestType[]
  ) {
    testValues.forEach((valueTest) =>
      expect(arryToCheckec.includes(valueTest)).toBe(true)
    );
  }
}