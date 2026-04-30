import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isExpanded = signal(false);

  setExpanded(val: boolean) {
    this.isExpanded.set(val);
  }
}
