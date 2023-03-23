const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let foodX, foodY,snakeX=5, snakeY=10, velocityX=0, velocityY=0, snakeBody=[], gameOver=false, setIntervalId, score=0;
let highScore = localStorage.getItem("high-score") || 0; // getting high score from the local storage
highScoreElement.innerText=`High Score: ${highScore}`;

const changeFoodPosition = () => {
    //Creating a random value as food position between 0-30
    foodX = Math.floor(Math.random()*30)+1;
    foodY= Math.floor(Math.random()*30)+1;
}

const handleGameOver = () => {
    //Clearing the timer and reloading the page
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay");
    location.reload();
}

const changeDirection = (e) => {
    //Changing velocity value based on key press
    if(e.key=== "ArrowUp" && velocityY !=1){
        velocityX=0;
        velocityY=-1;
    }else if(e.key==="ArrowDown" && velocityY !=-1){
            velocityX=0;
            velocityY=1;
        } else if(e.key==="ArrowLeft" && velocityX !=1){
            velocityX=-1;
            velocityY=0;
        }else if(e.key==="ArrowRight" && velocityX !=-1){
            velocityX=1;
            velocityY=0;
        }
}

//calling changeDirection on each key click and passing key value as an object
controls.forEach(key =>{
    key.addEventListener("click", ()=> changeDirection({key: key.dataset.key}));
})
const initGame = () =>{
    if(gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

    //checking if the snake eat the food
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX,foodY]); //Pushing food to snake body
        score++; //increment score by 1
        highScore=score>=highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText=`Score: ${score}`;
        highScoreElement.innerText=`High Score: ${highScore}`;
    }

    for(let i=snakeBody.length-1;i>0;i--){
        snakeBody[i] = snakeBody[i-1]; //Shifting forward the values of the elements in the snake body
    }
    snakeBody[0]=[snakeX,snakeY]; //Setting first element of snake body to current position

    //Updating snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //Checking if the snake's head is out of the wall
    if(snakeX <=0 || snakeX>30 || snakeY<=0 || snakeY>30){
        gameOver=true;
    }

    for(let i=0;i<snakeBody.length; i++){
        htmlMarkup += `<div class="snakebody" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
        //if the snake's head hit the body, then gameOver
        if(i!==0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver=true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}


changeFoodPosition();
setIntervalId=setInterval(initGame,125);

document.addEventListener("keydown",changeDirection);