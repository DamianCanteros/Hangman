const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const gameOver = document.getElementById('signOver');
const signStart = document.getElementById('signStart');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let hiddenInput = document.getElementById('hiddenInput');

const bodyParts = [
    [8,2,1,1],
    [8,3,1,3],
    [7,6,1,2],
    [9,6,1,2],
    [6,3,2,1],
    [9,3,2,1]
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;


const endGame = () => {
    document.removeEventListener('keydown', letterEvent);
    hiddenInput.removeEventListener('input', mobileLetterEvent);
    startButton.style.display = 'block';
}

//dibuja las extremidades
const addExtremities = bodyPart => {
    ctx.fillStyle = 'hsl(0, 0%, 0%)';
    ctx.fillRect(...bodyPart);
};

//dibuja las partes del cuerpo
const addBody = bodyPart => {
    ctx.strokeRect(...bodyPart);
};

//carga los errores
const wrongLetter = () => {
    mistakes < 2 ? addBody(bodyParts[mistakes]) : addExtremities(bodyParts[mistakes]);
    mistakes++;
    if(mistakes === bodyParts.length) {
        endGame();
        gameOver.textContent = 'Game Over';
        gameOver.style.display = 'block';
    }
}

//visiviliza la letra acertada
const correctLetter = letter => {
    const { children } =  wordContainer;
    for(let i = 0; i < children.length; i++) {
        if(children[i].innerHTML === letter) {
            children[i].classList.toggle('hidden');
            hits++;
        }
    }
    if(hits === selectedWord.length) {
        endGame();
        gameOver.textContent = 'You Win';
        gameOver.style.display = 'block';
    }
}

//comprueba si la letra esta en la palabra
const letterInput = letter => {
    if(selectedWord.includes(letter)) {
        correctLetter(letter);
    } else {
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter);
};

//dibuja la letra ingresada 
const addLetter = letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement);
}

//carga la letra ingresada si no esta repetida
const letterEvent = event => {
    let newLetter = String.fromCharCode(event.keyCode).toUpperCase();
    if(!usedLetters.includes(newLetter)) {
        letterInput(newLetter);
    };
};

//dibuja las letras de la palabra
const drawWord = () => {
    selectedWord.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter;
        letterElement.classList.add('letter');
        letterElement.classList.add('hidden');
        wordContainer.appendChild(letterElement);
    });
};

//selecciona una palabra Aleatoriamente
const selectRandomWord = () => {
    let word = words[Math.floor((Math.random() * words.length))].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");;
    selectedWord = word.split('');
   };

//dibuja la horca
const drawGallows = () => {
    ctx.canvas.width  = 220;
    ctx.canvas.height = 260;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'hsl(19, 69%, 49%)';
    ctx.fillRect(0, 12, 6, 1);
    ctx.fillRect(1, 0, 1, 12);
    ctx.fillRect(2, 0, 7, 1);
    ctx.fillRect(8, 1, 1, 1);
};

// muestra el teclado en dispositivos móviles
const showKeyboard = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.style.position = 'absolute';
    inputElement.style.opacity = '0';
    document.body.appendChild(inputElement);
    inputElement.focus();
};

// inicia el juego
const startGame = () => {
    signStart.style.display = 'none';
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    gameOver.style.display = 'none';
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    drawGallows();
    selectRandomWord();
    drawWord();
    // agregamos el event listener para el botón Start
    startButton.addEventListener('click', () => {
        document.addEventListener('keydown', letterEvent);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // si el usuario está en un dispositivo móvil, mostramos el teclado virtual
            showKeyboard();
        }
    });

    // agregamos el event listener para la entrada de texto oculta
    hiddenInput.addEventListener('input', (event) => {
        let newLetter = event.target.value.charAt(event.target.value.length - 1).toUpperCase();
        if (newLetter && !usedLetters.includes(newLetter)) {
            letterInput(newLetter);
        }
        event.target.value = '';
    });
};

document.addEventListener('DOMContentLoaded', drawGallows);
startButton.addEventListener('click', startGame);
