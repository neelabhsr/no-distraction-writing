const writer = document.getElementById('writer');
const fontSizeBtn = document.getElementById('font-size-toggle');
const themeToggle = document.getElementById('theme-toggle');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const backgroundToggle = document.getElementById('background-toggle');
const exportBtn = document.getElementById('export-pdf');
const themeIcon = document.getElementById('theme-icon');
const fullscreenIcon = document.getElementById('fullscreen-icon');

// Font Size Toggle
const fontSizes = [20, 24, 28, 32, 36];
let currentFontSizeIndex = 0;

const savedSize = localStorage.getItem('writingAppFontSize');
if (savedSize && fontSizes.includes(parseInt(savedSize))) {
  currentFontSizeIndex = fontSizes.indexOf(parseInt(savedSize));
  writer.style.fontSize = `${fontSizes[currentFontSizeIndex]}px`;
} else {
  writer.style.fontSize = `${fontSizes[0]}px`;
}

fontSizeBtn.addEventListener('click', () => {
  currentFontSizeIndex = (currentFontSizeIndex + 1) % fontSizes.length;
  const newSize = fontSizes[currentFontSizeIndex];
  writer.style.fontSize = `${newSize}px`;
  localStorage.setItem('writingAppFontSize', newSize);
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeIcon.textContent = document.body.classList.contains('dark-mode') ? 'light_mode' : 'dark_mode';
});

// Fullscreen Toggle
fullscreenToggle.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  fullscreenIcon.textContent = document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
});

// Background Toggle
const bgClasses = ['bg-white', 'bg-beige', 'bg-gray', 'bg-paper'];
let bgIndex = 0;

backgroundToggle.addEventListener('click', () => {
  writer.classList.remove(...bgClasses);
  bgIndex = (bgIndex + 1) % bgClasses.length;
  writer.classList.add(bgClasses[bgIndex]);
});

// PDF Export
exportBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const text = writer.innerText.trim() || ' ';
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 20);

  // Generate timestamped filename
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const defaultFilename = `Writing_App_${dd}${mm}${yy}_${hh}${min}.pdf`;

  doc.save(defaultFilename);
});

// --- Save and Load from LocalStorage ---
const LOCAL_STORAGE_KEY = 'writingAppContent';

// Load saved content on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedText = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedText !== null) {
    writer.innerText = savedText;
  }
});

// Save content on every input
writer.addEventListener('input', () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, writer.innerText);
});

const resetButton = document.getElementById('reset-button');

resetButton.addEventListener('click', () => {
  const confirmReset = confirm("Are you sure you want to reset and clear all text?");
  if (confirmReset) {
    writer.innerText = '';
    localStorage.removeItem('writingAppContent');
  }
});

const bottomFade = document.getElementById('bottom-fade');

function checkScrollPosition() {
  const writerElement = writer;
  const atBottom = writerElement.scrollHeight - writerElement.scrollTop <= writerElement.clientHeight + 1;
  bottomFade.classList.toggle('hidden', atBottom);
}

writer.addEventListener('scroll', checkScrollPosition);
window.addEventListener('resize', checkScrollPosition);

// Run once on page load
checkScrollPosition();