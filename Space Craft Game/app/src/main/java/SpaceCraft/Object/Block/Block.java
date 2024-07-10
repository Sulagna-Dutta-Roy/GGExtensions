/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object.Block;

import SpaceCraft.Object.Spaceship.Spaceship;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.Point;

/**
 *
 * @author Krcma
 */
public interface Block extends Cloneable {

    public Block clone() throws CloneNotSupportedException;

    public static final int SIZE = 21;

    public Spaceship getOwner();

    public void setOwner(Spaceship owner);

    public void setMass(float mass);

    public float getMass();

    public void setLife(int life);

    public int getLife();

    public Color getColor();

    public void setColor(Color color);

    public BlockType getType();

    public Point getOffset();

    public void setOffset(Point OFFSET);

    public void render(Graphics2D g2, boolean fromDown, boolean upper, int x_off, int y_off);

    public boolean colision(Point position);

}
