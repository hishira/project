export interface Loader {
  load(): Promise<void>;
}

export abstract class DataLoader {
  static readonly loaders: Loader[] = [];
  readonly url: string = 'localhost:3001';
  protected prepareLink(endpoint: string): string {
    return `${this.url}/${endpoint}`;
  }

  static addLoader(loader: Loader): void {
    this.loaders.push(loader);
  }

  static async loadAll(): Promise<void[] | void> {
    return Promise.all(this.loaders.map((loader) => loader.load())).catch(
      (err) => console.error(err),
    );
  }
}

export const runLoaders = async (loaders: Loader[]): Promise<void | void[]> => {
  loaders.forEach((loader) => DataLoader.addLoader(loader));
  return DataLoader.loadAll();
};
