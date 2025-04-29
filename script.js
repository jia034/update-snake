document.addEventListener('DOMContentLoaded', () => {
  const usernamePage = document.getElementById('usernamePage');
  const gamePage = document.getElementById('gamePage');
  const leaderboardPage = document.getElementById('leaderboardPage');
  const usernameInput = document.getElementById('usernameInput');
  const startButton = document.getElementById('startButton');

  startButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (!username) return alert('請輸入使用者名稱');
    usernamePage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    // 初始化遊戲邏輯會放在這裡
  });
});