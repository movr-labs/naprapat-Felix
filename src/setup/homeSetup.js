const flows = {
  'Ont i ryggen': {
    steps: [
      { text: 'Förstår. <span class="tag">Rygg</span> Hur länge har du haft besvären?', chips: ['Några dagar', 'Några veckor', 'Mer än en månad'] },
      { text: 'Tack. Hur skulle du beskriva smärtan?', chips: ['Molande och konstant', 'Stickande / skjutande', 'Värre på morgonen', 'Värre vid rörelse'] },
      { type: 'contact', text: 'Sista steget: fyll i dina kontaktuppgifter så kan vi återkomma med rätt nästa steg.' }
    ],
    finalText: 'Utmärkt – vi har fått en bra bild. <strong>Vi återkommer via e-post inom 24 timmar</strong> med ditt rekommenderade nästa steg. 🌿'
  },
  'Ont i nacken': {
    steps: [
      { text: 'Förstår. <span class="tag">Nacke</span> Strålar smärtan ut mot axeln eller armen?', chips: ['Ja, mot axeln', 'Ja, ner i armen', 'Nej, mest i nacken'] },
      { text: 'Tack. Hur länge har det pågått?', chips: ['Nytt – några dagar', 'Några veckor', 'Återkommande problem'] },
      { type: 'contact', text: 'Sista steget: fyll i dina kontaktuppgifter så kan vi återkomma med rätt nästa steg.' }
    ],
    finalText: 'Bra, vi har det vi behöver. <strong>Förvänta dig svar inom 24h</strong> med nästa steg anpassat för dig. 🌿'
  },
  'Ont i axeln': {
    steps: [
      { text: 'Förstår. <span class="tag">Axel</span> Är det svårt att lyfta armen?', chips: ['Ja, tydligt begränsat', 'Lite begränsat', 'Rörelsen är ok men gör ont'] },
      { text: 'Tack. Kom det plötsligt eller smög det sig på?', chips: ['Plötslig skada', 'Kom gradvis', 'Vet inte riktigt'] },
      { type: 'contact', text: 'Sista steget: fyll i dina kontaktuppgifter så kan vi återkomma med rätt nästa steg.' }
    ],
    finalText: 'Vi har allt vi behöver. <strong>Svar kommer inom 24h</strong> med ditt rekommenderade nästa steg. 🌿'
  },
  'Annat besvär': {
    steps: [
      { text: 'Absolut – berätta kort vilket område eller vilken typ av besvär du har.', chips: [] },
      { text: 'Tack för det. Hur länge har du haft besvären?', chips: ['Nytt – några dagar', 'Några veckor', 'Månader eller längre'] },
      { type: 'contact', text: 'Sista steget: fyll i dina kontaktuppgifter så kan vi återkomma med ett anpassat förslag.' }
    ],
    finalText: 'Vi återkommer med ett anpassat förslag inom 24 timmar. <strong>Tack för din beskrivning!</strong> 🌿'
  }
};

const initialFlowLabels = new Map([
  ['🔴 Ont i ryggen', 'Ont i ryggen'],
  ['🔴 Ont i nacken', 'Ont i nacken'],
  ['🔴 Ont i axeln', 'Ont i axeln'],
  ['+ Annat', 'Annat besvär']
]);

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return phone.replace(/\D/g, '').length >= 7;
}

