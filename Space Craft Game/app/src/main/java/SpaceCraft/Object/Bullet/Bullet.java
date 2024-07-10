/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object.Bullet;

import SpaceCraft.FloatPoint;
import SpaceCraft.Game;
import SpaceCraft.Object.Particle;
import SpaceCraft.Object.Spaceship.Spaceship;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;

/**
 *
 * @author Krcma
 */
public class Bullet {

    private final FloatPoint position;
    private final BulletType bulletType;
    private final Color color;
    private final float xMove;
    private final boolean FromDown;
    private final Spaceship owner;

    /**
     * Bullet
     *
     * @param position Start position of bullet
     * @param bulletType Bullet type
     * @param color Color of bullet
     * @param xMove Move of bullet in x axis
     * @param FromDown If (true) then bullet move from down to up
     */
    public Bullet(FloatPoint position, BulletType bulletType, Color color, float xMove, boolean FromDown, Spaceship owner) {
        this.position = position;
        this.bulletType = bulletType;
        this.color = color;
        this.xMove = xMove;
        this.FromDown = FromDown;
        this.owner = owner;
    }

    public boolean isFromDown() {
        return this.FromDown;
    }

    public BulletType getType() {
        return this.bulletType;
    }

    public int getSize(){
        return this.bulletType.getSize();
    }
    
    public int getDamage() {
        return this.bulletType.getDamage();
    }

    public Spaceship getOwner() {
        return this.owner;
    }

    int i = 0, next = 4;

    public void refresh() {
        if (this.i > this.next) {
            this.i = 0;
            this.next = (int) (Math.random() * 4 + 3);
            Game.engine.particles.add(
                    new Particle(new FloatPoint(this.position.x, this.position.y), this.color, Game.RPS / 2, 3, 0, 0)
            );
        } else {
            this.i++;
        }
        this.position.x += this.xMove;
        this.position.y += this.FromDown ? -this.bulletType.getSpeed() : this.bulletType.getSpeed();
    }

    public FloatPoint getPosition() {
        return this.position;
    }

    public boolean isOut(Dimension window) {
        if (this.position.x > window.width) {
            return true;
        }
        if (this.position.y > window.height) {
            return true;
        }
        if (this.position.x < 0 || this.position.y < 0) {
            return true;
        }
        return false;
    }

    public void render(Graphics2D g2, int x_off, int y_off) {
        g2.setColor(this.color);
        if (this.bulletType == BulletType.SNIPER) {
            g2.fillRoundRect(
                    (int) this.position.x + x_off - this.bulletType.getSize() / 2,
                    (int) this.position.y + y_off - (this.FromDown ? 0 : this.bulletType.getSize() * 4),
                    this.bulletType.getSize(),
                    this.bulletType.getSize() * 4,
                    4,
                    4
            );
        } else {
            g2.fillOval(
                    (int) this.position.x + x_off - this.bulletType.getSize() / 2,
                    (int) this.position.y + y_off,
                    this.bulletType.getSize(),
                    this.bulletType.getSize()
            );
        }
    }

}
