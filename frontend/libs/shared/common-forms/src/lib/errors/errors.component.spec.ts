import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import { ErrorsComponent } from './errors.component';

describe('Errors component tests', () => {
    test('Should render component', async () => {
        await render(ErrorsComponent, {
            componentInputs: {
                control: new FormControl(''),
            },
        });

        expect(screen).toBeDefined();
    });

    test('Should rendered errors be visible', async () => {
        const controlWithErrors = new FormControl('');
        await render(ErrorsComponent, {
            componentInputs: {
                control: controlWithErrors,
            },
            componentProperties: {
                errorsTable: [{ type: 'required', value: 'To pole jest wymagane' }],
            },
        });
        expect(screen.getByText(/To pole jest wymagane/)).toBeDefined();
    });

    test('Without errors should render nothing', async () => {
        const { container } = await render(ErrorsComponent, {
            componentInputs: {
                control: new FormControl(''),
            },
            componentProperties: {
                errorsTable: [],
            },
        });

        expect(container.querySelector('div')?.textContent).toBe(undefined);
    });

    test('Default error: Control with errors required error should display "To pole jest wymagane"', async () => {
        const val: ValidatorFn = (control) => ({ required: true })
        const errorControl = new FormControl('', [val]);
        const { fixture } = await render(ErrorsComponent, {
            componentInputs: {
                control: errorControl,
            },
        });
        errorControl.setValue('Test');
        errorControl.updateValueAndValidity();
        errorControl.markAsTouched();
        errorControl.markAsDirty();
        fixture.detectChanges();
        expect(screen.getByText('To pole jest wymagane')).toBeDefined();
    });

    test('Default error, control with emial errors should display "Address email jest niepoprawny"', async () => {
        const emailControl = new FormControl<string | null>(null, [Validators.email]);
        const { fixture } = await render(ErrorsComponent, {
            componentInputs: {
                control: emailControl
            }
        })
        emailControl.setValue('test');
        emailControl.updateValueAndValidity();
        emailControl.markAsTouched();
        fixture.detectChanges();
        expect(screen.getByText('Address email jest niepoprawny')).toBeDefined();
    })

    test('In error check should run defaultErrorChecker function', async () => {
        const emailControl = new FormControl<string | null>(null, [Validators.email]);
        const { fixture } = await render(ErrorsComponent, {
            componentInputs: {
                control: emailControl
            }
        })
        const spy = vi.spyOn(fixture.componentInstance, 'defaultErrorChecker');
        //TODO: fix for private method if its is good
        const spy1 = vi.spyOn(fixture.componentInstance as any, 'checkPossibleErrors');
        const spy2 = vi.spyOn(fixture.componentInstance as any, 'setErrorsToShow');
        const spy3 = vi.spyOn(fixture.componentInstance as any, 'checkTableRedudanntErrorsForErrorKey');
        emailControl.setValue('test');
        emailControl.updateValueAndValidity();
        emailControl.markAsTouched();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    })

    test('Without errors should not run defaultErrorChecker', async () => {
        const controlWithErrors = new FormControl('');
        const { fixture } = await render(ErrorsComponent, {
            componentInputs: {
                control: controlWithErrors,
            },
        });
        const spy = vi.spyOn(fixture.componentInstance, 'defaultErrorChecker');
        expect(spy).toHaveBeenCalledTimes(0);
    })
});
