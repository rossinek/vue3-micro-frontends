import {
  computed,
  inject,
  InjectionKey,
  Plugin,
  reactive,
  readonly,
} from "vue";
export { default as MicroFrontend } from "./MicroFrontend.vue";

export type EmitterEvent = { event: string; payload: unknown };

export const isEmitterEvent = (
  message: MessageEvent
): message is MessageEvent<EmitterEvent> => {
  return (
    !!message.data && typeof (message.data as EmitterEvent).event === "string"
  );
};

const hasHostApplication = computed(() => window.parent !== window.self);

const propsValue = reactive<Record<string, any>>({});

const initializeMicroFrontend = () => {
  if (!hasHostApplication) return;

  window.addEventListener("message", (event: MessageEvent) => {
    if (event.source === window.parent && isEmitterEvent(event)) {
      if (event.data.event === "hook:update-props") {
        Object.assign(propsValue, event.data.payload);
        Object.keys(propsValue).forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(event.data.payload, key)) {
            delete propsValue[key];
          }
        });
      }
    }
  });

  appEmit("hook:ready");

  const onResize = () =>
    appEmit("hook:resize", {
      height: document.documentElement.scrollHeight,
      width: document.documentElement.scrollWidth,
    });
  onResize();
  const observer = new ResizeObserver(onResize);
  observer.observe(document.body);
};

const appEmit = (event: string, payload?: unknown) => {
  if (hasHostApplication.value) {
    const message: EmitterEvent = { event, payload };
    window.parent.postMessage(message, "*");
  }
};


const hostPropsInjectionKey = Symbol() as InjectionKey<Record<string, unknown>>;

export const plugin: Plugin = {
  install: (app) => {
    initializeMicroFrontend();

    app.provide(hostPropsInjectionKey, readonly(propsValue));
  },
};

export const useHostApp = <
  Props extends Record<string, any> = Record<string, any>
>() => {
  const props = inject(hostPropsInjectionKey) as Props;
  return {
    hasHostApplication,
    emit: appEmit,
    props,
  };
};
