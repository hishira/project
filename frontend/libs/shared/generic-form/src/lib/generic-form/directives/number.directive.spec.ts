import { FormControl, NgControl, ReactiveFormsModule } from "@angular/forms"
import { render, screen } from "@testing-library/angular"
import { NumberDirective } from "./number.directives"
import userEvent from "@testing-library/user-event"
import { By } from "@angular/platform-browser"

describe('number-directive tests', ()=>{
    test('Should render', async()=>{
        await render("<input number-directive />", {
            imports: [NumberDirective],
            providers: [NgControl],
        })
        expect(screen).toBeDefined();
    })

    test('Tested component should has input', async()=>{
        await render('<input number-directive />', {
            imports: [NumberDirective],
            providers: [NgControl],
        })
        expect(screen.getByRole('textbox')).toBeDefined();
    })

    test('Directive should do its job', async()=>{
        const formControl = new FormControl();
        await render(`<input number-directive [formControl]="formControl" />`, {
            imports: [NumberDirective,ReactiveFormsModule],
            providers: [NgControl],
            componentProperties: {
                formControl,
            }
        })
        const input = screen.getByRole('textbox');
        const user =  userEvent.setup();
        await user.type(input, 'test123');
        expect(formControl.value).toBe('123');
    })
    //TODO: Search if we can check if removeNotNumbersFromInput function was trigger
})