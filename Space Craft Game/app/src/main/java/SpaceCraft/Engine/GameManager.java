/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Engine;

import SpaceCraft.Game;
import SpaceCraft.Level.LevelManager;
import SpaceCraft.LevelIO;
import SpaceCraft.Menu.Button;
import SpaceCraft.Menu.Label;
import SpaceCraft.ModelViewer;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Save;
import SpaceCraft.Tools;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.List;

/**
 *
 * @author Krcma
 */
public class GameManager {

    private Save save;

    private long time;

    private final LevelManager lm;

    public GameManager() {
        this.lm = new LevelManager(this);
    }

    public Save getSave() {
        return this.save;
    }

    public void closeSave() {
        this.save = null;
    }

    public void createSave(String name, String world) {
        this.save = new Save(name, world);
        SpaceCraft.SavaIO.write(this.save, new File("save/" + name + ".scs"));
        this.time = System.nanoTime();
    }

    public boolean saveGame() {
        int sec = (int) ((System.nanoTime() - this.time) / 1e9);
        this.save.addTime(sec);
        boolean state = SpaceCraft.SavaIO.write(this.save,
                new File("save/" + this.save.getPlayer().getName() + ".scs"));
        return state;
    }

    public void loadSave(File f) {
        this.save = SpaceCraft.SavaIO.read(f);
        this.time = System.nanoTime();
    }

    public LevelManager getLevelManager() {
        return this.lm;
    }

    public void refreshImagesInHubMenu() {
        // images
        Game.hubMenu.labels.stream().filter((l) -> (l.ID == 4)).forEachOrdered((l) -> {
            l.setImage(
                    ModelViewer.getImageOfSpaceship(Game.gameManager.getSave().getPlayer(),
                            (int) (Game.engine.getHeight() * 0.5f * 1f / Game.YSCALE),
                            (int) (Game.engine.getHeight() * 0.5f * 1f / Game.YSCALE)),
                    0,
                    0);
        });
        // images
        if (!Game.gameManager.getLevelManager().getLevel().TEXT.equals(LevelIO.ENDLEVEL)) {
            Game.hubMenu.labels.stream().filter((l) -> (l.ID == 18)).forEachOrdered((l) -> {
                l.setImage(
                        Game.gameManager.getLevelManager().getLevel().getBufferedImage(),
                        0,
                        0);
            });
        } else {
            Game.hubMenu.labels.stream().filter((l) -> (l.ID == 18)).forEachOrdered((l) -> {
                l.setImage(null, 0, 0);
            });
        }
    }

    public void refreshEditorMenuImages() {
        // images
        Game.engine.getModelEditor().getMenu().labels.stream().filter((l) -> (l.ID == 8)).forEachOrdered((l) -> {
            l.setImage(
                    ModelViewer.getImageOfSpaceship(
                            Game.gameManager.getSave().getPlayer(),
                            (int) ((1366 - 60) * 0.3f),
                            (int) ((1366 - 60) * 0.3f)),
                    0,
                    0);
        });
    }

