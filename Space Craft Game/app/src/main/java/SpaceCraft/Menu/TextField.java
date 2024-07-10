/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Menu;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Point;

/**
 *
 * @author Marti
 */
public class TextField {

    public int X, Y;
    public String TEXT;
    public Color COLOR, BG_COLOR;
    public Font FONT;
    public float OPACITY;
    public boolean selested = false;
    public Dimension SIZE;
    public int maxTextLength;
    public int ID = 0;

    public TextField(int x, int y, Dimension size, Color color, Color bgColor, Font font, float opacity) {
        this.X = (int) (x - size.width / 2f);
        this.Y = y;
        this.SIZE = size;
        this.TEXT = "";
        this.COLOR = color;
        this.BG_COLOR = bgColor;
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
        return this.X - 10 + XOffSet < p.x
                && this.X - 10 + XOffSet + this.SIZE.width > p.x
                && this.Y + 5 + YOffSet - this.SIZE.height < p.y
                && this.Y + 5 + YOffSet + this.SIZE.height > p.y;
    }

    int c = 0;

    public void render(Graphics2D g2, int XOffSet, int YOffSet) {
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, this.OPACITY));
        g2.setFont(this.FONT);
        g2.setColor(this.BG_COLOR);
        g2.fillRect(
                (int) (this.X - 10 + XOffSet),
                this.Y + 5 + YOffSet,
                this.SIZE.width,
                this.SIZE.height
        );
        g2.setStroke(new BasicStroke(2));
        g2.setColor(this.BG_COLOR.darker());
        g2.drawRect(
                (int) (this.X - 10 + XOffSet),
                this.Y + 5 + YOffSet,
                this.SIZE.width,
                this.SIZE.height
        );
        g2.setColor(this.COLOR);
        g2.drawString(
                this.TEXT,
                this.X + XOffSet,
                this.Y + YOffSet + this.SIZE.height / 2f + g2.getFontMetrics().getHeight() / 2f
        );
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));
        //cursor
        if (this.selested) {
            c++;
            if (c < 15) {
                g2.setColor(Color.WHITE);
                g2.drawLine(
                        this.X + XOffSet + g2.getFontMetrics().stringWidth(this.TEXT),
                        this.Y + 5 + YOffSet + 4,
                        this.X + XOffSet + g2.getFontMetrics().stringWidth(this.TEXT),
                        this.Y + 5 + YOffSet + this.SIZE.height - 6
                );
            } else if (c > 25) {
                c = 0;
            }
        }
    }

}
