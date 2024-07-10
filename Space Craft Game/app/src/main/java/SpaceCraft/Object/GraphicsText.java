/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;

/**
 *
 * @author Krcma
 */
public class GraphicsText {

    private final String TEXT;
    private final int SIZE, FT;
    private float X, Y;
    private int TIME;
    private float OP, MX, MY;
    private final float PR;
    private final Color COLOR;
    public boolean RealPosition = false; 
    
    public GraphicsText(String text, int x, int y, int size, int time, Color c) {
        this.TEXT = text;
        this.X = x;
        this.Y = y;
        this.SIZE = size;
        this.TIME = time;
        this.FT = time;
        this.COLOR = c;
        this.OP = 0.0f;
        this.PR = 0.75f / ((float) time / 8f);
    }

    public void addMove(float MX, float MY) {
        this.MX = MX;
        this.MY = MY;
    }

    /**
     * Decrement time and if time <= 0 then return false (to remove text from
     * list) @return
     */
    public boolean refresh() {
        //fade in/out
        if (this.TIME > this.FT - this.FT / 8) {
            this.OP += this.PR;
        } else {
            if (this.TIME < this.FT / 8) {
                this.OP -= this.PR;
            }
        }
        //move 
        this.X += this.MX;
        this.Y += this.MY;
        //time
        this.TIME--;
        return this.TIME <= 0;
    }

    public void render(Graphics2D g2, int x_off, int y_off) {
        if(!this.RealPosition){
            x_off = 0;
            y_off = 0;
        }
        g2.setColor(this.COLOR);
        g2.setFont(new Font("Monospaced", Font.BOLD, this.SIZE));
        this.OP = this.OP > 0.75f ? 0.75f : this.OP;
        this.OP = this.OP < 0.0f ? 0.0f : this.OP;
        g2.setComposite(AlphaComposite.SrcOver.derive(this.OP));
        g2.drawString(
                this.TEXT,
                this.X + x_off - g2.getFontMetrics().stringWidth(this.TEXT) / 2,
                this.Y + y_off - g2.getFontMetrics().getHeight() / 2
        );
    }

}
