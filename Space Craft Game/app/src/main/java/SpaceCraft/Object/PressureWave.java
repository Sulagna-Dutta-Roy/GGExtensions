/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics2D;


/**
 *
 * @author Krcma
 */
public class PressureWave {

    private final int X, Y, TOTALTIME;
    private final float SPEED;
    private int TIME, W = 0;

    public PressureWave(int x, int y, int time, float speed) {
        this.X = x;
        this.Y = y;
        this.TOTALTIME = time;
        this.TIME = time;
        this.SPEED = speed;
    }

    public boolean refresh() {
        this.TIME--;
        this.W += this.SPEED;
        return this.TIME < 0;
    }

    public void render(Graphics2D g2, int x_off, int y_off) {
        float ff = (float) this.TIME / (float) this.TOTALTIME;
        g2.setStroke(new BasicStroke(5 + (1 - ff) * 20f));
        g2.setColor(Color.gray);
        g2.setComposite(AlphaComposite.SrcOver.derive(ff * 0.35f));
        g2.drawOval(this.X - W / 2 + x_off, this.Y - W / 2 + y_off, this.W, this.W);   
    }

}
