import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_LOCAL_STORAGE = new InjectionToken<Storage>('Browser Local Storage', {
    providedIn: 'root',
    factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(@Inject(BROWSER_LOCAL_STORAGE) private browserLocalStorage: Storage) { }
  
  get_item(item_key: string): string|null {
    return this.browserLocalStorage.getItem(item_key);
  }
  
  set_item(item_key: string, value: string) {
    return this.browserLocalStorage.setItem(item_key, value);
  }

  get_boolean_from_item(item_key: string): boolean {
    const obj = this.get_object_from_item(item_key);
    if ((obj == undefined) || (obj == null ) || (!((obj === true) || (obj === false)))) {
      return false;
    }

    return obj as boolean;
  }

  set_item_from_boolean(item_key: string, value: boolean) {
    const item = JSON.stringify(value);
    this.set_item(item_key, item);
  }

  get_object_from_item(item_key: string): any|null {
    const item = this.browserLocalStorage.getItem(item_key);
    if ((item == undefined) || (item == null ) || (item == "")) {
      return null;
    }

    try{
      const obj = JSON.parse(item);
      return obj;
    } catch (SyntaxError) {
      return null;
    }
  }

  set_item_from_object(item_key: string, value: any) {
    return this.set_item(item_key, JSON.stringify(value));
  }
}
