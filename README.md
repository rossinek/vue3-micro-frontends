# Micro implementation of micro frontends with Vue 3

*Note: this is a demo repository created as an appendix to a blog post ([make sure to check it out!](https://arturrosa.pl/blog/micro-vue-micro-frontends))*

If you want to divide your application into client services or if you already have separate applications which are meant to be displayed together on one page, one of the simplest solutions is to use iframes. This solution is relatively easy to implement and provides good encapsulation of applications (no conflicts in JS, no common dependencies or styles, etc).

It's always a good idea to hide hard parts somewhere in the services and make usage clean and easy to read/understand. The main goal of his PoC is to make embedding the application and communicating with it as easy as using a component.

## Example

### Host application (usage)

Let's assume that there is a separate application running on path `/account` and it exposes the form to create an account at `/account/create` that can be embedded on other pages. You can prefill form with an email by passing prop `email`. After account is created child app sends the event `account-created` with some payload of type `UserData`.

Here is how it may look like from host application perspective (our goal):

```vue
<template>
  <MicroFrontend
    frame-src="/account/create"
    :email="email"
    @account-created="onAccountCreated"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MicroFrontend } from '@/services/micro-frontends'

// ...

const email = ref('user@example.com')
const onAccountCreated = (userData: UserData) => {
  // ...
}
</script>
```

Short and sweet! Pretty easy to read, isn't it?

### Guest application (usage)

So now we need a mechanism to emit an event from a child application. Usage may look like this:

```vue
<template>
  <form @submit.prevent="createAccount">
    <!-- ... -->
  </form>
</template>

<script setup lang="ts">
import { useHostApp } from "@/services/micro-frontends";

const { emit, props, hasHostApplication } = useHostApp<{ email: string; }>();

const userData = reactive({ email: props.email }); // automatically typed as { email: string }

// ...

const createAccount = () => {
  // ...
  emit("account-created", userData);
  if (!hasHostApplication.value) {
    router.push("/success");
  }
};
</script>
```

Note that sometimes we want to have different behavior depending on whether the application was displayed inside the iframe or runs independently - this is why `hasHostApplication` may also be a useful tool.

## Important note!

Keep in mind that this is a PoC. Some parts could be written more comprehensively, but I decided to keep it simple to make it easier to capture the general ideas. To use it in practice you will most likely need to extend it a bit for your specific case.
