import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.SpeechRecognition=class{start(){window.recognitionLanguage=this.lang;if(window.failRecognition){setTimeout(()=>this.onerror?.({error:'network'}),20);return;}setTimeout(()=>this.onstart?.(),300);} stop(){this.onresult?.({resultIndex:0,results:[Object.assign([{transcript:window.testTranscript??'Estoy muy feliz'}],{isFinal:true})]});this.onend?.();}abort(){}};
  navigator.mediaDevices.getUserMedia=async()=>{if(window.denyMicrophone)throw new DOMException('Denied','NotAllowedError');return {getTracks:()=>[{stop(){window.trackStopped=true;}}]};};
  window.MediaRecorder=class{state='inactive';mimeType='audio/webm';start(){this.state='recording';}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['test'],{type:'audio/webm'})});this.onstop?.();}};
 });
 await page.goto(process.env.TEST_URL||'http://localhost:5173');
 await page.locator('#record').click();
 assert.equal(await page.locator('#record').isDisabled(),true);
 assert.match(await page.locator('#status').textContent(),/Please wait/);
 await page.getByRole('button',{name:'Finish recording'}).waitFor();
 assert.equal(await page.locator('#next').isDisabled(),true);
 assert.equal(await page.evaluate(()=>window.recognitionLanguage),'es-MX');
 assert.match(await page.locator('#status').textContent(),/Ready—speak Spanish now/);
 await page.locator('#record').click();
 await page.getByText('100% word match',{exact:true}).waitFor();
 assert.equal(await page.locator('#playback').isVisible(),true);
 assert.equal(await page.evaluate(()=>window.trackStopped),true);
 await page.locator('#next').click();
 assert.equal(await page.locator('#sentence').textContent(),'Soy estudiante.');
 await page.evaluate(()=>window.testTranscript='estoy estudiante');
 await page.locator('#record').click();await page.getByRole('button',{name:'Finish recording'}).waitFor();await page.locator('#record').click();
 await page.getByText('50% word match',{exact:true}).waitFor();
 assert.equal(await page.locator('.missed').textContent(),'Soy');
 await page.evaluate(()=>window.testTranscript='');
 await page.locator('#record').click();await page.getByRole('button',{name:'Finish recording'}).waitFor();await page.locator('#record').click();
 assert.match(await page.locator('#status').textContent(),/No words/);
 await page.evaluate(()=>window.denyMicrophone=true);await page.locator('#record').click();
 await page.getByText(/Microphone access was denied/).waitFor();
 assert.equal(await page.locator('#next').isEnabled(),true);
 await page.evaluate(()=>{window.denyMicrophone=false;window.failRecognition=true;});
 await page.locator('#record').click();
 await page.getByText(/The speech service could not connect/).waitFor();
 assert.equal(await page.locator('#record').isEnabled(),true);
 assert.equal(await page.evaluate(()=>window.trackStopped),true);
 await page.locator('#next').click();
 for(const width of [390,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 assert.deepEqual(errors,[]);
 await page.screenshot({path:'test-results/desktop.png',fullPage:true});
 const unsupported=await browser.newPage();await unsupported.addInitScript(()=>{window.SpeechRecognition=undefined;window.webkitSpeechRecognition=undefined;});await unsupported.goto(process.env.TEST_URL||'http://localhost:5173');assert.equal(await unsupported.locator('#record').isDisabled(),true);
 console.log('Passed: record/stop, scores, playback, microphone cleanup, silence, permission denial, navigation, mobile/desktop layout, unsupported browser. Speech service is mocked; real microphone quality requires a manual check.');
}finally{await browser.close();}
