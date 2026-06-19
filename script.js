const PASSWORD = "SARAFDAY";

let questionIndex = 0;
let blown = 0;
let geoIndex = 0;
let popped = 0;
let audioCtx = null;
let musicStarted = false;
let musicTimer = null;

const questions = [
  {
    q: "How old are you today?",
    options: [
      ["9", "Correct. We have reviewed your application and determined that adulthood is a scam.", true],
      ["Nine and a half", "Correct. Nine and a half is a very serious age.", true],
      ["Basically 9", "Correct. Basically 9. We reject all other information.", true]
    ]
  },
  {
    q: "What is Saraf?",
    options: [
      ["A friend", "Incorrect. Please read the question carefully and try again.", false],
      ["A best friend", "Correct. The committee is pleased with this answer.", true],
      ["One of my favourite people on earth", "Also correct. In fact, this may be the most correct answer available.", true]
    ]
  },
  {
    q: "How many presents should Saraf receive?",
    options: [
      ["Many", "Excellent. You clearly understand the assignment.", true],
      ["More than many", "Correct. This is the responsible answer.", true],
      ["An irresponsible amount", "Correct. Finally, someone sensible.", true]
    ]
  },
  {
    q: "Are you prepared to receive an alarming amount of birthday affection today?",
    options: [
      ["Yes", "Thank you. The birthday department appreciates your cooperation.", true],
      ["Absolutely", "Correct. Very brave of you.", true],
      ["I suppose", "Accepted, but with concern.", true]
    ]
  }
];

const geoLines = [
  "So instead you are receiving this website.",
  "It is essentially a digital birthday card that got wildly out of hand.",
  "It is not as good as being there.",
  "But it does have significantly more confetti than I do."
];

function getAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function tone(freq, start, duration, volume = 0.08, type = "triangle") {
  const ctx = getAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.03);
}

function soundChime() {
  tone(659, 0, 0.13, 0.06);
  tone(880, 0.09, 0.16, 0.05);
}

function soundBoop() {
  tone(220, 0, 0.12, 0.06, "sine");
}

function soundTwinkle() {
  tone(784, 0, 0.12, 0.05);
  tone(1046, 0.08, 0.16, 0.05);
  tone(1318, 0.18, 0.18, 0.045);
}

function startBackgroundMusic() {
  if (musicStarted) return;
  const ctx = getAudio();
  if (!ctx) return;

  musicStarted = true;
  document.getElementById("musicPill").style.display = "block";
  document.getElementById("musicPill").innerText = "music: on";

  const melody = [
    392, 440, 523, 440,
    392, 330, 392, 440,
    523, 587, 523, 440,
    392, 440, 392
  ];

  function playLoop() {
    melody.forEach((freq, i) => {
      tone(freq, i * 0.28, 0.20, 0.035, "triangle");
    });
  }

  playLoop();
  musicTimer = setInterval(playLoop, melody.length * 280 + 1000);
  confetti(80);
  soundTwinkle();
}

function checkPassword() {
  const input = document.getElementById("passwordInput").value.trim().toUpperCase();
  const note = document.getElementById("passwordNote");
  note.style.display = "block";

  if (input === PASSWORD) {
    note.innerText = "Password accepted.\nBirthday access granted.";
    confetti(100);
    soundChime();
    setTimeout(() => nextPage(1), 800);
  } else {
    note.innerText = "Identity could not be verified.\nAre you sure you are Saraf?";
    soundBoop();
  }
}

function nextPage(num) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page" + num).classList.add("active");
  window.scrollTo(0, 0);
  confetti(18);
  if (num !== 10) soundChime();

  if (num === 2) showQuestion();
  if (num === 5) setupBalloonGame();
}

