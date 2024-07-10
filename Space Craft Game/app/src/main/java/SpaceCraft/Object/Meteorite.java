/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Polygon;
import java.awt.image.BufferedImage;
import java.util.ArrayList;

/**
 *
 * @author Krcma
 */
public class Meteorite {

    private final BufferedImage image;
    public float x, y;
    private final float mx, my;
    public final float radius;
    private boolean spawn = false;

    public Meteorite(int x, int y, int size) {
        this.x = x;
        this.y = y;
        this.radius = size / 2;
        this.image = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = (Graphics2D) this.image.createGraphics();
        Polygon p = createMeteorite(
                size,
                size,
                (double) (Math.random() * 4d + 5d),
                (int) (Math.random() * 8 + 6)
        );
        int k = (int) (Math.random() * 40-20);
        Color color = new Color(k + 40, k + 35, k + 30);
        g2.setStroke(new BasicStroke(6));
        g2.setColor(color.darker());
        g2.drawPolygon(p);
        g2.setColor(color);
        g2.fillPolygon(p);
        this.mx = (float) (Math.random() * 1.5f - 0.75f);
        this.my = (float) (Math.random() * 3f + 1.5f);
        if (this.y < 0) {
            this.spawn = true;
        }
    }

    private static Polygon createMeteorite(int w, int h, double max_alpha, int points) {
        //create points
        Point[] pts = new Point[points];
        float r_min = Math.min(w, h) * 0.3f;
        float r_max = Math.min(w, h) * 0.45f;
        double a = 0d;
        for (int i = 0; i < points; i++) {
            float dist = (float) (Math.random() * (r_max - r_min)) + r_min;
            double alpha = (Math.random() * 2 - 1) * max_alpha;
            int x = (int) (Math.cos(a + alpha) * dist) + w / 2;
            int y = (int) (Math.sin(a + alpha) * dist) + h / 2;
            a = alpha;
            pts[i] = new Point(x, y);
        }
        //add alpha
        ArrayList<Object[]> aplha_pts = new ArrayList<>();
        for (Point pt : pts) {
            double aplha = Math.acos((pt.x - w / 2d) / Math.sqrt(Math.pow(pt.x - w / 2d, 2) + Math.pow(pt.y - h / 2f, 2)));
            aplha = (float) Math.toDegrees(aplha);
            if(h / 2f - pt.y<0) {
                aplha *= -1;
            }
            aplha_pts.add(new Object[]{pt, aplha});
        }
        //sort
        int[] xpts = new int[pts.length], ypts = new int[pts.length];
        int i = 0;
        while (!aplha_pts.isEmpty()) {
            Object[] min = null;
            for (Object[] o : aplha_pts) {
                if (min == null) {
                    min = o;
                } else if ((double) o[1] < (double) min[1]) {
                    min = o;
                }
            }
            aplha_pts.remove(min);
            xpts[i] = ((Point) min[0]).x;
            ypts[i] = ((Point) min[0]).y;
            i++;
        }
        return new Polygon(xpts, ypts, pts.length);
    }

    public void refresh() {
        this.x += this.mx;
        this.y += this.my;
        if (this.y >= 0) {
            this.spawn = false;
        }
    }

    public boolean isOut(Dimension size) {
        if (this.spawn) {
            return false;
        }
        return this.x + this.radius < 0 || this.y + this.radius < 0 || size.width < this.x - this.radius || size.height < this.y - this.radius;
    }

    public void render(Graphics2D g2, int x_off, int y_off) {
        g2.drawImage(this.image, (int) (this.x + x_off - this.radius), (int) (this.y + y_off - this.radius), null);
    }

}
