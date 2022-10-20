<template>
  <div>
    <input v-model="buttonLabel" />
    <MicroFrontend
      frame-src="/child"
      :button-label="buttonLabel"
      @some-event="onAccountCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MicroFrontend } from "../services/micro-frontends";

const buttonLabel = ref("submit!");
const onAccountCreated = (payload: any) => {
  alert(`got event with payload: ${payload}`);
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
}
div:before {
  content: "host app";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 2em;
  line-height: 1;
  padding: 10px;
  opacity: 0.2;
  z-index: -1;
}
input {
  border-radius: 8px;
  border: 1px solid #555;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #3a3a3a;
  cursor: pointer;
  transition: border-color 0.25s;
  color: inherit;
  outline: 0;
}
input:hover,
input:focus,
input:focus-visible {
  border-color: crimson;
}
</style>
