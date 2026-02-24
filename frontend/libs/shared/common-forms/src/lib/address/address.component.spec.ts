// import { render, screen } from '@testing-library/angular';
// import { AddressComponent } from './address.component';
// import userEvent from '@testing-library/user-event';
// import { TestUtils } from '../../../../tests/utils/TestUtils';
// import {
//   AddressFormFields,
//   AddressExampleFormValues,
// } from '../../../../tests/consts/address-component.consts';
// import { Validators } from '@angular/forms';
// //TODO testy po 12.10
// describe('Address component tests', () => {
//   test('Should reder component', async () => {
//     await render(AddressComponent);
//     expect(screen).toBeDefined();
//   });

//   test('Address component should has 6 text input', async () => {
//     await render(AddressComponent);
//     expect(screen.getAllByRole('textbox')).toHaveLength(6);
//   });

//   test('Address component should has one selectable', async () => {
//     await render(AddressComponent);
//     expect(screen.getByRole('combobox')).toBeDefined();
//   });

//   test('Address inputs should work, add set proper form fields', async () => {
//     const { fixture } = await render(AddressComponent);
//     const user = userEvent.setup();

//     const inputs = screen.getAllByRole('textbox');
//     const streetsInput = inputs[0];
//     const correspondAddress = inputs[1];
//     const postalCode = inputs[2];
//     const city = inputs[3];
//     const rejon = inputs[4];
//     const country = inputs[5];
//     await user.type(streetsInput, AddressExampleFormValues.street);
//     await user.type(correspondAddress, AddressExampleFormValues.secondAddress);
//     await user.type(postalCode, AddressExampleFormValues.postalCode);
//     await user.type(city, AddressExampleFormValues.city);
//     await user.type(rejon, AddressExampleFormValues.region);
//     await user.type(country, AddressExampleFormValues.country);
//     const formValues = fixture.componentInstance.addressFormGroup.value;
//     TestUtils.hasObjectProperProperties(formValues, ...AddressFormFields);
//     TestUtils.testObjectCorrespond(formValues, AddressExampleFormValues);
//   });

//   test('Input change should run onChange function', async () => {
//     const { fixture } = await render(AddressComponent);
//     const user = userEvent.setup();
//     const exampleInput = screen.getAllByRole('textbox')[0];
//     const spy = jest.spyOn(fixture.componentInstance, 'onChange');
//     await user.type(exampleInput, 'test');
//     fixture.detectChanges();
//     expect(spy).toHaveBeenCalled();
//   });

//   test('Input change should run validate function', async () => {
//     const { fixture } = await render(AddressComponent);
//     const user = userEvent.setup();
//     const exampleInput = screen.getAllByRole('textbox')[0];
//     const spy = jest.spyOn(fixture.componentInstance, 'validate');
//     await user.type(exampleInput, 'test');
//     fixture.componentInstance.validate(null as any);
//     fixture.detectChanges();
//     expect(spy).toHaveBeenCalled();
//   });

//   test('Input validators if available should work', async()=>{
//     // Test on email validator to check if validation work
//     const {fixture} = await render(AddressComponent, {
//         componentInputs: {
//             addressValidatorObject: {
//                 street: [Validators.email]
//             }
//         }
//     })
//     const user = userEvent.setup();
//     const exampleInput = screen.getAllByRole('textbox')[0];
//     await user.type(exampleInput, 'test');
//     expect(fixture.componentInstance.addressFormGroup.invalid).toBe(true);

//   })
// });
// address.component.spec.ts
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest'; // lub jeśli masz globals, możesz pominąć import, ale lepiej jawnie
import { LabelFloatDirective } from '../directives/label-float.directive';
import { ErrorsComponent } from '../errors/errors.component';
import { SelectableComponent } from '../selectable/selectable.component';
import { AddressComponent } from './address.component';

