interface MockFuncCallback<T> {
  (item: T): void;
}

function mockFunc<T>(items: T[], callback: MockFuncCallback<T>): void {
  for (const item of items) {
    callback(item)
  }
}

export { mockFunc };
