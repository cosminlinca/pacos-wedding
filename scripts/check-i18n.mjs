import { readFileSync } from 'node:fs';

const readTable = (locale) =>
  JSON.parse(
    readFileSync(new URL(`../src/i18n/${locale}.json`, import.meta.url), 'utf8')
  );

const ro = readTable('ro');
const en = readTable('en');
const missingInEn = Object.keys(ro).filter((key) => !Object.hasOwn(en, key));
const missingInRo = Object.keys(en).filter((key) => !Object.hasOwn(ro, key));

if (missingInEn.length || missingInRo.length) {
  if (missingInEn.length) {
    console.error(`Missing keys in en.json: ${missingInEn.sort().join(', ')}`);
  }
  if (missingInRo.length) {
    console.error(`Missing keys in ro.json: ${missingInRo.sort().join(', ')}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Translation keys match (${Object.keys(ro).length} keys).`);
}
