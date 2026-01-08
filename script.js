const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const highScoreDisplay = document.getElementById('high-score-value');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const easyBtn = document.getElementById('easy-btn');
const normalBtn = document.getElementById('normal-btn');
const hardBtn = document.getElementById('hard-btn');

let cards = [], flippedCards = [], matchedPairs = 0, score = 0, timer = 0, timerInterval;
let gameStarted = false, currentDifficulty = 'normal';
let highScore = localStorage.getItem(`memoryHighScore_${currentDifficulty}`) || 0;

const difficulties = {
    easy: { grid: 2, pairs: 2, symbols: ['🐶','🐱'] },
    normal: { grid: 4, pairs: 8, symbols: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'] },
    hard: { grid: 6, pairs: 18, symbols: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🐔','🐧','🐦','🐷','🐮'] }
};


function setDifficulty(diff){
    currentDifficulty = diff;
    highScore = localStorage.getItem(`memoryHighScore_${currentDifficulty}`) || 0;
    highScoreDisplay.textContent = highScore;
    [easyBtn,normalBtn,hardBtn].forEach(btn=>btn.classList.remove('selected'));
    document.getElementById(`${diff}-btn`).classList.add('selected');
    document.body.classList.remove('easy','normal','hard');
    document.body.classList.add(diff);
}

[easyBtn,normalBtn,hardBtn].forEach(btn=>btn.addEventListener('click',()=>setDifficulty(btn.id.split('-')[0])));

startBtn.addEventListener('click',initGame);
resetBtn.addEventListener('click',initGame);

function initGame(){
    const diff = difficulties[currentDifficulty];
    cards=[]; flippedCards=[]; matchedPairs=0; score=0; timer=0; gameStarted=true;
    scoreDisplay.textContent=score;
    timerDisplay.textContent=`Time: ${timer}s`;
    highScoreDisplay.textContent=highScore;
    clearInterval(timerInterval);

    const cardSymbols=[...diff.symbols,...diff.symbols];
    shuffleArray(cardSymbols);

    gameBoard.innerHTML='';
    cardSymbols.forEach(symbol=>{
        const card=document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol=symbol;
        card.innerHTML=`<div class="card-front">${symbol}</div><div class="card-back">?</div>`;
        card.addEventListener('click',flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });

    timerInterval=setInterval(()=>{
        timer++;
        timerDisplay.textContent=`Time: ${timer}s`;
    },1000);

    startBtn.disabled=true;
    resetBtn.disabled=false;
}

function shuffleArray(array){
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}

function flipCard(){
    if(!gameStarted || flippedCards.length>=2 || this.classList.contains('flipped')) return;
    this.classList.add('flipped');
    flippedCards.push(this);

    if(flippedCards.length===2) setTimeout(checkMatch,1000);
}

function checkMatch(){
    const [card1,card2]=flippedCards;
    if(card1.dataset.symbol===card2.dataset.symbol){
        matchedPairs++; score+=10; scoreDisplay.textContent=score;
        card1.classList.add('matched'); card2.classList.add('matched');
        if(matchedPairs===difficulties[currentDifficulty].pairs) endGame();
    }else{
        card1.classList.remove('flipped'); card2.classList.remove('flipped');
        score=Math.max(0,score-2); scoreDisplay.textContent=score;
    }
    flippedCards=[];
}

function endGame(){
    gameStarted=false;
    clearInterval(timerInterval);
    if(score>highScore){
        localStorage.setItem(`memoryHighScore_${currentDifficulty}`,score);
        highScoreDisplay.textContent=score;
        alert(`🎉 You won! New High Score: ${score}`);
    }else{
        alert(`🎉 You won! Score: ${score}`);
    }
}
