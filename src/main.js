const colors = [
 '#40E0D0', '#800000', '#008080', '#EE82EE', '#F5F5DC', '#F5DEB3', '#F4A460', '#F0E68C', '#EEE8AA', '#E9967A', '#E6E6FA', '#E0FFFF', '#DEB887', '#DDA0DD', '#DCDCDC', '#DC143C', '#DB7093', '#DAA520', '#DA70D6', '#D8BFD8', '#D3D3D3', '#D2B48C', '#D2691E', '#CD853F', '#CD5C5C', '#C71585', '#C0C0C0', '#B22222', '#B0E0E6', '#B0C4DE', '#B0B0B0'
  ,'#00FFFF', '#FFA500', '#800080', '#008000', '#000080',
  '#808080', '#A52A2A', '#FFC0CB', '#FFD700', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',, '#4B0082',
  
];

let score = 0;
let targetColor;
let gameActive = true;

const colorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptions = document.querySelectorAll('[data-testid="colorOption"]');
const gameStatus = document.querySelector('[data-testid="gameStatus"]');
const scoreElement = document.querySelector('[data-testid="score"]');
const newGameBtn = document.querySelector('[data-testid="newGameButton"]');


const modalOverlay = document.querySelector('[data-testid="modalOverlay"]');
const correctModal = document.querySelector('.correct-modal');
const wrongModal = document.querySelector('.wrong-modal');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

function showModal(isCorrect) {
  modalOverlay.style.display = 'flex';
  correctModal.style.display = isCorrect ? 'block' : 'none';
  wrongModal.style.display = isCorrect ? 'none' : 'block';
  
  if (isCorrect) {
    correctSound.play();
  } else {
    wrongSound.play();
  }
}

function hideModal() {
  modalOverlay.style.display = 'none';
  correctModal.style.display = 'none';
  wrongModal.style.display = 'none';
}

function handleColorClick(e) {
  if (!gameActive) return;

  const selectedColor = rgbToHex(e.target.style.backgroundColor);
  e.target.classList.add('shake');

  if (selectedColor.toLowerCase() === targetColor.toLowerCase()) {
    gameActive = false;
    score++;
    scoreElement.textContent = score;
    showModal(true);
    
    colorBox.classList.add('pulse');
    colorOptions.forEach(btn => btn.disabled = true);

    setTimeout(() => {
      hideModal();
      initializeGame();
    }, 3000);
  } else {
    score = Math.max(0, score - 1); // Prevent negative scores
    scoreElement.textContent = score;
    showModal(false);
    
    e.target.disabled = true;

    setTimeout(() => {
      hideModal();
    }, 2000);
  }
}

function initializeGame() {
  hideModal();
  gameActive = true;
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  colorBox.style.backgroundColor = targetColor;
  newGameBtn.style.backgroundColor = targetColor;
  newGameBtn.style.color = getContrastColor(targetColor);
  newGameBtn.style.textShadow = getContrastColor(targetColor) === '#FFFFFF' 
    ? '0 0 3px rgba(0, 0, 0, 0.5)' 
    : '0 0 3px rgba(255, 255, 255, 0.5)';
  
  const optionColors = new Set([targetColor]);
  while (optionColors.size < 6) {
    optionColors.add(colors[Math.floor(Math.random() * colors.length)]);
  }
  
  const shuffledColors = Array.from(optionColors).sort(() => Math.random() - 0.5);
  
  colorOptions.forEach((btn, index) => {
    btn.style.backgroundColor = shuffledColors[index];
    btn.disabled = false;
    btn.classList.remove('shake', 'pulse');
  });
  
  gameStatus.textContent = '';
}

function rgbToHex(rgb) {
  const matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!matches) return null;
  
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return '#' + componentToHex(+matches[1]) + 
                componentToHex(+matches[2]) + 
                componentToHex(+matches[3]);
}
function getContrastColor(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#FFFFFF';
}
// function handleColorClick(e) {
//   if (!gameActive) return;
  
//   const selectedColor = rgbToHex(e.target.style.backgroundColor);
//   e.target.classList.add('shake');
  
//   console.log(selectedColor, targetColor);

//   if (selectedColor.toLowerCase() === targetColor.toLowerCase()) {
//     gameActive = false;
//     score++;
//     scoreElement.textContent = score;
//     gameStatus.textContent = 'Correct! Well done!';
//     colorBox.classList.add('pulse');
//     colorOptions.forEach(btn => btn.disabled = true);
//   } else {
//     // score--;
//     gameStatus.textContent = 'Incorrect! Try again!';
//     e.target.disabled = true;
//   }
// }

colorOptions.forEach(btn => {
  btn.addEventListener('click', handleColorClick);
});



newGameBtn.addEventListener('click', () => {
  colorBox.classList.remove('pulse');
  score = 0;
  initializeGame();
});


initializeGame();