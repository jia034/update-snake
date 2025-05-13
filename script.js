const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let apple;
let dx;
let dy;
let score;
let gameInterval;
let gameStarted = false;
let startTime;
let playerName;

function initGame() {
  snake = [{
    x: 10,
    y: 10
  }];
  apple = {
    x: 5,
    y: 5
  };
  dx = 1;
  dy = 0;
  score = 0;
  startTime = Date.now(); // 記錄遊戲開始時間
  playerName = document.getElementById("playerName").value || "Player"; // 獲取玩家名稱
}

function gameLoop() {
  if (!gameStarted) return;

  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= tileCount || head.y >= tileCount ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    apple = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);
}

document.addEventListener("keydown", e => {
  if (!gameStarted) return;
  switch (e.key) {
    case "ArrowUp":
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;
    case "ArrowDown":
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;
    case "ArrowLeft":
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;
    case "ArrowRight":
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
});

function startGame() {
  initGame();
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none"; // 確保開始新遊戲時隱藏 gameOverScreen
  gameStarted = true;
  gameInterval = setInterval(gameLoop, 100);
}

function gameOver() {
  clearInterval(gameInterval);
  gameStarted = false;

  const endTime = Date.now();
  const playTime = Math.floor((endTime - startTime) / 1000); // 計算遊玩秒數

  document.getElementById("finalScore").textContent = score;
  document.getElementById("playTime").textContent = playTime;
  document.getElementById("gameOverScreen").style.display = "flex";

  // 將資料儲存到 Firebase
  saveScoreToFirebase(playerName, score, playTime);
}

function saveScoreToFirebase(playerName, score, playTime) {
  const leaderboardRef = firebase.database().ref('leaderboard');
  const now = new Date();
  const timestamp = now.toISOString();

  const newScore = {
    name: playerName,
    score: score,
    time: playTime,
    savedAt: timestamp
  };

  leaderboardRef.push(newScore);
}

function showLeaderboard() {
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("leaderboardScreen").style.display = "flex";
  populateLeaderboard();
}

function hideLeaderboard() {
  document.getElementById("leaderboardScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "flex"; // 回到開始畫面
}

function populateLeaderboard() {
  const leaderboardRef = firebase.database().ref('leaderboard');
  const leaderboardList = document.getElementById("leaderboard");
  leaderboardList.innerHTML = ""; // 清空現有列表

  leaderboardRef.orderByChild('score').limitToLast(10).once('value', (snapshot) => {
    const scores = snapshot.val();
    if (scores) {
      const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b.score - a.score); // 依分數排序

      sortedScores.forEach(([key, data]) => {
        const li = document.createElement('li');
        li.textContent = `${data.name} - 分數：${data.score}，時間：${data.time} 秒`;
        leaderboardList.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = "目前沒有排行榜資料。";
      leaderboardList.appendChild(li);
    }
  });
}

function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  startGame(); // 重新開始遊戲
}