# Arquitectura genérica base

Esta es una **arquitectura pensada para Angular 21+ usando standalone APIs y NgRx**, orientada a **escalar**, **reutilizar** y **mantener** proyectos medianos y grandes.

Está basada en principios de **Clean Architecture**, **DDD light** y buenas prácticas actuales de Angular.

---

## 🎯 Objetivos de la arquitectura

- Separación clara de responsabilidades
- Escalable (apps grandes, múltiples dominios)
- Fácil de testear
- Compatible con standalone components
- NgRx desacoplado de la UI
- Reutilizable entre proyectos

---

## 📁 Estructura de carpetas (alto nivel)

```
src/
├── app/
│   ├── core/
│   ├── shared/
│   ├── features/
│   ├── store/
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.component.ts
│
├── assets/
├── environments/
└── main.ts
```

---

## 🧠 Core (infraestructura global)

```
app/core/
├── services/
│   ├── api.service.ts
│   ├── auth.service.ts
│   └── storage.service.ts
│
├── guards/
│   └── auth.guard.ts
│
├── interceptors/
│   └── auth.interceptor.ts
│
├── facades/
│   └── auth.facade.ts
│
├── models/
│   └── user.model.ts
│
└── core.providers.ts
```

### 📌 Core contiene

- Servicios singleton
- Guards
- Interceptors
- Facades globales
- Modelos transversales

⚠️ **Nunca debería importar cosas de `features`**.

---

## ♻️ Shared (reutilizable y sin estado)

```
app/shared/
├── components/
│   ├── button/
│   ├── modal/
│   └── input-text/
│
├── directives/
│   └── has-permission.directive.ts
│
├── pipes/
│   └── currency-format.pipe.ts
│
├── utils/
│   └── date.util.ts
│
└── shared.providers.ts
```

### 📌 Shared contiene

- Componentes puros (sin NgRx)
- Pipes
- Directivas
- Utilidades

⚠️ **No servicios con estado ni lógica de negocio**.

---

## 🧩 Features (por dominio de negocio)

```
app/features/
├── auth/
├── users/
├── products/
└── orders/
```

Cada feature es **autosuficiente**.

---

## 🧱 Ejemplo de Feature completa

```
app/features/products/
├── pages/
│   ├── product-list.page.ts
│   └── product-detail.page.ts
│
├── components/
│   └── product-card.component.ts
│
├── store/
│   ├── product.actions.ts
│   ├── product.reducer.ts
│   ├── product.effects.ts
│   ├── product.selectors.ts
│   └── product.state.ts
│
├── services/
│   └── product.service.ts
│
├── facades/
│   └── product.facade.ts
│
├── models/
│   └── product.model.ts
│
├── routes.ts
└── index.ts
```

---

## 🧠 Store global (NgRx raíz)

```
app/store/
├── app.state.ts
├── app.reducer.ts
├── app.effects.ts
└── meta-reducers.ts
```

Se usa solo para:

- Estado global real (auth, settings, session)
- Meta reducers

Las **features manejan su propio store**.

---

## 🎭 Facade Pattern

Ejemplo:

```
UI → Facade → Store → Effects → API
```

Ventajas:

- La UI no conoce NgRx
- Cambiar NgRx por otra cosa es más fácil
- Código más limpio

---

## 🧪 Testing recomendado

```
features/products/
├── store/
│   ├── product.reducer.spec.ts
│   ├── product.effects.spec.ts
│
├── services/
│   └── product.service.spec.ts
```

---

## 🚀 Standalone & Providers

Ejemplo en una feature:

```
export const productProviders = [
  provideState(productFeatureKey, productReducer),
  provideEffects(ProductEffects),
];
```

Se registran en las rutas:

```
{
  path: 'products',
  providers: productProviders,
  loadComponent: () => import('./pages/product-list.page')
}
```

---

## 💉 inject() — Inyección sin constructor

Angular 14+ permite inyectar dependencias con `inject()` en lugar de declararlas en el constructor. Es el patrón recomendado en este arquetipo para componentes standalone, facades, guards e interceptors funcionales.

### ¿Cuándo usarlo?

| Contexto                                    | Recomendado                          |
| ------------------------------------------- | ------------------------------------ |
| Componente standalone                       | ✅ `inject()` en field initializers  |
| Facade de feature                           | ✅ `inject(Store)` en campo de clase |
| Guard funcional (`CanActivateFn`)           | ✅ obligatorio — no hay clase        |
| Interceptor funcional (`HttpInterceptorFn`) | ✅ obligatorio — no hay clase        |
| Servicio singleton de Core                  | ✅ más limpio que constructor        |

### Componente standalone (sin constructor)

```typescript
// features/products/pages/product-list.page.ts
import { Component, inject } from '@angular/core';
import { ProductFacade } from '../facades/product.facade';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `...`,
})
export class ProductListPage {
  readonly facade = inject(ProductFacade);
}
```

### Guard funcional

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@appCore/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};
```

### Interceptor funcional

```typescript
// core/interceptors/auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@appCore/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq);
};
```

Registrar en `app.config.ts`:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
provideHttpClient(withInterceptors([authInterceptor]));
```

### Facade con inject(Store)

```typescript
// features/products/facades/product.facade.ts
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductActions } from '../store/product.actions';
import { selectProducts, selectIsLoading } from '../store/product.selectors';

@Injectable()
export class ProductFacade {
  private store = inject(Store);

  products$ = this.store.select(selectProducts);
  isLoading$ = this.store.select(selectIsLoading);

  load() {
    this.store.dispatch(ProductActions.loadProducts());
  }
}
```

