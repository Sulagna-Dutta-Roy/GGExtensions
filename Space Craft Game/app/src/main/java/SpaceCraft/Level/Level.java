/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Level;

import SpaceCraft.Game;
import SpaceCraft.LevelEditor;
import SpaceCraft.Tools;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import javax.swing.ImageIcon;

/**
 *
 * @author Krcma
 */
public class Level implements Serializable {

    public List<String> commands;

    public String TEXT;

    public int max_complexity = 0;

    private Dimension size;
    private int[] pixels;

    public int getMaxComplexity() {
        return this.max_complexity;
    }

    public void createImage(BufferedImage img) {
        this.size = new Dimension(img.getWidth(), img.getHeight());
        this.pixels = img.getRGB(
                0,
                0,
                img.getWidth(),
                img.getHeight(),
                null,
                0,
                img.getWidth()
        );
    }

    public BufferedImage getBufferedImage() {
        BufferedImage img = null;
        try {
            img = new BufferedImage((int) this.size.getWidth(), (int) this.size.getHeight(), BufferedImage.TYPE_INT_ARGB);
            for (int j = 0; j < this.size.width; j++) {
                for (int k = 0; k < this.size.height; k++) {
                    img.setRGB(j, k, this.pixels[j + k * this.size.width]);
                }
            }
            try {
                img = Tools.risizeImage(img, new Dimension((int) (Game.engine.getHeight() * 0.5f * 1f / Game.YSCALE), (int) (Game.engine.getHeight() * 0.5f * 1f / Game.YSCALE)));
            } catch (Exception ex) {
                img = Tools.risizeImage(img, new Dimension(68, 68));
            }
        } catch (Exception ex) {
            ImageIcon i = new ImageIcon(this.getClass().getResource("/SpaceCraft/src/level.png"));
            img = new BufferedImage(i.getIconWidth(), i.getIconHeight(), BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2 = (Graphics2D) img.getGraphics();
            g2.drawImage(i.getImage(), 0, 0, null);
            g2.setColor(Color.WHITE);
            g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.3f));
            g2.setFont(new Font("Tahoma", Font.BOLD, 30));
            g2.drawString("Level " + (Game.gameManager.getSave().getLevel() + 1), 15, i.getIconHeight() - 15);
            img = Tools.risizeImage(img, new Dimension((int) (Game.engine.getHeight() * 0.5f * 1f / Game.YSCALE), (int) (Game.engine.getHeight() * 0.5f * 1f / Game.YSCALE)));
        }
        return img;
    }

    public Level() {
        this.commands = new ArrayList<>();
    }

    public Level(List<String> commands) {
        this.commands = commands;
    }

    public String getCommand() {
        return this.commands.isEmpty() ? "" : this.commands.get(0);
    }

    public void nextCommand() {
        if (!this.commands.isEmpty()) {
            this.commands.remove(0);
        }
    }

}
