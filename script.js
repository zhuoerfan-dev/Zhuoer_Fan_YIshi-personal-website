const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("game-score");
const restartBtn = document.getElementById("restart-btn");

let box = 20;
let snake, food, score, d, game;

// --- 1. 修改后的初始化函数 (解决了 Restart 报错) ---
function initGame() {
  if (game) clearInterval(game); // 确保重启时不会有多个定时器在跑

  snake = [{ x: 9 * box, y: 10 * box }];
  score = 0;
  d = null; // 初始静止，按下键后才开始
  scoreElement.innerHTML = score;

  createFood(); // 调用新的食物生成函数
  game = setInterval(draw, 100);
}

// --- 2. 修改后的食物生成 (解决了吃不到最边缘苹果的问题) ---
function createFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// 监听 WASD
document.addEventListener("keydown", (event) => {
  const key = event.keyCode;
  if ([87, 65, 83, 68].includes(key)) event.preventDefault();

  if (key == 65 && d != "RIGHT") d = "LEFT";
  // A
  else if (key == 87 && d != "DOWN") d = "UP";
  // W
  else if (key == 68 && d != "LEFT") d = "RIGHT";
  // D
  else if (key == 83 && d != "UP") d = "DOWN"; // S
});

function draw() {
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 画蛇
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "#00d2ff" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#2d3436";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // 画食物
  ctx.fillStyle = "#ff7675";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // 根据方向计算新位置
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  let newHead = { x: snakeX, y: snakeY };

  // 核心逻辑：只有开始移动以后才处理
  if (d) {
    // 检查是否吃到食物
    if (snakeX == food.x && snakeY == food.y) {
      score++;
      scoreElement.innerHTML = score;
      createFood();
    } else {
      snake.pop(); // 没吃到就缩短尾部
    }

    // 检查死亡
    if (
      snakeX < 0 ||
      snakeX >= canvas.width ||
      snakeY < 0 ||
      snakeY >= canvas.height ||
      collision(newHead, snake)
    ) {
      clearInterval(game);
      setTimeout(() => {
        alert("Game Over! Score: " + score);
      }, 10);
      return;
    }

    snake.unshift(newHead);
  }
}
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) return true;
  }
  return false;
}

// 绑定重启按钮
restartBtn.addEventListener("click", initGame);

// 首次启动
initGame();

// --- 额外的打字机效果 (对应 HTML 中的 typewriter ID) ---
const typewriterElement = document.getElementById('typewriter');
const text = "Student | Artist | Developer | Pianist";
let index = 0;

function type() {
  if (index < text.length) {
    typewriterElement.innerHTML += text.charAt(index);
    index++;
    setTimeout(type, 100);
  }
}
type();
