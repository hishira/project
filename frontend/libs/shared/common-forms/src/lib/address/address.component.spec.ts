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
