class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.cooldown = 0;
    }

    update() {
        if (this.cooldown > 0) {
            this.cooldown--;
        } else {
            // Find enemy in range and shoot
            const enemy = this.findEnemyInRange();
            if (enemy) {
                bullets.push(new Bullet(this.x, this.y, enemy));
                this.cooldown = 30; // 30 frames cooldown
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
    }

    findEnemyInRange() {
        return enemies.find(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            return Math.sqrt(dx * dx + dy * dy) < this.range;
        });
    }
}

class Bullet {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 5;
    }

    update() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;

        if (dist < 5) {
            // Hit the target
            const index = enemies.indexOf(this.target);
            if (index > -1) {
                enemies.splice(index, 1);
            }
            const bulletIndex = bullets.indexOf(this);
            if (bulletIndex > -1) {
                bullets.splice(bulletIndex, 1);
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Dummy enemy class for demonstration
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        this.x += 1; // Move right
    }

    draw(ctx) {
        ctx.fillStyle = '#00f';
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
    }
}

// Add a few enemies for demonstration
enemies.push(new Enemy(50, 300));
enemies.push(new Enemy(150, 400));
