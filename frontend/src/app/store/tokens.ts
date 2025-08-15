import { createAction, createReducer, on } from '@ngrx/store';

export enum AccessTokenEvents {
  Set = 'AccessTokenSet',
  Remove = 'AccessTokenRemove',
  Get = 'AccessTokenGet',
}

export const initialAccessTokenState: Readonly<string | null> = null;
export const AccessTokenActions = {
  [AccessTokenEvents.Set]: createAction(AccessTokenEvents.Set),
  [AccessTokenEvents.Remove]: createAction(AccessTokenEvents.Remove),
  [AccessTokenEvents.Get]: createAction(AccessTokenEvents.Get),
};

export const accessTokenReducer = createReducer(
    initialAccessTokenState,
    on(AccessTokenActions[AccessTokenEvents.Remove], () => null),
    on(AccessTokenActions[AccessTokenEvents.Get], (state) => state)
)

