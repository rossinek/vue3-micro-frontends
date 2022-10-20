<template>
  <iframe
    ref="iframeRef"
    :style="iframeStyle"
    :src="props.frameSrc"
    allow-top-navigation
  />
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, useAttrs, watch } from "vue";
import { isEmitterEvent, EmitterEvent } from ".";

const props = defineProps<{
  frameSrc: string;
}>();
const emit = defineEmits<{
  (e: string, payload?: unknown): void;
}>();

const iframeRef = ref<HTMLIFrameElement>();
const iframeStyle = reactive({ minHeight: "", minWidth: "" });
const isChildReady = ref(false);

const attrs = useAttrs();

const updateProps = () => {
  const iframe = iframeRef.value;
  if (!iframe || !isChildReady.value) return;
  // filter out function props
  const payload = Object.keys(attrs).reduce(
    (acc, key) =>
      typeof attrs[key] === "function" ? acc : { ...acc, [key]: attrs[key] },
    {} as Record<string, unknown>
  );
  const message: EmitterEvent = {
    event: "hook:update-props",
    payload,
  };
  iframe.contentWindow?.postMessage(message, "*");
};

watch(() => [attrs, isChildReady.value], updateProps, { deep: true });

const onMessage = (event: MessageEvent) => {
  const iframe = iframeRef.value;
  if (
    iframe &&
    event.source === iframe.contentWindow &&
    isEmitterEvent(event)
  ) {
    if (event.data.event === "hook:ready") {
      isChildReady.value = true;
    }
    if (event.data.event === "hook:resize") {
      const payload = event.data.payload as { height: number; width: number };
      iframeStyle.minHeight = `${payload.height}px`;
      iframeStyle.minWidth = `${payload.width}px`;
    }
    emit(event.data.event, event.data.payload);
  }
};

onMounted(() => window.addEventListener("message", onMessage));
onUnmounted(() => window.removeEventListener("message", onMessage));
</script>

<style>
iframe {
  border: 0;
}
</style>
