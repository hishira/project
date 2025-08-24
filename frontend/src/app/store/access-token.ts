import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';

export enum AccessTokenEvents {
  Set = 'AccessTokenSet',
  Remove = 'AccessTokenRemove',
  Get = 'AccessTokenGet',
}

export const initialAccessTokenState: Readonly<{ accessToken: string | null }> =
  { accessToken: null };
export const AccessTokenActions = {
  [AccessTokenEvents.Set]: createAction(
    AccessTokenEvents.Set,
    props<{ accessToken: string }>()
  ),
  [AccessTokenEvents.Remove]: createAction(AccessTokenEvents.Remove),
  [AccessTokenEvents.Get]: createAction(AccessTokenEvents.Get),
};

export const accessTokenReducer = createReducer(
  initialAccessTokenState,
  on(AccessTokenActions[AccessTokenEvents.Set], (state, { accessToken }) => ({
    accessToken,
  })),
  on(AccessTokenActions[AccessTokenEvents.Remove], () => ({
    accessToken: null,
  }))
);

export const accessTokenFeatureStore = createFeatureSelector<{
  accessToken: Readonly<{ accessToken: string | null }>;
}>('accessToken');

export const accessTokenSelector = createSelector(
  accessTokenFeatureStore,
  (state) => state.accessToken.accessToken
);
