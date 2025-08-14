import { createActionGroup, createReducer, on, props } from '@ngrx/store';
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
    [UserEvents.Get]: props<{ user: User | null }>(),
  },
});

export const userReducer = createReducer<User | null>(
  initialUserState,
  on(UserActions.get, (_state, { user }) => user)
);
