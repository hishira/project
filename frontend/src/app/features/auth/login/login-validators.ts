import { Validators } from "@angular/forms";

export const loginValidators = {
    login: [{
        name: 'required',
        validator: Validators.required,
        message: 'Email or username is required'
    }],
    password: [{
        name: 'required',
        validator: Validators.required,
        message: 'Password is required'
    }]
}