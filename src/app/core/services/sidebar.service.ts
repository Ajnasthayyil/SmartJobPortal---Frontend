import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isExpanded = signal(false);
  isOpenMobile = signal(false);

  setExpanded(val: boolean) {
    this.isExpanded.set(val);
  }

  toggleMobile() {
    this.isOpenMobile.update(val => !val);
  }

  setMobileOpen(val: boolean) {
    this.isOpenMobile.set(val);
  }
}
