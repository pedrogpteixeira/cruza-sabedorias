import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

/** Nonessential entrance motion; content stays visible when IntersectionObserver is unavailable. */
@Directive({ selector: '[csReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    const node = this.element.nativeElement;
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    node.classList.add('is-reveal');
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        node.classList.add('is-visible');
        this.observer?.unobserve(node);
      }
    }, { rootMargin: '0px 0px -45px 0px', threshold: 0.08 });
    this.observer.observe(node);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
