<template>
  <form @submit.prevent="createAccount">
    <button>{{ props["button-label"] || "..." }}</button>
  </form>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useHostApp } from "../services/micro-frontends";

const router = useRouter();
const { emit, props, hasHostApplication } = useHostApp<{
  "button-label": string;
}>();
// ...

const createAccount = () => {
  // ...
  emit("some-event", "some data");
  if (!hasHostApplication.value) {
    router.push("/");
  }
};
</script>

<style scoped>
form {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  padding: 100px 20px;
  min-width: 400px;
}
form:before {
  content: "child app";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 2em;
  line-height: 1;
  padding: 10px;
  opacity: 0.2;
}
</style>
