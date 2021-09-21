const curScore = document.getElementById('cur-score');
const highScore = document.getElementById('high-score');
const statusLog = document.getElementById('status');
const startButton = document.getElementById('start');

function disableStart() {
    startButton.style.display = 'none';
}

function enableStart() {
    startButton.style.display = 'block';
}

function sleep(miliseconds) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, miliseconds);
    });
}

startButton.onclick = function() {
    setupGame();
}

function chooseRandomColor() {
    const numColors = 4;
    const choice = Math.floor(Math.random() * numColors)
    return colorButtonIds[choice];
}

// game loop
var sequence;

var ptr;

const colorButtonIds = [
    'red',
    'green',
    'yellow',
    'blue',
]

async function setupGame() {
    disableStart();
    console.log(`setting up game`);
    sequence = [];
    curScore.textContent = 0;
    await startNewRound();
}

async function startNewRound() {
    ptr = 0;
    console.log(`starting new round`);
    statusLog.textContent = ":Watch";
    disableButtons();
    await sleep(1000);
    increaseSequence();
    await playSequence();
    enableButtons();
    statusLog.textContent = ":Play";
}

function increaseScore() {
    console.log(`increasing score`);
    curScore.textContent = parseInt(curScore.textContent) + 1;
}

function blink(id) {
    console.log(`blinking ${id}`);
    const button = document.getElementById(id);
    button.style.opacity = 1;
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            button.style.opacity = 0.3;
            resolve();
        }, 600);
    });
}

async function playSequence() {
    console.log(`playing sequence`);
    for(let idx in sequence) {
        const id = sequence[idx];
        await blink(id);
        await sleep(500);
    }
}

function increaseSequence() {
    console.log(`increasing sequence`);
    sequence.push(chooseRandomColor());
    console.log(sequence);
}

function disableButtons() {
    console.log(`disabling buttons`);
    for(let id in colorButtonIds) {
        const button = document.getElementById(colorButtonIds[id]);
        button.disabled = true;
    }
}

function enableButtons() {
    console.log(`enabling buttons`);
    for(let id in colorButtonIds) {
        const button = document.getElementById(colorButtonIds[id]);
        button.disabled = false;
    }
}

for(let idx in colorButtonIds) {
    const buttonId = colorButtonIds[idx];
    const button = document.getElementById(buttonId);
    button.addEventListener(
        'mousedown',
        function() {
            button.style.opacity = 1;
        }
    )
    button.addEventListener(
        'mouseup',
        async function() {
            console.log(`checking`);
            button.style.opacity = 0.3;
            if(buttonId == sequence[ptr]) {
                ++ptr;
                if(ptr == sequence.length) {
                    increaseScore();
                    await startNewRound();
                }
            }
            else {
                gameOver();
                statusLog.textContent = ":(";
            }
        }
    )
}

function gameOver() {
    console.log(`game over`);
    // highscore
    const prevHigh = localStorage.getItem('kid116-simon-hs');
    if(prevHigh == null || parseInt(curScore.textContent) > prevHigh) {
        localStorage.setItem('kid116-simon-hs', parseInt(curScore.textContent));
    }
    loadHigh();
    disableButtons();
    enableStart();
}

function loadHigh() {
    const high = localStorage.getItem('kid116-simon-hs');
    highScore.textContent = high;
}

disableButtons();
loadHigh();