function showQuestion() {
  const area = document.getElementById("questionArea");
  const msg = document.getElementById("checkMessage");
  const nextBtn = document.getElementById("nextQuestionBtn");
  const checkNext = document.getElementById("checkNext");

  msg.style.display = "none";
  nextBtn.style.display = "none";
  checkNext.style.display = "none";
  document.getElementById("progressFill").style.width = ((questionIndex / questions.length) * 100) + "%";

  const current = questions[questionIndex];
  area.innerHTML = `<p><b>${current.q}</b></p>`;

  current.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt[0];
    btn.onclick = () => answerQuestion(opt[1], opt[2]);
    area.appendChild(btn);
  });
}

function answerQuestion(text, correct) {
  const msg = document.getElementById("checkMessage");
  msg.style.display = "block";
  msg.innerText = text;

  if (!correct) {
    confetti(6);
    soundBoop();
    return;
  }

  confetti(35);
  soundChime();

  if (questionIndex === questions.length - 1) {
    document.getElementById("progressFill").style.width = "100%";
    document.getElementById("checkNext").style.display = "inline-block";
    msg.innerText = text + "\n\nBirthday status confirmed.\nFavourite-person status confirmed.";
  } else {
    document.getElementById("nextQuestionBtn").style.display = "inline-block";
  }
}

function nextQuestion() {
  questionIndex++;
  showQuestion();
}

function blowCandle(el) {
  if (el.classList.contains("out")) return;
  el.classList.add("out");
  blown++;

  const box = document.getElementById("candleMessage");
  box.style.display = "block";
  soundTwinkle();

  if (blown === 1) box.innerText = "⭐ Wish received.";
  if (blown === 2) box.innerText = "⭐ Extra wish received.";
  if (blown === 3) {
    box.innerText = "⭐ Triple wish combo activated.\n\nBefore we continue...\nYou make my life brighter than you probably realise.\nSome people make days easier simply by existing.\nYou are one of those people for me.";
    document.getElementById("afterCandles").style.display = "inline-block";
    confetti(120);
  }
}

function geoNext() {
  const text = document.getElementById("geoText");
  if (geoIndex < geoLines.length) {
    text.innerText = geoLines[geoIndex];
    geoIndex++;
    soundChime();
  } else {
    document.getElementById("geoBtn").style.display = "inline-block";
    confetti(50);
    soundTwinkle();
  }
}

function setupBalloonGame() {
  popped = 0;
  document.getElementById("popCount").innerText = "Balloons popped: 0/5";
  document.getElementById("popNote").style.display = "none";
  document.getElementById("popNext").style.display = "none";

  const area = document.getElementById("popArea");
  area.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const el = document.createElement("div");
    el.className = "popBalloon";
    el.innerText = "🎈";
    el.style.left = Math.random() * 75 + 8 + "%";
    el.style.top = Math.random() * 65 + 10 + "%";
    el.onclick = () => popBalloon(el);
    area.appendChild(el);
  }
}

function popBalloon(el) {
  el.remove();
  popped++;
  document.getElementById("popCount").innerText = `Balloons popped: ${popped}/5`;
  confetti(15);
  soundBoop();

  if (popped >= 5) {
    document.getElementById("popNote").style.display = "block";
    document.getElementById("popNote").innerText = "Excellent.\nBalloon destruction licence granted.";
    document.getElementById("popNext").style.display = "inline-block";
    confetti(70);
    soundTwinkle();
  }
}

function openNote(tile, text) {
  tile.classList.add("opened");
  tile.querySelector(".emoji").innerText = "💖";
  const note = document.getElementById("letterNote");
  note.style.display = "block";
  note.innerText = text;
  confetti(20);
  soundChime();
}

