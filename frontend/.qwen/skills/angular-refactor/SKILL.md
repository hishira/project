---
name: angular-refacor
description: Refactor angular component
---
# Skill: Angular Component Refactoring (Angular 21+)

## Metadata
- **Name**: angular-component-refactoring
- **Description**: Refactor Angular components following Clean Code principles, leveraging Angular 21+ features (signals, standalone components, new control flow). Provides systematic approach to split large components, improve maintainability, and modernize legacy code.
- **Author**: AI Assistant
- **Version**: 1.0.0

---

## Overview
This skill guides the AI to act as an expert Angular developer, specializing in refactoring Angular components to be clean, testable, and maintainable. It focuses on:
- Decomposing bloated components into smaller, single-responsibility pieces
- Migrating to modern Angular patterns (signals, standalone components, inject function)
- Applying Clean Code principles (SOLID, readability, naming)
- Improving performance and change detection
- Ensuring refactored code is type-safe and follows best practices for Angular 21+

---

## Prerequisites
- Angular project using at least Angular 17+ (signals introduced in v16, stable in v17)
- TypeScript 5.0+
- Understanding of Angular fundamentals: components, services, dependency injection, change detection

---

## Refactoring Process

### 1. Assessment
Analyze the target component to identify:
- **Size**: Lines of code, number of template lines
- **Responsibilities**: What does it do? (API calls, forms, state management, presentation, side effects)
- **Code smells**: Deep nested subscriptions, complex `ngOnInit`, direct DOM manipulation, large template, mixed concerns
- **Dependencies**: Services used, inputs/outputs, external libraries

### 2. Strategy Selection
Based on assessment, choose one or more refactoring strategies:

#### a) Extract Subcomponents
When template has distinct logical sections that can become standalone components.

#### b) Extract Logic to Services
When component handles data fetching, state, or business logic that can be moved to a dedicated service.

#### c) Introduce Signals for State
Replace `BehaviorSubject`/`Observable` with signals for simpler state management and improved change detection.

#### d) Use Injection Functions
Replace constructor-based injection with `inject()` function for better testability and tree-shakability.

#### e) Adopt New Control Flow
Migrate from `*ngIf`, `*ngFor` to `@if`, `@for`, `@switch` syntax (Angular 17+).

#### f) Convert to Standalone
Remove `NgModule` dependencies and convert component to standalone.

### 3. Step-by-Step Refactoring
Proceed in small, safe steps, ensuring functionality remains unchanged.

#### Step 0: Backup & Version Control
Ensure code is under version control. Create a feature branch.

#### Step 1: Isolate Side Effects
- Move HTTP calls to a service
- Extract router navigation to service or separate method
- Identify and remove `setTimeout`, `setInterval`

#### Step 2: Simplify State Management
- Replace `BehaviorSubject` + `async` pipe with `signal` + `computed`
- Use `toSignal` for observable conversions
- Remove manual subscription management (`takeUntil`, `unsubscribe`) – signals handle cleanup automatically when used in templates

#### Step 3: Split Component
- Identify logical parts in template and create new components
- Use `@Input()` and `@Output()` for communication
- Consider content projection (`<ng-content>`) for reusable layouts

#### Step 4: Apply Clean Code Practices
- Limit component class to one responsibility
- Keep method size small (< 10 lines)
- Use descriptive names for methods and properties
- Prefer readonly where possible
- Use `inject` for DI at the top of the class

#### Step 5: Optimize Change Detection
- Use `OnPush` change detection strategy
- Leverage signals (they automatically mark for check)
- Avoid complex expressions in template

#### Step 6: Update Tests
- Adjust unit tests to reflect new structure
- Test extracted components and services independently

---

## Patterns & Examples

### Pattern 1: Extracting a Child Component
**Before (bloated template):**
```html
<div class="user-profile">
  <h2>{{ user.name }}</h2>
  <p>{{ user.email }}</p>
  <div class="user-stats">
    <span>Posts: {{ user.postCount }}</span>
    <span>Followers: {{ user.followerCount }}</span>
  </div>
</div>
```

**After:**
```html
<app-user-profile [user]="user" />
<app-user-stats [user]="user" />
```

New standalone component:
```typescript
@Component({
  selector: 'app-user-stats',
  standalone: true,
  template: `
    <div class="user-stats">
      <span>Posts: {{ user().postCount }}</span>
      <span>Followers: {{ user().followerCount }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStatsComponent {
  user = input.required<User>();
}
```

### Pattern 2: Signals over Subjects
**Before (RxJS):**
```typescript
export class DataComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  data$ = new BehaviorSubject<Item[]>([]);

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data$.next(data));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**After (Signals):**
```typescript
export class DataComponent {
  private service = inject(DataService);
  data = signal<Item[]>([]);
  isLoading = signal(false);

  constructor() {
    this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      const items = await firstValueFrom(this.service.getData());
      this.data.set(items);
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

### Pattern 3: Injection Function
**Before:**
```typescript
export class MyComponent {
  constructor(private http: HttpClient, private router: Router) {}
}
```

**After:**
```typescript
export class MyComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
}
```

### Pattern 4: New Control Flow
**Before:**
```html
<div *ngIf="items.length; else empty">
  <ul>
    <li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>
  </ul>
</div>
<ng-template #empty>No items</ng-template>
```

**After:**
```html
@if (items().length) {
  <ul>
    @for (item of items(); track item.id) {
      <li>{{ item.name }}</li>
    }
  </ul>
} @else {
  <p>No items</p>
}
```

---

## Anti-Patterns to Avoid

- **God components** – components that do too much (data fetching, presentation, routing, forms, etc.)
- **Deep nesting in templates** – indicates need for subcomponents
- **Manual subscriptions** – prefer signals, async pipe, or `toSignal`
- **Business logic in components** – move to services
- **Hardcoded strings and magic numbers** – use constants or enums
- **Large `ngOnInit`** – delegate to methods or services
- **Tight coupling** – avoid direct imports of specific services inside child components; use interfaces or abstract classes if needed

---

## Testing After Refactoring

- Ensure all existing tests pass
- Write tests for new components using Angular Testing Library or TestBed
- For signals: use `signal` and `computed` in tests, check `effect` for side effects
- For standalone components: import only necessary dependencies in tests

---

## Checklist for Refactoring

- [ ] Component is standalone or part of a well-defined module
- [ ] Uses `OnPush` change detection
- [ ] Uses signals for state (instead of Subjects)
- [ ] Uses `inject` for DI
- [ ] Template uses new control flow (`@if`, `@for`)
- [ ] Component has only one responsibility
- [ ] Methods are short and descriptive
- [ ] No manual subscriptions (except when necessary)
- [ ] Inputs/outputs are clearly typed
- [ ] Tests are updated and pass

---

## References
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular Standalone Components](https://angular.dev/guide/standalone-components)
- [Angular New Control Flow](https://angular.dev/guide/templates/control-flow)
- [Clean Code (Robert C. Martin)](https://www.oreilly.com/library/view/clean-code/9780136083238/)
- [Angular Style Guide](https://angular.dev/style-guide)

---

## Usage
When a user requests refactoring of an Angular component, the AI should:
1. Analyze the provided code (if given) or ask for the component code.
2. Identify issues and propose a refactoring plan based on the patterns above.
3. Provide step-by-step instructions with code examples.
4. After refactoring, suggest next steps (testing, performance checks).

This skill ensures the AI acts as a senior Angular developer, applying modern best practices to improve code quality.