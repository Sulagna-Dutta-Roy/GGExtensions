/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Menu;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Point;

/**
 *
 * @author Marti
 */
public class Button {

    public int X, Y;
    public Dimension SIZE;
    public String TEXT;
    public Color BG_COLOR, COLOR;
    public Font FONT;
    public float OPACITY;
    private boolean mouseIn = false;
    public int ID = 0;
    
    public Button(int x, int y, Dimension size, String text, Color bg, Color color, Font font, float opacity) {
        this.X = x - size.width / 2;
        this.Y = y - size.height / 2;
        this.SIZE = size;
        this.TEXT = text;
        this.BG_COLOR = bg;
        this.COLOR = color;
        this.FONT = font;
        this.OPACITY = opacity;
    }

    /**
     *
     * @param XOffSet
     * @param YOffSet
     * @param p mouse cursor position
     * @return
     */
    public boolean mouseOn(int XOffSet, int YOffSet, Point p) {
        return XOffSet + this.X < p.x && XOffSet + this.X + this.SIZE.width > p.x
                && YOffSet + this.Y < p.y && YOffSet + this.Y + this.SIZE.height > p.y;
    }

    public void mouseIn() {
        this.mouseIn = true;
    }

    public void mouseOut() {
        this.mouseIn = false;
    }

    public void click() {

    }

    public void render(Graphics2D g2, int XOffSet, int YOffSet) {
        if (this.mouseIn) {
            float f = this.OPACITY + 0.3f;
            f = f > 1.0f ? 1.0f : f;
            g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, f));
        } else {
            g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, this.OPACITY));
        }
        g2.setColor(this.BG_COLOR);
        g2.fillRoundRect(this.X + XOffSet, this.Y + YOffSet, this.SIZE.width, this.SIZE.height, 15, 15);
        g2.setColor(this.COLOR);
        g2.setFont(this.FONT);
        g2.drawString(
                this.TEXT,
                this.X + XOffSet + this.SIZE.width / 2f - g2.getFontMetrics().stringWidth(this.TEXT) / 2f,
                this.Y + YOffSet + this.SIZE.height / 2f + g2.getFontMetrics().getHeight() / 4f
        );
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));
    }

}