function spinWheel() {
  const wheel = document.getElementById("wheel");
  const note = document.getElementById("wheelNote");

  const outcomes = [
    "You have won: unlimited attention.",
    "You have won: snack rights for the entire day.",
    "You have won: one dramatic entrance. Please use responsibly.",
    "You have won: compliments. Too many compliments. Legally concerning.",
    "You have won: best friend affection. Non-transferable."
  ];

  wheel.classList.remove("spin");
  void wheel.offsetWidth;
  wheel.classList.add("spin");

  soundTwinkle();

  setTimeout(() => {
    note.style.display = "block";
    note.innerText = outcomes[Math.floor(Math.random() * outcomes.length)];
    confetti(70);
    soundChime();
  }, 1200);
}

function startCounter() {
  const nums = ["12%", "46%", "81%", "145%", "276%", "904%", "ERROR"];
  let i = 0;
  const counter = document.getElementById("counter");
  const note = document.getElementById("counterNote");
  note.style.display = "none";

  const interval = setInterval(() => {
    counter.innerText = nums[i];
    tone(300 + i * 90, 0, 0.08, 0.04);
    i++;
    if (i >= nums.length) {
      clearInterval(interval);
      note.style.display = "block";
      note.innerText = "Friendship exceeds measuring equipment.";
      confetti(90);
      soundTwinkle();
    }
  }, 330);
}

function startParade() {
  const line = document.getElementById("paradeLine");
  const bubble = document.getElementById("songBubble");

  line.classList.remove("marching");
  void line.offsetWidth;
  line.classList.add("marching");

  const words = ["HAP", "PY", "BIRTH", "DAY", "SA", "RAF", "💖"];
  let i = 0;

  const interval = setInterval(() => {
    bubble.innerText = words[i] || "HAPPY BIRTHDAY SARAF";
    i++;
    if (i > words.length) clearInterval(interval);
  }, 650);

  playBirthdayTune();
  confetti(160);

  setTimeout(() => {
    document.getElementById("paradeNext").style.display = "inline-block";
  }, 9000);
}

function playBirthdayTune() {
  const notes = [
    262, 262, 294, 262, 349, 330,
    262, 262, 294, 262, 392, 349,
    262, 262, 523, 440, 349, 330, 294,
    466, 466, 440, 349, 392, 349
  ];

  const durations = [
    0.28, 0.18, 0.42, 0.42, 0.42, 0.75,
    0.28, 0.18, 0.42, 0.42, 0.42, 0.75,
    0.28, 0.18, 0.42, 0.42, 0.42, 0.42, 0.85,
    0.28, 0.18, 0.42, 0.42, 0.42, 0.9
  ];

  let time = 0;

  notes.forEach((freq, i) => {
    tone(freq, time, durations[i], 0.12, "triangle");
    time += durations[i] + 0.06;
  });
}

function claimCake() {
  const note = document.getElementById("cakeNote");
  const cake = document.getElementById("finalCakeWrap");
  const finalText = document.getElementById("finalText");

  note.style.display = "block";
  note.innerText = "Birthday finale loading...\n\nUnexpected amount of celebration detected.\nAdjusting...";

  setTimeout(() => {
    cake.style.display = "block";
    confetti(200);
    soundTwinkle();
  }, 800);

  setTimeout(() => {
    finalText.style.display = "block";
    confetti(240);
    playBirthdayTune();
  }, 1600);
}

function secretSparkle() {
  confetti(130);
  sparkleBurst(24);
  soundTwinkle();
}

function confetti(count) {
  const colors = ["#ff4fa3", "#ffd166", "#a8ddff", "#bfa2ff", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti");
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 1.8 + 2.2) + "s";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3500);
  }
}

function sparkleBurst(count = 12) {
  const icons = ["✨", "⭐", "💖", "🎀"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("div");
    s.className = "sparkle-pop";
    s.innerText = icons[Math.floor(Math.random() * icons.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

function floatingDecor() {
  const icons = ["🎈", "✨", "💖", "🎀", "⭐"];
  setInterval(() => {
    const el = document.createElement("div");
    el.classList.add("floating");
    el.innerText = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = (Math.random() * 4 + 7) + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 10000);
  }, 1600);
}

floatingDecor();
