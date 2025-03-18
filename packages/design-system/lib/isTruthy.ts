/*
  isTruthy is a type guard that checks if a value is truthy. It is used to filter out falsy or undefined values from arrays.
  the difference between a simple using a !!t in a `Array.filter` and `isTruthy` is that `isTruthy` makes the
  compiler aware, that no undefined values are in the array anymore.
 */
export const isTruthy = <T>(t: T | undefined | null | void | false | number): t is T => {
  return !!t;
};