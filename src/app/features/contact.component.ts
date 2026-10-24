import { ChangeDetectionStrategy, Component, inject, isDevMode, input, effect, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { contactSubjects } from '../data/content';
import { encodeContact, sendContact } from './contact-form';

@Component({
  selector: 'cs-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  readonly interest = input<string>('');
  readonly subjects = contactSubjects;
  readonly sending = signal(false);
  readonly submitted = signal(false);
  readonly success = signal(false);
  readonly status = signal('');
  readonly localPreview = isDevMode() || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120), Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
    phone: ['', [Validators.maxLength(35)]],
    profile: ['Empresa', [Validators.required]],
    service: ['Contabilidade e Fiscalidade', [Validators.required]],
    message: ['', [Validators.required, Validators.maxLength(3000), Validators.minLength(10)]],
    consent: [false, [Validators.requiredTrue]],
    'bot-field': [''],
  });

  constructor() {
    effect(() => {
      const interest = this.interest();
      if (this.subjects.includes(interest)) this.form.controls.service.setValue(interest);
    });
  }

  async submit(): Promise<void> {
    if (this.sending()) return;
    this.submitted.set(true);
    this.success.set(false);
    this.status.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.status.set('Verifique os campos obrigatórios antes de enviar.');
      return;
    }
    if (this.form.controls['bot-field'].value) {
      this.status.set('Não foi possível validar o formulário.');
      return;
    }
    if (this.localPreview) {
      this.status.set('Formulário validado. O envio só ficará disponível no site publicado através da Netlify Forms.');
      return;
    }
    this.sending.set(true);
    try {
      await sendContact(encodeContact(this.form.getRawValue()));
      this.success.set(true);
      this.status.set('Pedido enviado. Obrigado pelo contacto!');
      this.form.reset({name: '', email: '', phone: '', profile: 'Empresa', service: this.interest() || 'Contabilidade e Fiscalidade', message: '', consent: false, 'bot-field': ''});
      this.submitted.set(false);
    } catch (error) {
      this.status.set(error instanceof Error ? error.message : 'Ocorreu um erro no envio. Tente novamente.');
    } finally { this.sending.set(false); }
  }
}
