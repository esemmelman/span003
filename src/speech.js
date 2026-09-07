let generation = 0;
let pauseTimer;
let activeUtterance;

export function cancelExample() {
  generation++;
  clearTimeout(pauseTimer);
  window.speechSynthesis?.cancel();
  activeUtterance = null;
}

export function speakExample(sentence, onError) {
  cancelExample();
  const current = generation;
  const words = sentence.trim().split(/\s+/);
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang === 'es-MX') || voices.find(v => v.lang.startsWith('es')) || null;
  function speakWord(index) {
    if (current !== generation || index >= words.length) return;
    const utterance = new SpeechSynthesisUtterance(words[index]);
    activeUtterance = utterance;
    utterance.lang = 'es-MX';
    utterance.rate = 1;
    utterance.voice = voice;
    utterance.onend = () => {
      if (current !== generation) return;
      activeUtterance = null;
      if (index + 1 < words.length) pauseTimer = setTimeout(() => speakWord(index + 1), 200);
    };
    utterance.onerror = () => {
      if (current !== generation) return;
      cancelExample();
      onError();
    };
    window.speechSynthesis.speak(activeUtterance);
  }
  speakWord(0);
}
