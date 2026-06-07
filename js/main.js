document.addEventListener('DOMContentLoaded', () => {

  /* ── CLOCK: local Chile time, no fake "UTC" label ── */
  const cl = document.getElementById('sysTime');
  const tick = () => {
    cl.textContent = new Date().toLocaleTimeString('es-CL', {
      timeZone: 'America/Santiago',
      hour12: false
    });
  };
  tick();
  setInterval(tick, 1000);

  /* ── BOOT SEQUENCE ── */
  const bootSeq    = document.getElementById('bootSeq');
  const heroContent = document.getElementById('heroContent');
  const lines = bootSeq.querySelectorAll('.boot-line');
  lines.forEach((l, i) => { l.style.animationDelay = (i * 0.6) + 's'; });
  setTimeout(() => {
    bootSeq.style.transition = 'opacity .5s';
    bootSeq.style.opacity = '0';
    setTimeout(() => {
      bootSeq.style.display = 'none';
      heroContent.classList.add('visible');
      startTyping();
    }, 500);
  }, lines.length * 600 + 300);

  /* ── TYPED ROLE ── */
  function startTyping() {
    const roles = ['SOC Analyst L1', 'Blue Team', 'SAP BASIS Consultant', 'Ethical Hacker'];
    let ri = 0, ci = 0, del = false;
    const el = document.getElementById('typedRole');
    function t() {
      const w = roles[ri];
      if (!del) {
        el.textContent = w.slice(0, ++ci);
        if (ci === w.length) { del = true; return setTimeout(t, 2800); }
      } else {
        el.textContent = w.slice(0, --ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(t, del ? 40 : 80);
    }
    t();
  }

  /* ── SKILL BARS ── */
  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const bar = e.target.querySelector('.bar-fill');
      if (bar) setTimeout(() => { bar.style.width = e.target.dataset.lv + '%'; }, 150);
      sObs.unobserve(e.target);
    });
  }, { threshold: .3 });
  document.querySelectorAll('.skill-item').forEach(s => sObs.observe(s));

  /* ── REVEAL ON SCROLL ── */
  const rObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      rObs.unobserve(e.target);
    });
  }, { threshold: .07 });
  document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));

  /* ── GLITCH ── */
  const g = document.querySelector('.glitch');
  if (g) {
    setInterval(() => {
      g.classList.add('active');
      setTimeout(() => g.classList.remove('active'), 220);
    }, 4000);
  }

  /* ── TERMINAL (XSS-safe) ── */
  const input = document.getElementById('termInput');
  const out   = document.getElementById('termOut');

  const cmds = {
    help:     'Commands: about · skills · projects · certs · contact · whoami · clear',
    about:    'Computer Engineer. SAP BASIS consultant by day, cybersecurity apprentice by night.',
    skills:   'Network Analysis: 55% · Endpoint Security: 70% · Phishing Analysis: 85% · Vuln Assessment: 67% · Web App Security: 45% · Digital Forensics: 58% · Security Foundations: 90%',
    projects: '01 Portfolio · 02 HTB/TryHackMe Writeups · 03 SAP BASIS Docs · 04 Home SOC Lab',
    certs:    'SAL1 [COMPLETED] · CJCA [IN PROGRESS 75%] · Security+ [QUEUED] · CDSA [QUEUED]',
    contact:  'GitHub · LinkedIn — links coming soon.',
    whoami:   'sebastián_caracuel — Blue Team Analyst. Threat hunter. Defender.',
    sudo:     'Permission denied. Nice try. 🔐',
    ls:       'about.txt  skills.dat  projects/  certs.log  contact.md',
  };

  function addPromptLine() {
    const d = document.createElement('div');
    d.className = 'tl';
    const prompt = document.createElement('span');
    prompt.className = 'tp';
    prompt.textContent = 'operator@local:~$';
    const cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.textContent = ' █';
    d.appendChild(prompt);
    d.appendChild(cursor);
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }

  function addLine(text, className) {
    const d = document.createElement('div');
    d.className = 'tl';
    const span = document.createElement('span');
    if (className) span.className = className;
    span.textContent = text;
    d.appendChild(span);
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }

  function addInputEcho(raw) {
    const d = document.createElement('div');
    d.className = 'tl';
    const prompt = document.createElement('span');
    prompt.className = 'tp';
    prompt.textContent = 'operator@local:~$';
    const cmd = document.createElement('span');
    cmd.className = 'tc';
    cmd.textContent = ' ' + raw;
    d.appendChild(prompt);
    d.appendChild(cmd);
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim().toLowerCase();
    input.value = '';
    addInputEcho(raw);
    if (!raw) { addPromptLine(); return; }
    if (raw === 'clear') {
      out.innerHTML = '';
      addPromptLine();
      return;
    }
    const response = cmds[raw];
    if (response) {
      if (raw === 'help') {
        const d = document.createElement('div');
        d.className = 'tl';
        const block = document.createElement('span');
        block.className = 'tr';
        block.textContent = 'Commands: ';
        const hl = document.createElement('span');
        hl.className = 'term-cmd-list';
        hl.textContent = 'about · skills · projects · certs · contact · whoami · clear';
        block.appendChild(hl);
        d.appendChild(block);
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
      } else {
        addLine(response, raw === 'sudo' ? 'te tr' : 'tr');
      }
    } else {
      addLine("command not found: " + raw + " — type 'help'", 'te');
    }
    addPromptLine();
  });

  /* ── TICKER ── */
  const certData = {
    blueTeam: {
      completed: [
        { name: 'SAL1',  platform: 'TryHackMe - Security Analyst L1', icon: '🛡️' },
        { name: 'DP-900', platform: 'Azure Data Fundamentals',          icon: '☁️' },
      ],
      inProgress: [
        { name: 'Security+', platform: 'CompTIA',                            progress: 0,  icon: '🔐' },
        { name: 'CDSA',      platform: 'Certified Defensive Security Analyst', progress: 0, icon: '🛡️' },
      ],
    },
    redTeam: {
      inProgress: [
        { name: 'CJCA', platform: 'Certified Junior Cybersecurity Associate', progress: 75, icon: '⚔️' },
        { name: 'EJPT', platform: 'eLearnSecurity',                           progress: 0,  icon: '🃏' },
      ],
    },
  };

  function buildBar(progress) {
    const filled = Math.floor(progress / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
  }

  const broadcastItems = [
    '◥(■_■)◤  BLUE TEAM  ◥(■_■)◤',
    ...certData.blueTeam.completed.map(c =>
      `${c.icon} ${c.name} [${c.platform}] ✅ COMPLETED`
    ),
    ...certData.blueTeam.inProgress.map(c =>
      `${c.icon} ${c.name} [${c.platform}] ${buildBar(c.progress)} ${c.progress}% PROGRESS`
    ),
    '┌(◣_◢)┘  RED TEAM  ┌(◣_◢)┘',
    ...certData.redTeam.inProgress.map(c =>
      `${c.icon} ${c.name} [${c.platform}] ${buildBar(c.progress)} ${c.progress}% PROGRESS`
    ),
  ];

  let currentIndex = 0;
  const tickerSpan = document.getElementById('tickerText');

  function updateTicker() {
    if (!tickerSpan) return;
    tickerSpan.textContent = broadcastItems[currentIndex % broadcastItems.length];
    currentIndex++;
  }

  setTimeout(updateTicker, 100);
  setInterval(updateTicker, 8500);

});