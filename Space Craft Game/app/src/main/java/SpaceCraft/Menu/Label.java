/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Menu;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;

/**
 *
 * @author Marti
 */
public class Label {

    public int X, Y;
    public String TEXT;
    public Color COLOR;
    public Font FONT;
    private BufferedImage image;
    private int imgX, imgY;
    public float OPACITY;
    public boolean blink;
    public int ID = 0;
    public boolean center = true;

    private boolean b1 = false;
    private float f1 = 0.0f;

    public Label(int x, int y, String text, Color color, Font font, float opacity) {
        this.X = x;
        this.Y = y;
        this.TEXT = text;
        this.COLOR = color;
        this.FONT = font;
        this.OPACITY = opacity;
        this.blink = false;
    }

    public void setImage(BufferedImage img, int x, int y) {
        this.image = img;
        this.imgX = x;
        this.imgY = y;
    }

    public void render(Graphics2D g2, int XOffSet, int YOffSet) {

        float op = blink();

        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, op));
        g2.setColor(this.COLOR);
        g2.setFont(this.FONT);
        if (this.center) {
            g2.drawString(this.TEXT, this.X + XOffSet - g2.getFontMetrics().stringWidth(this.TEXT) / 2f, this.Y + YOffSet);
            if (this.image != null) {
                g2.drawImage(
                        this.image,
                        (int) (this.X + this.imgX + XOffSet - this.image.getWidth() / 2f),
                        this.Y + this.imgY + YOffSet,
                        null
                );
            }
        } else {
            g2.drawString(this.TEXT, this.X + XOffSet, this.Y + YOffSet);
            if (this.image != null) {
                g2.drawImage(
                        this.image,
                        (int) (this.X + this.imgX + XOffSet),
                        this.Y + this.imgY + YOffSet,
                        null
                );
            }
        }

        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));
    }

    private float blink() {
        if (this.blink) {
            if (this.b1) {
                this.f1 += 0.02;
                if (this.f1 > 0.2) {
                    this.b1 = false;
                }
            } else {
                this.f1 -= 0.02;
                if (this.f1 < -0.3) {
                    this.b1 = true;
                }
            }
        }
        float op = this.OPACITY + this.f1;
        if (op < 0f) {
            op = 0.0f;
        }
        if (op > 1f) {
            op = 1f;
        }
        return op;
    }

}
