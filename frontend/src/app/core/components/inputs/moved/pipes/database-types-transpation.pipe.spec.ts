import { DatabaseTranslationPipe } from './database-types-translation.pipe';

describe('databaseTranslationPipe', () => {
  const pipe = new DatabaseTranslationPipe();

  it('Should translate customer to Klient', () => {
    expect(pipe.transform('customer', 'group')).toBe('Klient');
  });
  it('Should translate manager to Menadżer', () => {
    expect(pipe.transform('manager', 'group')).toBe('Menadżer');
  });
  it('Should translate supplier to Dostawca', () => {
    expect(pipe.transform('supplier', 'group')).toBe('Dostawca');
  });
  it('Should translate other to Inny', () => {
    expect(pipe.transform('other', 'group')).toBe('Inny');
  });
});
