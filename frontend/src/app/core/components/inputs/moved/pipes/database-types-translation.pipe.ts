import { Pipe, PipeTransform } from '@angular/core';
import { DatabaseTranslation } from './database-types-translation';

@Pipe({
  name: 'databaseTranslation',
  pure: true,
  standalone: true,
})
export class DatabaseTranslationPipe implements PipeTransform {
  transform(value: string, module: string): string {
    return DatabaseTranslation[module][value];
  }
}
