const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

const player = { x: 300, y: 200, size: 20, speed: 3 };
const enemy = { x: 50, y: 50, size: 20, speed: 1.5 };

const lights = [{ x: 200, y: 150, radius: 60 }, { x: 400, y: 250, radius: 80 }];

let keys = {};
let gameRunning = true;
let time = 0;

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

function update() {
    if (!gameRunning) return;

    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    if (player.x < 0) player.x = canvas.width;
    if (player.x > canvas.width) player.x = 0;
    if (player.y < 0) player.y = canvas.height;
    if (player.y > canvas.height) player.y = 0;

    let inLight = lights.some(light => {
        let dx = player.x - light.x;
        let dy = player.y - light.y;
        return Math.sqrt(dx * dx + dy * dy) < light.radius;
    });

    if (!inLight) {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
    }

    if (enemy.x < 0) enemy.x = canvas.width;
    if (enemy.x > canvas.width) enemy.x = 0;
    if (enemy.y < 0) enemy.y = canvas.height;
    if (enemy.y > canvas.height) enemy.y = 0;

    if (Math.abs(player.x - enemy.x) < player.size && Math.abs(player.y - enemy.y) < player.size) {
        gameRunning = false;
        alert("Game Over!");
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "yellow";
    lights.forEach(light => {
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(gameLoop);
}

setInterval(() => {
    if (gameRunning) {
        time++;
        document.getElementById("time").textContent = time;
    }
}, 1000);

gameLoop();
