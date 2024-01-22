import Browser, { Runtime } from 'webextension-polyfill';
import { isObject } from './helper';

export interface RuntimeMsgEvents {
  'background:screenshot-tab': () => string;
}

type EventListener = Map<string, (...args: unknown[]) => unknown>;

export interface RuntimeMessagePayload {
  args: unknown[];
  name: keyof RuntimeMsgEvents;
}

class RuntimeMessage {
  private eventListeners: EventListener;

  constructor() {
    this.eventListeners = new Map();
    this.runtimeMessageListener = this.runtimeMessageListener.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private runtimeMessageListener(message: any, sender: Runtime.MessageSender) {
    if (!isObject(message) || !Object.hasOwn(message, 'name')) return;
    const callback = this.eventListeners.get(message.name);
    if (!callback) return;

    return callback(...(message.args ?? []), sender) as Promise<unknown>;
  }

  onMessage<T extends keyof RuntimeMsgEvents>(
    name: T,
    callback: (
      ...args: [
        ...Parameters<RuntimeMsgEvents[T]>,
        Browser.Runtime.MessageSender,
      ]
    ) => ReturnType<RuntimeMsgEvents[T]> extends void
      ? void
      : Promise<ReturnType<RuntimeMsgEvents[T]>>,
  ) {
    // @ts-expect-error aaa
    this.eventListeners.set(name, callback);

    const hasListener = Browser.runtime.onMessage.hasListener(
      this.runtimeMessageListener,
    );
    if (!hasListener) {
      Browser.runtime.onMessage.addListener(this.runtimeMessageListener);
    }

    return this.onMessage;
  }

  removeListener(name: keyof RuntimeMsgEvents) {
    this.eventListeners.delete(name);

    if (this.eventListeners.size === 0) {
      Browser.runtime.onMessage.removeListener(this.runtimeMessageListener);
    }
  }

  sendMessage<T extends keyof RuntimeMsgEvents>(
    name: T,
    ...args: Parameters<RuntimeMsgEvents[T]>
  ) {
    return Browser.runtime.sendMessage({ name, args }) as Promise<
      ReturnType<RuntimeMsgEvents[T]>
    >;
  }

  sendMessageToTab<T extends keyof RuntimeMsgEvents>(
    { name, tabId, frameId }: { name: T; tabId: number; frameId?: number },
    ...args: Parameters<RuntimeMsgEvents[T]>
  ) {
    return Browser.tabs.sendMessage(
      tabId,
      { name, args },
      { frameId },
    ) as Promise<ReturnType<RuntimeMsgEvents[T]>>;
  }
}

export default new RuntimeMessage();