export function setupHomePage(container) {
  let currentFlow = null;
  let step = 0;
  let awaitingContact = false;
  const timers = new Set();

  const registerTimer = (callback, delay) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      callback();
    }, delay);
    timers.add(id);
  };

  const chat = () => container.querySelector('#chat');

  const scrollChatToBottom = () => {
    const chatArea = chat();
    if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
  };

  const addUserBubble = (text) => {
    const chatArea = chat();
    if (!chatArea) return;

    const el = document.createElement('div');
    el.className = 'bubble user fade-in';
    el.textContent = text;
    chatArea.appendChild(el);
    scrollChatToBottom();
  };

  const addBotBubble = (html, chips = []) => {
    const chatArea = chat();
    if (!chatArea) return;

    const typing = document.createElement('div');
    typing.className = 'typing-bubble';
    typing.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    chatArea.appendChild(typing);
    scrollChatToBottom();

    registerTimer(() => {
      typing.remove();

      const el = document.createElement('div');
      el.className = 'bubble bot fade-in';
      el.innerHTML = html + (
        chips.length
          ? `<div class="chips">${chips.map(chip => `<button class="chip" type="button">${chip}</button>`).join('')}</div>`
          : ''
      );
      chatArea.appendChild(el);
      scrollChatToBottom();
    }, 1000);
  };

  const addContactFormBubble = (text) => {
    const chatArea = chat();
    if (!chatArea) return;

    const typing = document.createElement('div');
    typing.className = 'typing-bubble';
    typing.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    chatArea.appendChild(typing);
    scrollChatToBottom();

    registerTimer(() => {
      typing.remove();

      const el = document.createElement('div');
      el.className = 'bubble bot fade-in';
      el.innerHTML = `
        <p class="contact-intro">${text}</p>
        <form class="contact-form">
          <input class="contact-input" name="name" type="text" placeholder="Namn" autocomplete="name" />
          <input class="contact-input" name="email" type="email" placeholder="Mejl" autocomplete="email" />
          <input class="contact-input" name="phone" type="tel" placeholder="Telefonnummer" autocomplete="tel" />
          <input class="contact-input" name="city" type="text" placeholder="Stad" autocomplete="address-level2" />
          <div class="contact-error" aria-live="polite"></div>
          <button class="contact-submit" type="submit">Skicka kontaktuppgifter</button>
        </form>
      `;
      chatArea.appendChild(el);
      scrollChatToBottom();
    }, 1000);
  };

  const nextBot = () => {
    if (!currentFlow || awaitingContact) return;

    const steps = currentFlow.steps;
    if (step >= steps.length) return;

    const message = steps[step];
    if (message.type === 'contact') {
      awaitingContact = true;
      addContactFormBubble(message.text);
      return;
    }

    addBotBubble(message.text, message.chips ?? []);
  };

  const selectFlow = (button, flowKey) => {
    const chips = button.closest('.chips');
    chips?.querySelectorAll('.chip').forEach(chip => {
      chip.disabled = true;
    });
    button.classList.add('selected');

    currentFlow = flows[flowKey];
    step = 0;
    awaitingContact = false;
    addUserBubble(flowKey);
    registerTimer(nextBot, 300);
  };

  const replyWithChip = (button, value) => {
    if (!currentFlow || awaitingContact) return;

    const chips = button.closest('.chips');
    chips?.querySelectorAll('.chip').forEach(chip => {
      chip.disabled = true;
    });
    button.classList.add('selected');

    addUserBubble(value);
    step += 1;
    registerTimer(nextBot, 300);
  };

  const sendMsg = () => {
    const input = container.querySelector('#msg');
    const value = input?.value.trim();
    if (!input || !value) return;

    input.value = '';

    if (awaitingContact) {
      addBotBubble('Fyll i namn, mejl, telefon och stad i formuläret ovan så kan vi återkomma.');
      return;
    }

    addUserBubble(value);

    if (!currentFlow) {
      currentFlow = flows['Annat besvär'];
      step = 1;
    } else {
      step += 1;
    }

    registerTimer(nextBot, 300);
  };

  const submitContact = (form) => {
    if (!currentFlow || !awaitingContact) return;

    const name = form.elements.namedItem('name')?.value.trim() ?? '';
    const city = form.elements.namedItem('city')?.value.trim() ?? '';
    const email = form.elements.namedItem('email')?.value.trim() ?? '';
    const phone = form.elements.namedItem('phone')?.value.trim() ?? '';
    const errorBox = form.querySelector('.contact-error');

    let error = '';
    if (!name) error = 'Fyll i ditt namn.';
    else if (!city) error = 'Fyll i din stad.';
    else if (!email) error = 'Fyll i din mejladress.';
    else if (!isValidEmail(email)) error = 'Ange en giltig mejladress.';
    else if (!phone) error = 'Fyll i ditt telefonnummer.';
    else if (!isValidPhone(phone)) error = 'Ange ett giltigt telefonnummer.';

    if (error) {
      if (errorBox) {
        errorBox.textContent = error;
        errorBox.classList.add('show');
      }
      return;
    }

    if (errorBox) {
      errorBox.textContent = '';
      errorBox.classList.remove('show');
    }

    form.outerHTML = `
      <div class="contact-confirmed">
        <div class="contact-confirmed-title">Kontaktuppgifter registrerade</div>
        <div class="contact-confirmed-row"><span>Namn</span><strong>${escapeHtml(name)}</strong></div>
        <div class="contact-confirmed-row"><span>Mejl</span><strong>${escapeHtml(email)}</strong></div>
        <div class="contact-confirmed-row"><span>Telefon</span><strong>${escapeHtml(phone)}</strong></div>
        <div class="contact-confirmed-row"><span>Stad</span><strong>${escapeHtml(city)}</strong></div>
        </div>
    `;

    awaitingContact = false;
    step += 1;
    registerTimer(() => addBotBubble(currentFlow.finalText), 300);
  };

  const handleClick = (event) => {
    const target = event.target;

    const sendButton = target.closest('.send-btn');
    if (sendButton && container.contains(sendButton)) {
      event.preventDefault();
      sendMsg();
      return;
    }

    const chip = target.closest('.chip');
    if (!chip || !container.contains(chip) || chip.disabled) return;

    const label = chip.textContent.replace(/\s+/g, ' ').trim();
    const initialFlow = !currentFlow ? initialFlowLabels.get(label) : null;

    if (initialFlow) {
      event.preventDefault();
      selectFlow(chip, initialFlow);
      return;
    }

    event.preventDefault();
    replyWithChip(chip, label);
  };

  const handleKeydown = (event) => {
    if (event.key !== 'Enter') return;
    if (event.target.id !== 'msg') return;
    event.preventDefault();
    sendMsg();
  };

  const handleSubmit = (event) => {
    const form = event.target.closest('.contact-form');
    if (!form || !container.contains(form)) return;
    event.preventDefault();
    submitContact(form);
  };

  container.addEventListener('click', handleClick);
  container.addEventListener('keydown', handleKeydown);
  container.addEventListener('submit', handleSubmit);

  return () => {
    container.removeEventListener('click', handleClick);
    container.removeEventListener('keydown', handleKeydown);
    container.removeEventListener('submit', handleSubmit);
    timers.forEach(timer => window.clearTimeout(timer));
    timers.clear();
  };
}
