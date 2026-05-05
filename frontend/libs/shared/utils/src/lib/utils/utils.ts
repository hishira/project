// run-in-injection-context.decorator.ts
import { inject, Injector, runInInjectionContext } from '@angular/core';

/**
 * Dekorator metody – zapewnia, że metoda zostanie wykonana wewnątrz aktywnego kontekstu iniekcji.
 * Wymaga, aby instancja klasy posiadała właściwość `injector` typu `Injector`.
 */
export function runInContext(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  if (typeof originalMethod !== 'function') {
    throw new Error('@RunInInjectionContext can only be applied to methods');
  }

  // Nowa definicja metody
  descriptor.value = function (this: any, ...args: any[]) {
    console.log(this);
    const injector: Injector = this.injector;
    if (!injector) {
      throw new Error(
        `${this.constructor.name}.${propertyKey} requires an Injector instance on 'this.injector'. Please inject Injector and assign it to 'injector' property.`
      );
    }

    return runInInjectionContext(injector, () => originalMethod.apply(this, args));
  };

  return descriptor;
}


/**
 * Dekorator klasy – automatycznie dodaje do klasy pole `injector` 
 * z poprawnie wstrzykniętym `Injector`.
 * 
 * UWAGA: Tworzy nową klasę dziedziczącą po oryginalnej, co może wpłynąć na:
 * - nazwę komponentu w narzędziach deweloperskich
 * - mechanizmy Angulara, które polegają na ścisłym typowaniu (rzadko)
 */

// export function AutoInjector(): ClassDecorator {
//   return function <T extends new (...args: any[]) => object>(Target: T): T {
//     return class extends Target {
//       readonly injector: Injector;

//       constructor(...args: any[]) {
//         super(...args);
//         // `inject()` działa, ponieważ konstruktor jest wywoływany
//         // w aktywnym kontekście wstrzykiwania Angulara.
//         this.injector = inject(Injector);
//       }
//     } as T;
//   } as any;
// }


export abstract class WithInjector {
  readonly injector = inject(Injector);
}

// export function AutoInjector(){
//   return (constructor: Function) => {
//     constructor.prototype.injector = inject(Injector);
//   }
// }