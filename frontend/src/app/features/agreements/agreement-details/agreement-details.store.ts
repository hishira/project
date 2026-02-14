import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Agreement } from './mock';

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
        isExpired: computed(() => agreement()?.status === 'EXPIRED'),
        product: computed(() => agreement()?.product),
        paymentSchedule: computed(() => agreement()?.paymentSchedule ?? []),
        isPaymentScheduleDefined: computed(() => agreement()?.paymentSchedule
            && (agreement()?.paymentSchedule?.length ?? 0) > 0),
        currency: () => agreement()?.currency ?? '',
    })),
    withMethods((store) => ({
        setAgreement(agreement: Agreement): void {
            patchState(store, (state) => ({ agreement }));
        }
    }))
)