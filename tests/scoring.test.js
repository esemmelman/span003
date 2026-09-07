import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compare} from '../src/scoring.js';
test('ignores punctuation, case and written accents',()=>assert.deepEqual(compare('Él está aquí.','el esta aqui'),{score:100,matched:[true,true,true]}));
test('identifies omitted words in sequence',()=>assert.deepEqual(compare('Ella está en casa.','ella en casa'),{score:75,matched:[true,false,true,true]}));
test('penalizes extra words',()=>assert.equal(compare('Soy estudiante.','soy un estudiante').score,67));
test('silence cannot earn credit',()=>assert.equal(compare('Estoy feliz.','').score,0));
test('wrong verb is marked',()=>assert.deepEqual(compare('Soy estudiante.','estoy estudiante'),{score:50,matched:[false,true]}));
test('repeated words are not counted twice',()=>assert.equal(compare('Soy estudiante.','soy soy').score,50));
