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

/**
 *
 * @author Marti
 */
public class Panel {

    public int X, Y;
    public Dimension SIZE;
    public String[] TEXT;
    public Color BG_COLOR, COLOR;
    public Font FONT;
    public float OPACITY;

    public Panel(int x, int y, Dimension size, Color bg, Color color, Font font, float opacity, String[] text) {
        this.X = (int) (x - size.width / 2f);
        this.Y = y;
        this.SIZE = size;
        this.TEXT = text;
        this.BG_COLOR = bg;
        this.COLOR = color;
        this.FONT = font;
        this.OPACITY = opacity;
    }

    public Panel(int x, int y, Dimension size, Color bg, float opacity) {
        this.X = (int) (x - size.width / 2f);
        this.Y = y;
        this.SIZE = size;
        this.BG_COLOR = bg;
        this.OPACITY = opacity;
    }

    public void render(Graphics2D g2, int XOffSet, int YOffSet) {
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, this.OPACITY));
        g2.setColor(this.BG_COLOR);
        g2.fillRoundRect(this.X + XOffSet, this.Y + YOffSet, this.SIZE.width, this.SIZE.height, 15, 15);
        g2.setColor(this.COLOR);
        g2.setFont(this.FONT);
        int i = 0;
        if (this.TEXT != null) {
            for (String line : this.TEXT) {
                g2.drawString(
                        line,
                        this.X + XOffSet + 10,
                        this.Y + YOffSet + g2.getFontMetrics().getHeight() * (i + 1)
                );
                i++;
            }
        }
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));
    }

}
