"use client";
import { isWindowApiSupported, warnOnce } from '#lib/window.ts';
import { useEffect } from 'react';

const errorMessage =
  "MutationObserver is not supported, this could happen both because window.MutationObserver is not supported by your current browser or you're using the useMutationObserver hook whilst server side rendering.";

const defaultOptions: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

/**
 * __useMutationObserver__
 * A hook that observes mutations on a DOM node.
 *
 * @param elementToObserve - A React ref object that points to the observed element.
 * @param callback - A function that will be called whenever a mutation occurs.
 * @param options - An options object that specifies what mutations to observe.
 */
export const useMutationObserver = (
  elementToObserve: HTMLElement | null,
  callback: MutationCallback,
  options: MutationObserverInit = defaultOptions
) => {
  const isSupported = isWindowApiSupported('MutationObserver');

  useEffect(() => {
    if (!isSupported) {
      warnOnce(errorMessage);
      return;
    }
    if (!elementToObserve) return;

    const observer = new MutationObserver(callback);
    observer.observe(elementToObserve, options);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);
};
