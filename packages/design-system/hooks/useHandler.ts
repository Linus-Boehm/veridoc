import { debounce } from '#lib/debounce.ts';
import { type DependencyList, type RefObject, useEffect, useMemo, useRef } from 'react';

import { throttle } from '#lib/throttle.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Handler = (...args: any[]) => void;

export interface Abortable {
  abort?: () => void;
}

// Taken from https://github.com/ProtonMail/WebClients/blob/f987a1054084ea7ec47ffbee635b0f17c779deb2/packages/components/hooks/useHandler.ts

/**
 * Create a stable reference of handler
 * But will always run the updated version of the handler in argument
 */
export const useHandler = <T extends Handler>(
  handler: T,
  options: { debounce?: number; throttle?: number } = {}
): T & Abortable => {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const actualHandler = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (...args: any[]) => handlerRef.current(...args);

    if (options.debounce && options.debounce > 0) {
      return debounce(handler, options.debounce);
    }

    if (options.throttle && options.throttle > 0) {
      return throttle(handler, options.throttle);
    }

    return handler;
  }, []) as T & Abortable;

  return actualHandler;
};

/**
 * Listen to the eventName of the ref element
 * Use useHandler to ensure an updated version of the handler
 */
export const useEventListener = (
  ref: RefObject<Document | Element | null | undefined>,
  eventName: string,
  handler: Handler,
  dependencies: DependencyList
) => {
  const actualHandler = useHandler(handler);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.addEventListener(eventName, actualHandler);
    return () => {
      el.removeEventListener(eventName, actualHandler);
    };
  }, dependencies);
};
