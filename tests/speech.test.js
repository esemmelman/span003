import {test} from 'node:test';
import assert from 'node:assert/strict';
import {speakExample, cancelExample} from '../src/speech.js';

test('waits half a second after each word and cancels pending words', t => {
  t.mock.timers.enable({apis:['setTimeout']});
  const spoken=[];
  globalThis.window={speechSynthesis:{cancel(){},getVoices:()=>[],speak:utterance=>spoken.push(utterance)}};
  globalThis.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  try {
    speakExample('Estoy muy feliz.',()=>assert.fail('Unexpected speech error'));
    assert.equal(spoken[0].text,'Estoy');
    assert.equal(spoken[0].rate,.4);
    t.mock.timers.tick(1000);
    assert.equal(spoken.length,1);
    spoken[0].onend();
    t.mock.timers.tick(499);
    assert.equal(spoken.length,1);
    t.mock.timers.tick(1);
    assert.equal(spoken[1].text,'muy');
    spoken[1].onend();
    cancelExample();
    t.mock.timers.tick(500);
    assert.equal(spoken.length,2);
    speakExample('Soy estudiante.',()=>assert.fail('Unexpected speech error'));
    spoken[1].onend();
    t.mock.timers.tick(500);
    assert.equal(spoken.length,3);
    assert.equal(spoken[2].text,'Soy');
  } finally {
    cancelExample();
    delete globalThis.window;
    delete globalThis.SpeechSynthesisUtterance;
  }
});
