type CallbackFunction = (items: number) => void;

export function forEach(items: number[], callback: CallbackFunction) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
