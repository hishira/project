// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthenticateProvider {}

export interface UserAuthenticateProvider extends AuthenticateProvider {
  password: string;
}
export interface IAuthentication {
  authenticate(provider: AuthenticateProvider): Promise<boolean>;
}
