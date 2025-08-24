import {
  createAction,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';

export enum RefreshTokenEvents {
  Set = 'RefreshTokenSet',
  Remove = 'RefreshTokenRemove',
  Get = 'RefreshTokenGet',
}

export const initialRefreshTokenState: Readonly<{
  refreshToken: string | null;
}> = { refreshToken: null };
export const RefreshTokenActions = {
  [RefreshTokenEvents.Set]: createAction(
    RefreshTokenEvents.Set,
    props<{ refreshToken: string }>()
  ),
  [RefreshTokenEvents.Remove]: createAction(RefreshTokenEvents.Remove),
  [RefreshTokenEvents.Get]: createAction(RefreshTokenEvents.Get),
};

export const refreshTokenReducer = createReducer(
  initialRefreshTokenState,
  on(
    RefreshTokenActions[RefreshTokenEvents.Set],
    (state, { refreshToken }) => ({ refreshToken })
  ),
  on(RefreshTokenActions[RefreshTokenEvents.Remove], () => ({
    refreshToken: null,
  }))
);

export const refreshTokenFeatureStore = createFeatureSelector<{
  refreshToken: Readonly<{ refreshToken: string | null }>;
}>('refreshToken');

export const refreshTokenSelector = createSelector(
  refreshTokenFeatureStore,
  (state) => state.refreshToken.refreshToken
);
