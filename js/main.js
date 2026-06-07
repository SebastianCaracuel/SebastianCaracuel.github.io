document.addEventListener('DOMContentLoaded', () => {

  /* Clock */
  const cl = document.getElementById('sysTime');
  const tick = () => cl.textContent = new Date().toLocaleTimeString('en-GB') + ' UTC';
  tick(); setInterval(tick, 1000);

  /* Dismiss error popup */
  window.dismissErr = () => {
    const w = document.getElementById('winError');
    if (w) w.style.display = 'none';
  };
  document.getElementById('closeErr').addEventListener('click', dismissErr);
  setTimeout(dismissErr, 8000);

  /* Boot sequence */
  const bootSeq = document.getElementById('bootSeq');
  const heroContent = document.getElementById('heroContent');
  const lines = bootSeq.querySelectorAll('.boot-line');
  lines.forEach((l, i) => l.style.animationDelay = (i * .6) + 's');
  setTimeout(() => {
    bootSeq.style.transition = 'opacity .5s'; bootSeq.style.opacity = '0';
    setTimeout(() => { bootSeq.style.display = 'none'; heroContent.classList.add('visible'); startTyping(); }, 500);
  }, lines.length * 600 + 300);

  /* Typed role */
  function startTyping() {
    const roles = ['SOC Analyst L1', 'Blue Team Operator', 'SAP BASIS Consultant', 'Threat Hunter'];
    let ri = 0, ci = 0, del = false;
    const el = document.getElementById('typedRole');
    function t() {
      const w = roles[ri];
      if (!del) { el.textContent = w.slice(0, ++ci); if (ci === w.length) { del = true; return setTimeout(t, 2800); } }
      else { el.textContent = w.slice(0, --ci); if (ci === 0) { del = false; ri = (ri + 1) % roles.length; } }
      setTimeout(t, del ? 40 : 80);
    }
    t();
  }

  /* Skill bars */
  const sObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target.querySelector('.bar-fill');
        if (bar) setTimeout(() => bar.style.width = e.target.dataset.lv + '%', 150);
        sObs.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  document.querySelectorAll('.skill-item').forEach(s => sObs.observe(s));

  /* Reveal */
  const rObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rObs.unobserve(e.target); } });
  }, { threshold: .07 });
  document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));

  /* Glitch */
  const g = document.querySelector('.glitch');
  if (g) setInterval(() => { g.classList.add('active'); setTimeout(() => g.classList.remove('active'), 220); }, 4000);




  /* Terminal */
  const input = document.getElementById('termInput');
  const out = document.getElementById('termOut');
  const cmds = {
    help: 'Commands: <span style="color:var(--accent)">about · skills · projects · certs · contact · whoami · clear</span>',
    about: 'Computer Engineer. SAP BASIS consultant by day, cybersecurity apprentice by night.',
    skills: 'SIEM: 85% · Threat Detection: 80% · Incident Response: 75% · Python: 70% · SAP BASIS: 78%',
    projects: '01 Portfolio · 02 Home SOC Lab · 03 Detection Rules · 04 Threat Hunting',
    certs: 'SAL1 [IN PROGRESS 60%] · Security Awareness [DONE] · Future certs [QUEUED]',
    contact: 'GitHub · LinkedIn — links coming soon.',
    whoami: 'sebastián_caracuel — Blue Team Analyst. Threat hunter. Defender.',
    sudo: '<span style="color:var(--red-err)">Permission denied. Nice try. 🔐</span>',
    ls: 'about.txt  skills.dat  projects/  certs.log  contact.md',
  };
  function addLine(html) { const d = document.createElement('div'); d.className = 'tl'; d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight; }
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const raw = input.value.trim().toLowerCase(); input.value = '';
    addLine(`<span class="tp">operator@local:~$</span> <span class="tc">${raw}</span>`);
    if (!raw) return;
    if (raw === 'clear') { out.innerHTML = ''; addLine('<span class="tp">operator@local:~$</span> <span class="cursor-blink">█</span>'); return; }
    const r = cmds[raw] || `<span class="te">command not found: ${raw} — type 'help'</span>`;
    addLine(`<span class="tr">${r}</span>`);
    addLine('<span class="tp">operator@local:~$</span> <span class="cursor-blink">█</span>');
  });

  /* ========== TICKER DINÁMICO ========== */

  /*Certificaciónes*/
  const certifications = {
    /*Certificaciones BLUE TEAM*/
    blueTeam: {
      completed: [
        { name: "SAL1", platform: "TryHackMe - Security Analyst L1", icon: "🛡️" },
        { name: "DP-900", platform: "Azure Data Fundamentals", icon: "☁️" }
      ],
      inProgress: [
        { name: "Security+", platform: "CompTIA", progress: 0, icon: "🔐" },
        { name: "CDSA", platform: "Certified Defensive Security Analyst", progress: 0, icon: "🛡️" }
      ],
    },
    /*Certificaciones RED TEAM*/
     redTeam: {
      inProgress: [
        { name: "CJCA", platform: "Certified Junior Cybersecurity Associate", progress: 75, icon: "⚔️" },
        { name: "EJPT", platform: "eLearnSecurity", progress: 0, icon: "🃏" }
      ],
    },

  };

  // LISTA DE MENSAJES QUE ROTARÁN (REDUCIDA Y OPTIMIZADA)
  const broadcastItems = [
    // Bloque 1

    "◥(■_■)◤  BLUE TEAM  ◥(■_■)◤",

    //Certificaciones BTL
    ...certifications.blueTeam.completed.map(cert => `${cert.icon} ${cert.name} [${cert.platform}] ✅ COMPLETADA`),

    //Certificaciones en Progreso BTL
    ...certifications.blueTeam.inProgress.map(cert => {
      const bar = "█".repeat(Math.floor(cert.progress / 10)) + "░".repeat(10 - Math.floor(cert.progress / 10));
      return `${cert.icon} ${cert.name} [${cert.platform}] ${bar} ${cert.progress}% EN PROGRESO`;
    }),

    "┌(◣_◢)┘  RED TEAM  ┌(◣_◢)┘",
   
   //Certificaciones en Progreso RTM
    ...certifications.redTeam.inProgress.map(cert => {
      const bar = "█".repeat(Math.floor(cert.progress / 10)) + "░".repeat(10 - Math.floor(cert.progress / 10));
      return `${cert.icon} ${cert.name} [${cert.platform}] ${bar} ${cert.progress}% EN PROGRESO`;
    }),

  ];

  // Control del ticker - CADA ITEM DURA 9 SEGUNDOS (más tiempo para leer)
  let currentIndex = 0;

  function getCurrentBroadcast() {
    const item = broadcastItems[currentIndex % broadcastItems.length];
    return typeof item === 'function' ? item() : item;
  }

  function updateTicker() {
    const tickerSpan = document.querySelector('.ticker-scroll span');
    if (tickerSpan) {
      tickerSpan.innerHTML = getCurrentBroadcast();
      currentIndex++;
    }
  }

  // CAMBIAR CADA 8 SEGUNDOS (antes era 4)
  setInterval(updateTicker, 8500);
  setTimeout(updateTicker, 100);


});