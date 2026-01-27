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
