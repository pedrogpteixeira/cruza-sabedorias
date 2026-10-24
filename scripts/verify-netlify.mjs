import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const dist = 'dist/cruza-sabedorias/browser';
assert.ok(existsSync(`${dist}/index.html`), 'Angular output not found');
const blueprint = readFileSync(`${dist}/netlify-forms.html`, 'utf8');
const component = readFileSync('src/app/features/contact.component.html', 'utf8');
assert.match(blueprint, /data-netlify="true"/);
assert.match(blueprint, /netlify-honeypot="bot-field"/);
assert.match(blueprint, /form-name" value="cruza-contactos"/);
for (const field of ['name', 'email', 'phone', 'profile', 'service', 'message', 'consent', 'bot-field']) {
  assert.ok(blueprint.includes(`name="${field}"`), `Field ${field} missing from blueprint`);
  assert.ok(component.includes(`name="${field}"`), `Field ${field} missing from component`);
}
console.log('Netlify form blueprint matches Angular form.');
