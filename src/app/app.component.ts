import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { services, profiles, faqs, legal, teamMembers, type Service } from './data/content';
import { RevealDirective } from './shared/reveal.directive';
import { ContactComponent } from './features/contact.component';

type Filter = 'Todos' | 'Empresas' | 'Particulares';

@Component({
  selector: 'cs-root',
  standalone: true,
  imports: [CommonModule, RevealDirective, ContactComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly services = services;
  readonly profiles = profiles;
  readonly faqs = faqs;
  readonly legal = legal;
  readonly teamMembers = teamMembers;
  readonly filters: readonly Filter[] = ['Todos', 'Empresas', 'Particulares'];
  readonly filter = signal<Filter>('Todos');
  readonly menuOpen = signal(false);
  readonly expandedFaq = signal<number | null>(null);
  readonly expandedService = signal<string | null>(null);
  readonly interest = signal('');
  readonly year = new Date().getFullYear();
  readonly visibleServices = computed(() => {
    const filter = this.filter();
    return filter === 'Todos'
      ? services
      : services.filter(service => service.category === filter || service.category === 'Todos');
  });

  closeMenu(): void { this.menuOpen.set(false); }
  toggleFaq(index: number): void { this.expandedFaq.update(current => current === index ? null : index); }
  toggleService(id: string): void { this.expandedService.update(current => current === id ? null : id); }
  selectFilter(filter: Filter): void { this.filter.set(filter); }
  requestService(service: Pick<Service, 'name'> | string): void {
    this.interest.set(typeof service === 'string' ? service : service.name);
    this.closeMenu();
    document.getElementById('contacto')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
}
