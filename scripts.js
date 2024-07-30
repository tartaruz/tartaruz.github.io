var inputSpeakBtn = document.querySelector(".btn-test-voice");
var inputTxt = document.querySelector("#your-text");
var voiceSelect = document.querySelector("#new-voice-list");

var synth = window.speechSynthesis;

function populateVoiceList() {
  if (typeof speechSynthesis === "undefined") {
    return;
  }

  var voices = synth.getVoices();

  if (voiceSelect) {
    voiceSelect.innerHTML = "";
    for (var i = 0; i < voices.length; i++) {
      var option = document.createElement("option");
      option.textContent = voices[i].name + " (" + voices[i].lang + ")";
      option.value = i;
      voiceSelect.appendChild(option);
    }
  }
}

populateVoiceList();
if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

if (inputSpeakBtn && voiceSelect) {
  inputSpeakBtn.addEventListener("click", function () {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute("value");
    utterThis.voice = synth.getVoices()[selectedOption];
    synth.speak(utterThis);
    inputTxt.blur();
  });
}

function speakText(text, shouldDisplay = true) {
  var voices = synth.getVoices();
  var randomIndex = Math.floor(Math.random() * voices.length);
  var utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = voices[randomIndex];
  synth.speak(utterThis);

  // Display the text below the eye
  if (!shouldDisplay) {
    return;
  }
  var speakTextDiv = document.getElementById("speak-text");
  speakTextDiv.textContent = text;
  speakTextDiv.style.display = "block";

  utterThis.onend = function (event) {
    speakTextDiv.style.display = "none";
    reactiveEye = true;
  };
}

function handleIntroductionClick() {
  if (!hasIntroductionBeenSpoken) {
    reactiveEye = false;
    speakText(text);
    hasIntroductionBeenSpoken = true;
    document.getElementById("click-eye-text").style.display = "none";
    animatePupil();
  }
}

let hasIntroductionBeenSpoken = false;

document.getElementById("thomas").addEventListener("click", function () {
  speakText("Thomas", false);
});

document.getElementById("ramirez").addEventListener("click", function () {
  speakText("Ramirez", false);
});

let isEyeOpen = true;
let isEyeTouched = false;
let targetX = 100;
let targetY = 50;
let mouseX = 100;
let mouseY = 50;

const play = (frequency = 300, duration = 1e3) => {
  const context = new AudioContext();
  const gainNode = context.createGain();
  const oscillator = context.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(0);
  setTimeout(() => oscillator.stop(), duration);
};

document.addEventListener("mousemove", (e) => {
  if (isEyeOpen) {
    const svg = document.querySelector("svg");
    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX = e.clientX;
    mouseY = e.clientY;

    const deviation = (Math.random() - 0.5) * 0.1;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX) + deviation;
    const distance = Math.min(
      30,
      Math.hypot(mouseX - centerX, mouseY - centerY) / 2
    );
    targetX = 100 + distance * Math.cos(angle);
    targetY = 50 + distance * Math.sin(angle);
  }
});

const eyeSvg = document.getElementById("eye-svg");

eyeSvg.addEventListener("mouseover", () => {
  if (isEyeOpen && !isEyeTouched && reactiveEye) {
    isEyeTouched = true;
    toggleEye(false);
  }
});

eyeSvg.addEventListener("mouseout", () => {
  if (!isEyeOpen && isEyeTouched) {
    toggleEye(true);
    isEyeTouched = false;
  }

  
});

eyeSvg.addEventListener("click", handleIntroductionClick);

function toggleEye(open) {
  isEyeOpen = open;
  document
    .getElementById("eye-open")
    .setAttribute("visibility", open ? "visible" : "hidden");
  document
    .getElementById("eye-closed")
    .setAttribute("visibility", open ? "hidden" : "visible");
  document
    .getElementById("pupil")
    .setAttribute("visibility", open ? "visible" : "hidden");
}
let reactiveEye = true;
function animatePupil() {
  const pupil = document.getElementById("pupil");
  const currentX = parseFloat(pupil.getAttribute("cx"));
  const currentY = parseFloat(pupil.getAttribute("cy"));
  const newX = currentX + (targetX - currentX) * 0.1;
  const newY = currentY + (targetY - currentY) * 0.1;

  pupil.setAttribute("cx", newX);
  pupil.setAttribute("cy", newY);

  // Limit the frame rate to 60 FPS
  setTimeout(() => {
    requestAnimationFrame(animatePupil);
  }, 1000 / 60);
}

function updateTargetPosition() {
  if (isEyeOpen) {
    const svg = document.querySelector("svg");
    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deviationX = (Math.random() - 0.5) * 10;
    const deviationY = (Math.random() - 0.5) * 10;
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    const distance = Math.min(
      30,
      Math.hypot(mouseX - centerX, mouseY - centerY) / 2
    );

    targetX = 100 + distance * Math.cos(angle) + deviationX;
    targetY = 50 + distance * Math.sin(angle) + deviationY;

    targetX = Math.max(70, Math.min(130, targetX));
    targetY = Math.max(20, Math.min(80, targetY));
  }

  const randomTime = Math.random() * (1000 - 500) + 500;
  setTimeout(updateTargetPosition, randomTime);
}

function setRandomInterval() {
  const openTime = Math.random() * (4.2 - 3.4) + 3.4;
  const closeTime = Math.random() * (0.4 - 0.1) + 0.1;

  setTimeout(() => {
    if (!isEyeTouched) {
      toggleEye(false);
      setTimeout(() => {
        toggleEye(true);
        setRandomInterval();
      }, closeTime * 1000);
    } else {
      setRandomInterval();
    }
  }, openTime * 1000);
}

function getRandomThankYou() {
  const thankYous = [
    "Thank you",
    "Gracias",
    "Merci",
    "Danke",
    "Grazie",
    "Takk",
    "ありがとう", // Arigatou
    "谢谢", // Xièxiè
    "Спасибо", // Spasibo
    "شكراً", // Shukran
  ];
  return thankYous[Math.floor(Math.random() * thankYous.length)];
}

function calculateExperience() {
  const startDate = new Date("2022-08-01");
  const today = new Date();
  const diffInMonths =
    (today.getFullYear() - startDate.getFullYear()) * 12 +
    today.getMonth() -
    startDate.getMonth();
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;
  return { years, months };
}

const experience = calculateExperience();

const introduction = `
  Hello, I am Thomas Ramirez, a full-stack developer based in Oslo, Norway. With ${experience.years} years and ${experience.months} months of experience in the field, 
  I am passionate about creating beautiful and functional websites, as well as exploring the potential of artificial intelligence. 
  I am always eager to learn new skills and take on exciting projects. If you have any questions or would like to collaborate, please feel free to contact me. 
  Thank you for visiting my website.
`;

const text = introduction + getRandomThankYou() + "!";

if (!hasIntroductionBeenSpoken) {
  document.getElementById("click-eye-text").style.display = "block";
}

updateTargetPosition();
setRandomInterval();
animatePupil();
