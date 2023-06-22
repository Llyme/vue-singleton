# vue-singleton
Allows Vue components to become a Singleton,
being accessible anywhere so long as you can access this file.

# How to Use
Enclose your exported instance like this.

The component's name must be unique,
as this will be used as the identifier.

```vue
<script lang="ts">
import { Singleton } from './singleton';

export default Singleton({
  name: 'SingletonComponent'
});
</script>
```

Then call it wherever you want.

```typescript
import { WaitFor } from './singleton';
import Component from './SingletonComponent.vue';

(async () => {
  await WaitFor('SingletonComponent');
  console.log(Component.Self());
})();
```

You must create an instance at most once in order for it to be registered as a singleton.
```vue
<template>
<SingletonComponent />
</template>
```

Multiple instances of the same component will throw an error.

```vue
<template>
<SingletonComponent />
<SingletonComponent /> <!-- Error! -->
</template>
```

More clarifications in the `example` folder.