    public void refreshEditorMenuStats() {
        for (Label l : Game.engine.getModelEditor().getMenu().labels) {
            switch (l.ID) {
                case 0:
                    l.TEXT = "Total life: " + Game.engine.getModelEditor().getSpaceship().getTotalLife() + " HP";
                    break;
                case 1:
                    l.TEXT = "Total mass: "
                            + String.format("%.2f", Game.engine.getModelEditor().getSpaceship().getTotalMass()) + " t";
                    break;
                case 2:
                    l.TEXT = "Max speed: ";
                    break;
                case 3:
                    int comp = 0;
                    comp = Game.engine.getModelEditor().getSpaceship().getModel().stream()
                            .map((b) -> b.getType().getComplexity()).reduce(comp, Integer::sum);
                    l.TEXT = "Complexity: " + comp;
                    break;
                case 4:
                    l.TEXT = "Max complexity: " + this.getLevelManager().getLevel().getMaxComplexity();
                    break;
                case 5:
                    l.TEXT = "Guns: " + Game.engine.getModelEditor().getSpaceship().getGuns().size();
                    break;
                case 6:
                    float td = 0;
                    List<Block> model = Game.engine.getModelEditor().getSpaceship().getModel();
                    td = model.stream().map((b) -> b.getType().getDamage()).reduce(td,
                            (accumulator, _item) -> accumulator + _item);
                    l.TEXT = "Damage/s: " + String.format("%.2f", td);
                    break;
                case 7:
                    l.TEXT = "Blocks: " + Game.engine.getModelEditor().getSpaceship().getModel().size();
                    break;
                case 9:
                    l.setImage(Game.engine.getModelEditor().getSelectedBlockImage(), -40, -30);
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(
                            Game.engine.getModelEditor().getBlockType());
                    break;
                case 10:
                    l.TEXT = "Name: " + Game.engine.getModelEditor().getBlockType().getName();
                    break;
                case 11:
                    l.TEXT = "Life: " + Game.engine.getModelEditor().getBlockType().getLife();
                    break;
                case 12:
                    l.TEXT = "Complexity: " + Game.engine.getModelEditor().getBlockType().getComplexity();
                    break;
                case 13:
                    l.TEXT = "Mass: " + Game.engine.getModelEditor().getBlockType().getMass() + " t";
                    break;
                case 14:
                    BlockType bt = Game.engine.getModelEditor().getBlockType();
                    switch (bt) {
                        case SHIELD_BLOCK:
                            l.TEXT = "Give shield [100HP]";
                            break;
                        case HEALING_BLOCK:
                            l.TEXT = "+1HP per second";
                            break;
                        default:
                            float dmg = bt.getDamage();
                            if (dmg != 0f) {
                                l.TEXT = "Damage/s: " + String.format("%.2f", dmg);
                            } else {
                                l.TEXT = "";
                            }
                            break;
                    }
                    break;
                case 15:
                    int d = Game.engine.getModelEditor().getBlockType().getDamagePerHit();
                    if (d != 0f) {
                        l.TEXT = "Damage per hit: " + d;
                    } else {
                        l.TEXT = "";
                    }
                    break;
            }
        }
    }

