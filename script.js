// 變數初始化
let snake, direction, foodList, interval, score;
let isRunning = false;
let canMove = false;
let currentUser = '';
let users = JSON.parse(localStorage.getItem('users')) || []; // 儲存使用者

const board = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const ladderList = document.getElementById('ladderList');

// 當按下開始遊戲按鈕
document.getElementById('startButton').addEventListener('click', startGame);

// 當按下重新開始遊戲按鈕
document.getElementById('restartButton').addEventListener('click', restartGame);

// 當按下新增使用者按鈕
document.getElementById('newUserButton').addEventListener('click', addNewUser);

function startGame() {
    const usernameInput = document.getElementById('username');
    currentUser = usernameInput.value.trim();

    if (currentUser === '') {
        alert('請輸入使用者名稱');
        return;
    }

    // 隱藏使用者名稱輸入頁面，顯示遊戲區
    document.getElementById('usernameContainer').style.display = 'none';
    document.getElementById('scoreSection').style.display = 'block';

    // 初始化遊戲
    snake = [{ x: 0, y: 0 }];
    direction = { x: 1, y: 0 };
    foodList = [];
    score = 0;

    spawnFood();
    draw();
    isRunning = true;
    canMove = true;
    interval = setInterval(update, 100);
}

// 生成食物
function spawnFood() {
    while (foodList.length < 10) {
        foodList.push({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
            value: 1
        });
    }
}

// 更新遊戲
function update() {
    if (!canMove) return;

    const head = moveSnake(snake, direction);
    let ate = false;

    // 檢查蛇是否吃到食物
    foodList = foodList.filter(food => {
        if (food.x === head.x && food.y === head.y) {
            score += food.value;
            ate = true;
            return false;
        }
        return true;
    });

    if (!ate) snake.pop(); // 如果沒吃到食物，移除蛇尾
    if (foodList.length < 10) spawnFood(); // 當食物少於10個時生成更多

    draw();
    checkGameOver();
}

// 移動蛇
function moveSnake(snakeArr, dir) {
    const head = { x: snakeArr[0].x + dir.x, y: snakeArr[0].y + dir.y };
    snakeArr.unshift(head);
    return head;
}

// 檢查遊戲是否結束
function checkGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        endGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            endGame();
            return;
        }
    }
}

// 結束遊戲
function endGame() {
    clearInterval(interval);
    alert('遊戲結束！');
    saveScore();
    showLadder();
}

// 儲存分數
function saveScore() {
    users.push({ name: currentUser, score });
    users.sort((a, b) => b.score - a.score); // 排序
    localStorage.setItem('users', JSON.stringify(users));
}

// 顯示天梯
function showLadder() {
    document.getElementById('scoreSection').style.display = 'none';
    document.getElementById('ladderSection').style.display = 'block';

    ladderList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name}: ${user.score}`;
        ladderList.appendChild(li);
    });
}

// 畫出遊戲畫面
function draw() {
    board.innerHTML = ''; // 清除畫面

    // 畫出食物
    foodList.forEach(food => createCell(food.x, food.y, 'food'));

    // 畫出蛇
    snake.forEach(part => createCell(part.x, part.y, 'snake'));

    scoreDisplay.textContent = `分數：${score}`;
}

// 創建單一區塊
function createCell(x, y, className) {
    const el = document.createElement('div');
    el.classList.add('cell', className);
    el.style.left = `${x * 20}px`;
    el.style.top = `${y * 20}px`;
    board.appendChild(el);
}

// 重啟遊戲
function restartGame() {
    document.getElementById('ladderSection').style.display = 'none';
    document.getElementById('usernameContainer').style.display = 'block';
}

// 新增使用者
function addNewUser() {
    document.getElementById('ladderSection').style.display = 'none';
    document.getElementById('usernameContainer').style.display = 'block';
}
