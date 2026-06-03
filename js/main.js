document.addEventListener('DOMContentLoaded', () => {
    /* =========== BOOT SEQUENCE =========== */
    const bootSeq = document.getElementById('bootSeq');
    const heroContent = document.getElementById('heroContent');
    const bootLines = bootSeq ? bootSeq.querySelectorAll('.boot-line') : [];

    bootLines.forEach((line, i) => {
      line.style.animationDelay = `${i * 0.6}s`;
    });

    if (bootSeq) {
      setTimeout(() => {
        bootSeq.style.opacity = '0';
        bootSeq.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          bootSeq.style.display = 'none';
          if (heroContent) heroContent.classList.add('visible');
          startTyping();
        }, 500);
      }, 3200);
    }

    /* =========== TYPED ROLE =========== */
    function startTyping() {
      const roles = [
        'SOC Analyst L1',
        'Blue Teaming',
        'SAP BASIS',
      ];
      let ri = 0, ci = 0, deleting = false;
      const el = document.getElementById('typedRole');
      if (!el) return;

      function tick() {
        const word = roles[ri];
        if (!deleting) {
          el.textContent = word.slice(0, ++ci);
          if (ci === word.length) { deleting = true; return setTimeout(tick, 3000); }
        } else {
          el.textContent = word.slice(0, --ci);
          if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
        }
        setTimeout(tick, deleting ? 50 : 80);
      }
      tick();
    }

    /* =========== SKILL BARS =========== */
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target.querySelector('.skill-progress');
          const lvl = e.target.dataset.level;
          if (bar) {
            setTimeout(() => {
              bar.style.width = lvl + '%';
            }, 200);
          }
          skillObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill').forEach(s => skillObserver.observe(s));

    /* =========== REVEAL ON SCROLL =========== */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* =========== TERMINAL LOGIC =========== */
    const termInput = document.getElementById('termInput');
    const termOutput = document.getElementById('termOutput');

    const commands = {
      help: 'Available commands: <span class="hl-cyan">about · skills · projects · certs · contact · clear</span>',
      about: 'Cybersecurity professional. Blue Team | SOC Ops | Threat Detection | Incident Response.',
      skills: 'SIEM: 85% · Threat Detection: 80% · Incident Response: 75% · Python: 70%',
      projects: '01 Home SOC Lab · 02 Detection Rules · 03 Threat Hunting · 04 Blue Team Portfolio',
      certs: 'SAL1 [IN PROGRESS] · Security Awareness [DONE] · Future certs [QUEUED]',
      contact: '<span class="hl-cyan">GitHub</span> · <span class="hl-purple">LinkedIn</span> — links coming soon.',
      clear: '__CLEAR__',
      whoami: '<span class="hl-cyan">sebastián_caracuel</span> — Blue Team Analyst. Threat hunter. Defender.',
      sudo: 'Nice try. Permission denied. 🔐',
      ls: 'about.txt  skills.dat  projects/  certs.log  contact.md',
    };

    if (termInput && termOutput) {
      termInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const raw = termInput.value.trim().toLowerCase();
        termInput.value = '';

        addLine(`<span class="t-prompt">root@invitado:~$</span> <span class="t-cmd">${raw}</span>`);

        if (raw === '') return;

        if (raw === 'clear') {
          termOutput.innerHTML = '';
          addLine('<span class="t-prompt">root@invitado:~$</span> <span class="cursor-blink">█</span>');
          return;
        }

        const resp = commands[raw] ?? `<span class="t-err">command not found: ${raw} — try 'help'</span>`;
        addLine(`<span class="t-response">${resp}</span>`);
        addLine('<span class="t-prompt">root@invitado:~$</span> <span class="cursor-blink">█</span>');
      });
    }

    function addLine(html) {
      if (!termOutput) return;
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML = html;
      termOutput.appendChild(div);
      termOutput.scrollTop = termOutput.scrollHeight;
    }

    /* =========== GLITCH RANDOM =========== */
    const glitch = document.querySelector('.glitch');
    if (glitch) {
      setInterval(() => {
        glitch.classList.add('glitch-active');
        setTimeout(() => glitch.classList.remove('glitch-active'), 300);
      }, 4000);
    }
});
