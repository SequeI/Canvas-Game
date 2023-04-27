// General Setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const image = new Image()
image.src = './images/bcg.png'

const playerImage = new Image()
playerImage.src = './images/chardown.png'

const fireImage = new Image()
fireImage.src = './images/fireball.png'

// Assigning 
const keys = {
    arrowUp: { pressed: false },
    arrowDown: { pressed: false },
    arrowLeft: { pressed: false },
    arrowRight: { pressed: false },
}
const scoreElement = document.querySelector('#scoreDiv')
let score = 0;
let hue = 0;
let middleW = canvas.width / 2;
let middleH = canvas.height / 2
let moving = false
let val = 0
let elapsed = 0
let newVal = 0

// iterating through char tilesets if player moving
function frameCycle() {
    if (moving == true) {
        newVal = (val * 100)
        elapsed++
        if (elapsed % 20 == 0) {
            if (val < 3) {
                val++;
            }
            else {
                val = 0;
            }
        }
    }

}
// Creating projectiles
class Projectile {
    constructor(x, y, radius, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.color = 'hsl(' + hue + ', 100%, 50%)'
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}
// Creating enemies
class Enemy {
    constructor(x, y, radius, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocity = velocity
        this.color = 'hsl(' + hue + ', 100%, 50%)'
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

const projectiles = []
const enemies = []

// spawning enemy every 1 second in a random area of the canvas
function spawnEnemy() {
    setInterval(() => {
        const radius = Math.random() * (40 - 5) + 5
        const x = canvas.width + radius
        const y = Math.random() * canvas.height
        const angle = Math.atan2(middleH - y, middleW - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, velocity));
    }, 1000)

}
// creating and rendering projectile on click
addEventListener('click', (e) => {
    // The math here is a little bit janky for some reason but it mostly works, trigonometry is hard.
    const angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(new Projectile(middleW - 20, middleH, 5, velocity))
})
//animate loop
function animate() {
    requestAnimationFrame(animate)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(playerImage,
        newVal,
        0,
        (playerImage.width / 4) - 50,
        playerImage.height,
        middleW - (playerImage.width / 4) / 2,
        middleH - playerImage.height / 2,
        (playerImage.width / 4) - 50, playerImage.height)

        // movement
    if (keys.arrowUp.pressed && lastKey === 'ArrowUp') {
        middleH -= 2;
        moving = true;
        playerImage.src = './images/charup.png'
    }
    else if (keys.arrowDown.pressed && lastKey === 'ArrowDown') {
        middleH += 2;
        moving = true;
        playerImage.src = './images/chardown.png'
    }
    else if (keys.arrowLeft.pressed && lastKey === 'ArrowLeft') {
        middleW -= 2;
        moving = true;
        playerImage.src = './images/charleft.png'
    }
    else if (keys.arrowRight.pressed && lastKey === 'ArrowRight') {
        middleW += 2;
        moving = true;
        playerImage.src = './images/charright.png'
    }
    frameCycle()
    hue++;
    projectiles.forEach((projectile) => {
        projectile.update()
    })
    // character collision, end game on hit
    enemies.forEach((enemy, index) => {
        enemy.update()
        const dist = Math.hypot(middleW - enemy.x, middleH - enemy.y)
        if (dist - enemy.radius - 3 < 1) {
            window.location = './index.html'
        }
        // projectile and enemy collision, up score on hit and take those specific projectiles and enemies out of the array that is rendered from
        projectiles.forEach((projectile, index2) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius < 1) {
                score++;
                scoreElement.innerHTML = score;
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(index2, 1)
                }, 0)
                
            }
        })
    })
    }

// character movement
let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.arrowUp.pressed = true
            lastKey = 'ArrowUp'
            moving = true
            break
        case 'ArrowDown':
            keys.arrowDown.pressed = true
            lastKey = 'ArrowDown'
            moving = true
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true
            lastKey = 'ArrowLeft'
            moving = true
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = true
            lastKey = 'ArrowRight'
            moving = true
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.arrowUp.pressed = false
            moving = false
            break
        case 'ArrowDown':
            keys.arrowDown.pressed = false
            moving = false
            break
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false
            moving = false
            break
        case 'ArrowRight':
            keys.arrowRight.pressed = false
            moving = false
            break
    }
})

spawnEnemy()
animate()
