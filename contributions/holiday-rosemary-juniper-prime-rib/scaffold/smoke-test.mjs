import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const txt=await readFile(new URL('../prime-rib-page-code.txt',import.meta.url),'utf8');
assert.equal(html,txt); assert.match(html,/data-burner/); assert.match(html,/horseradish/); assert.match(html,/145/); assert.match(html,/localStorage/); assert.ok((await stat(new URL('../images/holiday-rosemary-juniper-prime-rib.webp',import.meta.url))).size<250000); console.log('Prime rib package smoke checks passed.');
