/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object;

import SpaceCraft.FloatPoint;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Graphics2D;

/**
 *
 * @author Krcma
 */
public class Particle {

    private final FloatPoint position;
    private final Color color;
    private final float MX, MY;
    private int time;
    private final int total_time, size;

    public Particle(FloatPoint position, Color color, int time, int size, float mx, float my) {
        this.MX = mx;
        this.MY = my;
        this.color = color;
        this.position = position;
        this.time = time;
        this.total_time = time;
        this.size = size;
    }
    
    public FloatPoint getPosition(){
        return this.position;
    }
    
    public int getSize(){
        return this.size;
    }

    public void render(Graphics2D g2, int x_off, int y_off) {
        float f = (float) time / (float) total_time;
        f = f < 0f ? 0f : f;
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, f));
        g2.setColor(this.color);
        g2.fillRect((int) this.position.x + x_off, (int) this.position.y + y_off, this.size, this.size);
    }

    public boolean refresh() {
        this.position.x += this.MX;
        this.position.y += this.MY;
        this.time--;
        return time < 0;
    }

}
