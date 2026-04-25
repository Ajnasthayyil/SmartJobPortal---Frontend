import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appHideOnRoutes]',
  standalone: true
})
export class ShellVisibilityDirective implements OnInit, OnDestroy {
  @Input('appHideOnRoutes') hiddenRoutes: string[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private el: ElementRef) {}

  ngOnInit() {
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateVisibility(event.urlAfterRedirects || event.url);
    });

    // Initial check
    this.updateVisibility(this.router.url);
  }

  private updateVisibility(currentUrl: string) {
    const isHidden = this.hiddenRoutes.some(route => currentUrl.includes(route));
    this.el.nativeElement.style.display = isHidden ? 'none' : 'block';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
