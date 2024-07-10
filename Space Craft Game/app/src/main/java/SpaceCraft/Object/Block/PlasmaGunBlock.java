/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object.Block;

import SpaceCraft.Object.Spaceship.Spaceship;
import SpaceCraft.Tools;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Point;
import java.io.Serializable;

/**
 *
 * @author Krcma
 */
public class PlasmaGunBlock implements Block, Serializable {

    private Color COLOR;
    private int LIFE;
    private float MASS;
    private Point OFFSET;
    private Spaceship object;
    private final BlockType TYPE = BlockType.PLASMA_GUN;

    public PlasmaGunBlock(Point offset_position, Color color) {
        this.OFFSET = offset_position;
        this.COLOR = color;
        this.LIFE = this.TYPE.getLife();
        this.MASS = this.TYPE.getMass();
    }

    @Override
    public Spaceship getOwner() {
        return this.object;
    }

    @Override
    public void setOwner(Spaceship owner) {
        this.object = owner;
    }

    @Override
    public void setMass(float mass) {
        this.MASS = mass;
    }

    @Override
    public float getMass() {
        return this.MASS;
    }

    @Override
    public void setLife(int life) {
        this.LIFE = life;
    }

    @Override
    public int getLife() {
        return this.LIFE;
    }

    @Override
    public Color getColor() {
        return this.COLOR;
    }

    @Override
    public void setColor(Color color) {
        this.COLOR = color;
    }

    @Override
    public BlockType getType() {
        return this.TYPE;
    }

    @Override
    public Point getOffset() {
        return this.OFFSET;
    }

    @Override
    public void setOffset(Point offset) {
        this.OFFSET = offset;
    }

    @Override
    public void render(Graphics2D g2, boolean fromDown, boolean upper, int x_off, int y_off) {
        int x, y;
        if (this.object != null) {
            x = (int) (this.OFFSET.x + object.getPosition().x + x_off);
            y = (int) (this.OFFSET.y + object.getPosition().y + y_off);
        } else {
            x = (int) (this.OFFSET.x + x_off);
            y = (int) (this.OFFSET.y + y_off);
        }
        if (!upper) {
            g2.setColor(this.COLOR);
            g2.fillRect(x, y, Block.SIZE, Block.SIZE);
            g2.setStroke(new BasicStroke(2));
            g2.setColor(this.COLOR.darker());
            g2.drawRect(x, y, Block.SIZE, Block.SIZE);
            BlockBreak.draw(g2, x, y, this.COLOR.darker(), this.LIFE, this.TYPE.getLife());
        } else {
            //**********************
            g2.setColor(Tools.darkerColor(this.COLOR));
            g2.setColor(g2.getColor().darker());
            g2.setStroke(new BasicStroke(7));
            if (fromDown) {
                g2.drawLine(
                        (int) (x + Block.SIZE * 0.5f),
                        (int) (y + Block.SIZE * 0.5f),
                        (int) (x + Block.SIZE * 0.5f),
                        (int) (y - Block.SIZE * 0.2f)
                );
            } else {
                g2.drawLine(
                        (int) (x + Block.SIZE * 0.5f),
                        (int) (y + Block.SIZE * 0.5f),
                        (int) (x + Block.SIZE * 0.5f),
                        (int) (y + Block.SIZE * 1.2f)
                );
            }
            g2.setStroke(new BasicStroke(2));
            g2.setColor(Tools.darkerColor(this.COLOR));
            g2.fillOval(
                    (int) (x + Block.SIZE * 0.15f),
                    (int) (y + Block.SIZE * 0.15f),
                    (int) (Block.SIZE * 0.7f),
                    (int) (Block.SIZE * 0.7f)
            );
        }
    }

    @Override
    public boolean colision(Point p) {
        int x = (int) (this.OFFSET.x + this.object.getPosition().x);
        int y = (int) (this.OFFSET.y + this.object.getPosition().y);
        return p.x >= x && p.x <= x + Block.SIZE && p.y >= y && p.y <= y + Block.SIZE;
    }

    @Override
    public Block clone() throws CloneNotSupportedException {
        return (Block) super.clone();
    }

}
