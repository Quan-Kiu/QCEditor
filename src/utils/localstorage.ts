export const PREVIEW_DEFAULT_SIZE = 40;
const PREVIEW_SIZE_KEY = "PREVIEW_SIZE";

class MyLocalStorage {
  constructor() {}

  static getItem(key: string) {
    return JSON.parse(localStorage.getItem(key) || `${PREVIEW_DEFAULT_SIZE}`);
  }

  static setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  static setPreviewSize(value: number) {
    this.setItem(PREVIEW_SIZE_KEY, JSON.stringify(value));
  }

  static getPreviewSize() {
    return this.getItem(PREVIEW_SIZE_KEY);
  }
}
export default MyLocalStorage;
