import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Development {
    private _isLocal: boolean = false;

    get isLocal(): boolean {
        return this._isLocal;
    }
    development(isLocal: boolean): void {
        this._isLocal = isLocal;
    }
}