---

## ⚡ Signals — Estado reactivo local

Signals son la alternativa moderna a `BehaviorSubject` y `ChangeDetectorRef` para estado local de componentes y servicios. Son más simples, sin suscripciones manuales y totalmente integrados con la detección de cambios de Angular.

### signal() y computed()

`signal()` crea un valor reactivo escribible. `computed()` deriva un valor de solo lectura, memoizado y lazy.

```typescript
// features/cart/components/cart-summary.component.ts
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  template: `
    <p>Artículos: {{ itemCount() }}</p>
    <p>Subtotal: {{ subtotal() | currency }}</p>
    <button (click)="addItem(29.99)">Agregar</button>
  `,
})
export class CartSummaryComponent {
  prices = signal<number[]>([]);

  itemCount = computed(() => this.prices().length);
  subtotal = computed(() => this.prices().reduce((a, b) => a + b, 0));

  addItem(price: number) {
    this.prices.update((list) => [...list, price]);
  }
}
```

| Método              | Uso                                        |
| ------------------- | ------------------------------------------ |
| `signal.set(value)` | Reemplaza el valor actual                  |
| `signal.update(fn)` | Deriva el nuevo valor del actual           |
| `signal()`          | Lee el valor actual (en template o effect) |

### effect() para efectos secundarios

`effect()` se ejecuta cuando cualquier signal que lee cambia. Debe declararse en un contexto de inyección (constructor o field initializer).

```typescript
import { Component, signal, effect, inject } from '@angular/core';
import { AnalyticsService } from '@appCore/services/analytics.service';

@Component({ standalone: true, template: `...` })
export class SearchComponent {
  private analytics = inject(AnalyticsService);
  query = signal('');

  constructor() {
    effect(() => {
      // Se re-ejecuta cada vez que query() cambia
      this.analytics.trackSearch(this.query());
    });
  }
}
```

Uso con cleanup (ej. debounce):

```typescript
effect((onCleanup) => {
  const timer = setTimeout(() => this.search(this.query()), 300);
  onCleanup(() => clearTimeout(timer));
});
```

---

## 🔗 toSignal() / toObservable() — Puente NgRx ↔ Signals

En este arquetipo el store NgRx emite Observables. `toSignal()` convierte esos Observables en Signals para usarlos directamente en templates y `computed()`, eliminando el pipe `async`.

### toSignal() en un componente

```typescript
// features/products/pages/product-list.page.ts
import { Component, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProducts, selectIsLoading } from '../store/product.selectors';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    @if (isLoading()) {
      <p>Cargando...</p>
    } @else {
      <p>{{ productCount() }} productos encontrados</p>
    }
  `,
})
export class ProductListPage {
  private store = inject(Store);

  products = toSignal(this.store.select(selectProducts), { initialValue: [] });
  isLoading = toSignal(this.store.select(selectIsLoading), { initialValue: false });

  // computed() sobre signals derivadas del store — sin subscriptions manuales
  productCount = computed(() => this.products().length);
}
```

### toSignal() en una Facade (API signals para la UI)

El patrón recomendado es exponer signals directamente desde la facade para que los componentes nunca vean `async pipe` ni Observables:

```typescript
// features/products/facades/product.facade.ts
import { Injectable, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProducts, selectIsLoading, selectSelected } from '../store/product.selectors';
import { ProductActions } from '../store/product.actions';

@Injectable()
export class ProductFacade {
  private store = inject(Store);

  // Signals listos para consumir en plantillas
  readonly products = toSignal(this.store.select(selectProducts), { initialValue: [] });
  readonly isLoading = toSignal(this.store.select(selectIsLoading), { initialValue: false });
  readonly selected = toSignal(this.store.select(selectSelected), { initialValue: null });

  // Computed sobre signals del store
  readonly hasProducts = computed(() => this.products().length > 0);

  load() {
    this.store.dispatch(ProductActions.loadProducts());
  }
  select(id: string) {
    this.store.dispatch(ProductActions.selectProduct({ id }));
  }
  delete(id: string) {
    this.store.dispatch(ProductActions.deleteProduct({ id }));
  }
}
```

En el componente, el consumo es directo:

```typescript
// Componente
export class ProductListPage {
  readonly facade = inject(ProductFacade);
}
```

```html
<!-- Template: sin async pipe -->
@if (facade.isLoading()) { ... } @for (p of facade.products(); track p.id) { ... }
```

### toObservable() — cuando necesitas RxJS sobre un signal

Útil para alimentar un signal en pipelines RxJS complejos (debounce, switchMap, etc.):

```typescript
import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime } from 'rxjs';

@Component({ standalone: true, template: `<input (input)="q.set($event.target.value)" />` })
export class SearchComponent {
  private http = inject(HttpClient);

  q = signal('');

  results$ = toObservable(this.q).pipe(
    debounceTime(300),
    switchMap((query) => this.http.get<Result[]>(`/api/search?q=${query}`)),
  );
}
```

### Cuadro resumen

| Necesidad                                     | Herramienta                                          |
| --------------------------------------------- | ---------------------------------------------------- |
| Estado local simple en componente             | `signal()`                                           |
| Valor derivado de uno o más signals           | `computed()`                                         |
| Efecto secundario al cambiar un signal        | `effect()`                                           |
| Selector NgRx → Signal para el template       | `toSignal(store.select(sel), { initialValue: ... })` |
| Signal → Observable para usar operadores RxJS | `toObservable(mySignal)`                             |
| Inyectar dependencias sin constructor         | `inject(Token)` en field initializer                 |
