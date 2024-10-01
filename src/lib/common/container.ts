export class Container<T> {
  constructor(public value: T) {}

  map<R>(f: (value: T) => R): R {
    return f(this.value);
  }
}
