import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Agreement } from './mock';
import { computed } from '@angular/core';

export type AgreementDetailsStore = {
    agreement: Agreement | null
}

export const initialState: AgreementDetailsStore = {
    agreement: null,
}

export const AgreementDetailStore = signalStore(
    withState(initialState),
    withComputed(({ agreement }) => ({
        isDefined: computed(() => !!agreement),
        isExpired: computed(() => agreement()?.status === 'EXPIRED')
    })),
    withMethods((store) => ({
        setAgreement(agreement: Agreement): void {
            patchState(store, (state) => ({ agreement }));
        }
    }))
)