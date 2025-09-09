import { DataLoader, Loader } from './data-loader';

export class UserLoader extends DataLoader implements Loader {
  async load(): Promise<void> {
    return Promise.resolve(void 0);
  }
}
