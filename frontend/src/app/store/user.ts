import {
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
  props,
} from '@ngrx/store';
import { User } from '../shared/models/auth.model';
export enum UserEvents {
  Set = 'Set',
  Remove = 'Remove',
  Get = 'Get',
}
export const initialUserState: Readonly<User | null> = null;
export const UserActions = createActionGroup({
  source: 'User',
  events: {
    [UserEvents.Set]: props<User>(),
    [UserEvents.Remove]: props<{ user?: any[] }>(),
  },
});

export const userReducer = createReducer<User | null>(
  initialUserState,
  on(UserActions.set, (_state, user) => ({ ...user }))
);

export const userFeatureStore = createFeatureSelector<{
  user: Readonly<User | null>;
}>('user');

export const userSelector = createSelector(
  userFeatureStore,
  (state) => state
);
