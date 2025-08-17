import { createAction, createReducer, on } from '@ngrx/store';

export enum RefreshTokenEvents {
  Set = 'RefreshTokenSet',
  Remove = 'RefreshTokenRemove',
  Get = 'RefreshTokenGet',
}

export const initialRefreshTokenState: Readonly<string | null> = null;
export const RefreshTokenActions = {
  [RefreshTokenEvents.Set]: createAction(RefreshTokenEvents.Set),
  [RefreshTokenEvents.Remove]: createAction(RefreshTokenEvents.Remove),
  [RefreshTokenEvents.Get]: createAction(RefreshTokenEvents.Get),
};

export const refreshTokenReducer = createReducer(
    initialRefreshTokenState,
    on(RefreshTokenActions[RefreshTokenEvents.Remove], () => null),
    on(RefreshTokenActions[RefreshTokenEvents.Get], (state) => state)
)