describe('AddressComponent', () => {
    const defaultValidatorObject = {};

    const setup = async (inputs: Partial<AddressComponent> = {}) => {
        const view = await render(AddressComponent, {
            imports: [SelectableComponent, ErrorsComponent, MatInputModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                FormsModule,
                MatGridListModule,
                LabelFloatDirective],
            componentInputs: {
                addressValidatorObject: defaultValidatorObject,
                ...inputs,
            },
        });
        return { ...view, user: userEvent.setup() };
    };

    it('powinien wyrenderować wszystkie pola formularza', async () => {
        await setup();
        expect(screen.getAllByRole('textbox')).toHaveLength(6);
        expect(screen.getByLabelText(/województwo/i)).toBeInTheDocument();
    });

    it('powinien aktualizować wartości formularza podczas wpisywania', async () => {
        const { fixture, user } = await setup();

        const streetInput = screen.getByLabelText(/ulica/i);
        const postalInput = screen.getByLabelText(/kod pocztowy/i);

        await user.type(streetInput, 'Testowa 1');
        await user.type(postalInput, '00-001');

        expect(fixture.componentInstance.addressFormGroup.value).toMatchObject({
            street: 'Testowa 1',
            postalCode: '00-001',
        });
    });

    it('powinien wywołać onChange przy każdej zmianie wartości', async () => {
        const { fixture, user } = await setup();
        const onChangeSpy = vi.fn(); // zamiast jest.fn()
        fixture.componentInstance.registerOnChange(onChangeSpy);

        const streetInput = screen.getByLabelText(/ulica/i);
        await user.type(streetInput, 'x');

        expect(onChangeSpy).toHaveBeenCalledWith(
            expect.objectContaining({ street: 'x' })
        );
    });

    it('powinien ustawić wartość formularza przez writeValue', async () => {
        const { fixture } = await setup();
        const testValue = {
            street: 'Piękna 5',
            postalCode: '01-234',
            city: 'Warszawa',
            zone: 'MA',
            region: '',
            country: 'Polska',
            secondAddress: '',
        };

        fixture.componentInstance.writeValue(testValue);
        expect(fixture.componentInstance.addressFormGroup.value).toEqual(testValue);
    });

    describe('walidacja', () => {
        it('powinien być nieprawidłowy, gdy pole wymagane jest puste', async () => {
            const validatorObject = {
                street: [Validators.required],
            };
            const { fixture } = await setup({ addressValidatorObject: validatorObject });

            expect(fixture.componentInstance.addressFormGroup.invalid).toBe(true);
        });

        it('powinien zwracać błąd walidacji przez validate(), gdy formularz jest nieprawidłowy', async () => {
            const validatorObject = {
                street: [Validators.required],
            };
            const { fixture } = await setup({ addressValidatorObject: validatorObject });

            const errors = fixture.componentInstance.validate(null as any);
            expect(errors).toEqual({ addressError: true });
        });

        it('powinien zwracać null przez validate(), gdy formularz jest prawidłowy', async () => {
            const { fixture } = await setup();
            expect(fixture.componentInstance.validate(null as any)).toBeNull();
        });

        it('powinien reagować na walidator email', async () => {
            const validatorObject = {
                street: [Validators.email],
            };
            const { fixture, user } = await setup({ addressValidatorObject: validatorObject });

            const streetInput = screen.getByLabelText(/ulica/i);
            await user.type(streetInput, 'niepoprawny-email');

            expect(fixture.componentInstance.addressFormGroup.invalid).toBe(true);
        });
    });

    it('powinien zmieniać appearance w zależności od outlineControl', async () => {
        const { fixture } = await setup({ outlineControl: false });
        expect(fixture.componentInstance.controlType()).toBe('fill');

        fixture.componentRef.setInput('outlineControl', true);
        fixture.detectChanges();
        expect(fixture.componentInstance.controlType()).toBe('outline');
    });

    it('pozwala ustawić wartość pola zone programowo', async () => {
        const { fixture } = await setup();
        const zoneControl = fixture.componentInstance.addressFormGroup.get('zone');
        zoneControl?.setValue('MA');

        expect(zoneControl?.value).toBe('MA');
        expect(fixture.componentInstance.addressFormGroup.value.zone).toBe('MA');
    });
});