    public void refreshEditorShopStats() {
        for (Label l : Game.engine.getModelEditor().getShop().labels) {
            switch (l.ID) {
                case 0:
                    l.TEXT = "Coins: " + Game.gameManager.getSave().getInventory().getCoins();
                    break;
                case 1:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.NORMAL);
                    break;
                case 2:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.MEDIUM);
                    break;
                case 3:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.HEAVY);
                    break;
                case 4:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.LASER_GUN);
                    break;
                case 5:
                    l.TEXT = "x"
                            + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.DOUBLE_LASER_GUN);
                    break;
                case 6:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.SNIPER_GUN);
                    break;
                case 7:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.PLASMA_GUN);
                    break;
                case 8:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.TRIPLE_GUN);
                    break;
                case 9:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.ENGINE_BLOCK);
                    break;
                case 10:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.HEALING_BLOCK);
                    break;
                case 11:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.SHIELD_BLOCK);
                    break;
                case 12:
                    l.TEXT = "x" + Game.gameManager.getSave().getInventory().getNumberOfBlocks(BlockType.SHOTGUN);
                    break;
            }
        }
    }

    public void loadAllSaves(int last) {
        Game.loadGameMenu.labels.clear();
        for (int i = 0; i < Game.loadGameMenu.buttons.size(); i++) {
            Button b = Game.loadGameMenu.buttons.get(i);
            if (!b.TEXT.equals("back") && !b.TEXT.equals(">") && !b.TEXT.equals("<")) {
                Game.loadGameMenu.buttons.remove(b);
                i = -1;
            }
        }
        File[] saves = (new File("save")).listFiles((File pathname) -> pathname.getPath().endsWith(".scs"));
        int i = 0, k = 0, f = 0;
        final int offsetX = (int) (Game.engine.getSize().getWidth() * 0.1f + 200);
        final int offsetY = (int) (Game.engine.getSize().getHeight() * 0.065f);
        for (File sf : saves) {
            if (i == 3) {
                i = 0;
                k++;
            }
            if (f + 1 > last) {
                return;
            }
            if (f >= last - 6) {
                try {
                    Save s = SpaceCraft.SavaIO.read(sf);
                    Label l = new Label(
                            (int) (offsetX + 450 * k),
                            (int) (offsetY + 200 * i + 15),
                            "File: " + sf.getName(),
                            new Color(70, 95, 70),
                            new Font("Tahoma", Font.BOLD, 18),
                            0.8f);
                    l.ID = i;
                    l.center = false;
                    BufferedImage img = new BufferedImage(190, 190, BufferedImage.TYPE_INT_ARGB);
                    Graphics2D g2 = (Graphics2D) img.getGraphics();
                    g2.setStroke(new BasicStroke(5));
                    g2.setColor(new Color(100, 120, 100));
                    g2.drawRect(0, 0, 190, 190);
                    g2.drawImage(Tools.getImageFromSave(s, new Dimension(184, 184)), 3, 3, null);
                    l.setImage(img, -200, -20);
                    Game.loadGameMenu.labels.add(l);
                    l = new Label(
                            (int) (offsetX + 450 * k),
                            (int) (offsetY + 200 * i + 40),
                            "Name: " + s.getPlayer().getName(),
                            new Color(80, 80, 105),
                            new Font("Tahoma", Font.BOLD, 18),
                            0.8f);
                    l.ID = -1;
                    l.center = false;
                    Game.loadGameMenu.labels.add(l);
                    int ss = s.getTotalTime();
                    int h = 0,
                            m = 0;
                    while (ss > 59) {
                        ss -= 60;
                        m++;
                    }
                    while (m > 59) {
                        m -= 60;
                        h++;
                    }
                    l = new Label(
                            (int) (offsetX + 450 * k),
                            (int) (offsetY + 200 * i + 65),
                            "Total play time: " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":"
                                    + (ss < 10 ? "0" + ss : ss),
                            new Color(80, 80, 105),
                            new Font("Tahoma", Font.BOLD, 18),
                            0.8f);
                    l.ID = -1;
                    l.center = false;
                    Game.loadGameMenu.labels.add(l);
                    l = new Label(
                            (int) (offsetX + 450 * k),
                            (int) (offsetY + 200 * i + 90),
                            "Level: " + (s.getLevel() + 1),
                            new Color(75, 50, 50),
                            new Font("Tahoma", Font.BOLD, 18),
                            0.8f);
                    l.ID = -1;
                    l.center = false;
                    Game.loadGameMenu.labels.add(l);
                    l = new Label(
                            (int) (offsetX + 450 * k),
                            (int) (offsetY + 200 * i + 115),
                            "Coins: " + s.getInventory().getCoins(),
                            new Color(75, 75, 50),
                            new Font("Tahoma", Font.BOLD, 18),
                            0.8f);
                    l.ID = -1;
                    l.center = false;
                    Game.loadGameMenu.labels.add(l);
                    l = new Label(
                            (int) (offsetX + 450 * k),
                            (int) (offsetY + 200 * i + 140),
                            "Campaign: " + s.getGameDir(),
                            new Color(80, 80, 105),
                            new Font("Tahoma", Font.BOLD, 18),
                            0.8f);
                    l.ID = -1;
                    l.center = false;
                    Game.loadGameMenu.labels.add(l);
                    Button b = new Button(
                            0,
                            (int) (offsetY + 200 * i + 165),
                            new Dimension(100, 30),
                            "Play",
                            new Color(60, 60, 100),
                            new Color(110, 110, 140),
                            new Font("Tahoma", Font.BOLD, 18),
                            0.8f);
                    b.X = (int) (offsetX + 450 * k);
                    b.ID = i;
                    Game.loadGameMenu.buttons.add(b);
                    b = new Button(
                            0,
                            (int) (offsetY + 200 * i + 165),
                            new Dimension(100, 30),
                            "Delete",
                            new Color(100, 60, 60),
                            new Color(140, 110, 110),
                            new Font("Tahoma", Font.BOLD, 18),
                            0.8f);
                    b.ID = i;
                    b.X = (int) (offsetX + 110 + 450 * k);
                    Game.loadGameMenu.buttons.add(b);
                    i++;
                } catch (Exception ex) {
                }
            }
            f++;
        }
    }

    private int total_life_new = 0;

    public void lifeBar_Max() {
        this.total_life_new = 0;
        Game.gameManager.getSave().getPlayer().getModelCopy().forEach((b) -> {
            this.total_life_new += b.getLife();
        });
    }

    public int lifeBar(int max) {
        if (this.total_life_new == 0) {
            return 0;
        } else {
            return (int) (((float) Game.gameManager.getSave().getPlayer().getTotalLife() / (float) this.total_life_new)
                    * (float) max);
        }
    }

}
