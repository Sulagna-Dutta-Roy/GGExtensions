/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Engine;

import SpaceCraft.FloatPoint;
import SpaceCraft.Menu.Button;
import SpaceCraft.Menu.Label;
import SpaceCraft.Menu.Menu;
import SpaceCraft.Menu.Panel;
import SpaceCraft.MenuBuilder;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockBuilder;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Object.Spaceship.Spaceship;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontFormatException;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Krcma
 */
public class ModelEditor {

    private final Color[] color_list = new Color[]{
        Color.GREEN,
        Color.BLUE,
        Color.RED,
        Color.DARK_GRAY,
        Color.CYAN,
        Color.YELLOW,
        Color.PINK,
        Color.MAGENTA,
        Color.ORANGE
    };

    private Menu menu, shop, inst;

    private BlockType blockType;
    private Color blockColor;

    private final Spaceship spaceship;

    private final Dimension size;

    private final List<BlockType> removedBlocks;
    private final List<BlockType> addedBlocks;

    public ModelEditor(Dimension size) {
        this.size = size;
        this.spaceship = new Spaceship(
                "",
                new FloatPoint(
                        30 + (int) ((size.width - 60) * 0.45f),
                        (int) (size.height * 0.6)
                ),
                true
        );
        this.blockType = BlockType.NORMAL;
        this.blockColor = this.color_list[0];
        this.removedBlocks = new ArrayList<>();
        this.addedBlocks = new ArrayList<>();
    }

    public List<BlockType> getRemovedBlocks() {
        return this.removedBlocks;
    }

    public List<BlockType> getAddedBlocks() {
        return this.addedBlocks;
    }

    public Menu getMenu() {
        return this.menu;
    }

    public Menu getShop() {
        return this.shop;
    }

    public Menu getInstructions() {
        return this.inst;
    }

    public BlockType getBlockType() {
        return this.blockType;
    }

    public void nextColor() {
        int n = 0;
        for (int i = 0; i < this.color_list.length; i++) {
            Color c = (Color) this.color_list[i];
            if (c.equals(this.blockColor)) {
                i++;
                n = i < this.color_list.length ? i : 0;
                break;
            }
        }
        this.blockColor = this.color_list[n];
    }

    public void lastColor() {
        int n = 0;
        for (int i = 0; i < this.color_list.length; i++) {
            Color c = (Color) this.color_list[i];
            if (c.equals(this.blockColor)) {
                i--;
                n = i >= 0 ? i : this.color_list.length - 1;
                break;
            }
        }
        this.blockColor = this.color_list[n];
    }

    public void nextBlockType() {
        if (this.blockType.getID() < 12) {
            this.blockType = BlockType.getBlockWithID(this.blockType.getID() + 1);
        } else {
            this.blockType = BlockType.getBlockWithID(0);
        }
    }

    public void lastBlockType() {
        if (this.blockType.getID() > 0) {
            this.blockType = BlockType.getBlockWithID(this.blockType.getID() - 1);
        } else {
            this.blockType = BlockType.getBlockWithID(12);
        }
    }

    public boolean placeBlock(Point p) {
        Point off = getBlockOffset(p);
        if (off == null) {
            return false;
        }
        Block b = BlockBuilder.getBlock(
                off,
                this.blockColor,
                this.blockType
        );
        for (Block x : this.spaceship.getModel()) {
            if (x.getOffset().equals(b.getOffset())) {
                return false;
            }
        }
        b.setOwner(this.spaceship);
        this.spaceship.getModel().add(b);
        return true;
    }

    public BlockType deleteBlock(Point p) {
        Point off = getBlockOffset(p);
        if (off == null) {
            return null;
        }
        for (Block x : this.spaceship.getModel()) {
            if (x.getOffset().equals(off)) {
                this.spaceship.getModel().remove(x);
                return x.getType();
            }
        }
        return null;
    }

    public Spaceship getSpaceship() {
        return this.spaceship;
    }

    public BufferedImage getSelectedBlockImage() {
        BufferedImage img = new BufferedImage((int) (Block.SIZE * 1.6f), (int) (Block.SIZE * 1.7f), BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = (Graphics2D) img.getGraphics();
        Block b = BlockBuilder.getBlock(
                new Point((int) (Block.SIZE * 0.3f), (int) (Block.SIZE * 0.6f)),
                this.blockColor,
                this.blockType
        );
        b.render(g2, true, false, 0, 0);
        b.render(g2, true, true, 0, 0);
        return img;
    }

    public void getBlock(Point p) {
        Point off = getBlockOffset(p);
        if (off == null) {
            return;
        }
        for (Block b : this.spaceship.getModel()) {
            if (b.getOffset().equals(off)) {
                this.blockColor = b.getColor();
                this.blockType = b.getType();
                return;
            }
        }
    }

    private Point getBlockOffset(Point p) {
        p.x -= 30 + (int) ((this.size.width - 60) * 0.45f - Block.SIZE * 7.5);
        p.y -= (int) (this.size.height * 0.6 - Block.SIZE * 7.5);
        Point seg = new Point(0, 0);
        int w = p.x;
        while (w > Block.SIZE) {
            w -= Block.SIZE;
            seg.x++;
        }
        w = p.y;
        while (w > Block.SIZE) {
            w -= Block.SIZE;
            seg.y++;
        }
        if (seg.x > 14 || seg.y > 14 || seg.x < 0 || seg.y < 0) {
            return null;
        }
        seg.x -= (15 - 1) / 2;
        seg.y -= (15 - 1) / 2;
        seg.x *= Block.SIZE;
        seg.y *= Block.SIZE;
        seg.x -= Block.SIZE / 2;
        seg.y -= Block.SIZE / 2;
        return seg;
    }

    /**
     * ID list(Label) 0 - Total life; 1 - Total mass; 2 - Max speed; 3 - Total
     * complexity; 4 - Max complexity; 5 - Guns; 6 - Damage/s; 7 - Blocks; 8 -
     * Last model; 9 - Block image; 10 - Block name; 11 - Block life; 12 - Block
     * complexity; 13 - Block mass ;14 - Block damage; 15 - damage per hit
     */
    public void init() {
        initShop();
        initInstruction();
        this.menu = new Menu(0, 0);
        this.menu.visibility = true;
        //#############################################
        Panel p = new Panel(
                0,
                15,
                new Dimension((int) ((size.width - 60) * 0.25f), (int) (size.height - 30)),
                new Color(40, 55, 40),
                0.7f
        );
        p.X = 15;
        this.menu.addComponent(p);
        p = new Panel(
                0,
                (int) (size.height * 0.2f),
                new Dimension((int) ((size.width - 60) * 0.4f), (int) (size.height * 0.8f - 15)),
                new Color(40, 40, 55),
                0.7f
        );
        p.X = 30 + (int) ((size.width - 60) * 0.25f);
        this.menu.addComponent(p);
        p = new Panel(
                0,
                15,
                new Dimension((int) ((size.width - 60) * 0.35f), (int) ((size.width - 60) * 0.35f)),
                new Color(55, 40, 40),
                0.7f
        );
        p.X = 45 + (int) ((size.width - 60) * 0.65f);
        this.menu.addComponent(p);
        p = new Panel(
                0,
                30 + (int) ((size.width - 60) * 0.35f),
                new Dimension((int) ((size.width - 60) * 0.35f), (int) (size.height - ((size.width - 60) * 0.35f + 45))),
                new Color(55, 40, 40),
                0.7f
        );
        p.X = 45 + (int) ((size.width - 60) * 0.65f);
        this.menu.addComponent(p);
        //#############################################
        Font f = null;
        try {
            f = Font.createFont(
                    Font.TRUETYPE_FONT,
                    this.getClass().getResourceAsStream("/font.ttf")
            );
            f = f.deriveFont(40F);
            Label l = new Label(30 + (int) ((size.width - 60) * 0.45f), (int) (size.height * 0.1f), "spaceship editor", new Color(110, 170, 110), f, 0.9f);
            l.ID = -1;
            this.menu.addComponent(l);
        } catch (FontFormatException | IOException ex) {
            Logger.getLogger(MenuBuilder.class.getName()).log(Level.SEVERE, null, ex);
        }
        //#############################################
        Button b = new Button(
                0,
                (int) (size.height - 45),
                new Dimension(200, 45),
                "Back",
                new Color(100, 60, 60),
                new Color(140, 110, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = size.width - 230;
        this.menu.addComponent(b);
        b = new Button(
                0,
                (int) (size.height - 105),
                new Dimension(200, 45),
                "Save model",
                new Color(100, 60, 60),
                new Color(140, 110, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = size.width - 230;
        this.menu.addComponent(b);
        b = new Button(
                0,
                (int) (size.height - 165),
                new Dimension(200, 45),
                "Build last model",
                new Color(100, 60, 60),
                new Color(140, 110, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = size.width - 230;
        this.menu.addComponent(b);
        b = new Button(
                0,
                (int) (size.height - 225),
                new Dimension(410, 45),
                "Instructions",
                new Color(100, 60, 60),
                new Color(140, 110, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = size.width - 440;
        this.menu.addComponent(b);
        b = new Button(
                0,
                (int) (size.height - 45),
                new Dimension(200, 45),
                "Clear",
                new Color(100, 60, 60),
                new Color(140, 110, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = size.width - 440;
        this.menu.addComponent(b);
        b = new Button(
                0,
                (int) (size.height - 105),
                new Dimension(200, 45),
                "Destroy groups",
                new Color(100, 60, 60),
                new Color(140, 110, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = size.width - 440;
        this.menu.addComponent(b);
        b = new Button(
                0,
                (int) (size.height - 165),
                new Dimension(200, 45),
                "Shop",
                new Color(100, 60, 60),
                new Color(140, 110, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = size.width - 440;
        this.menu.addComponent(b);
        //#############################################
        Label l = new Label(
                30,
                45,
                "Space ship",
                new Color(110, 150, 110),
                new Font("Tahoma", Font.BOLD, 29),
                0.9f
        );
        l.ID = -1;
        l.center = false;
        this.menu.addComponent(l);

        l = new Label(
                60 + (int) ((size.width - 60) * 0.65f),
                45,
                "Last model",
                new Color(150, 110, 110),
                new Font("Tahoma", Font.BOLD, 29),
                0.9f
        );
        l.ID = -1;
        l.center = false;
        this.menu.addComponent(l);

        l = new Label(
                45 + (int) ((size.width - 60) * 0.25f),
                45 + (int) (size.height * 0.2),
                "Actual model",
                new Color(110, 110, 150),
                new Font("Tahoma", Font.BOLD, 29),
                0.9f
        );
        l.ID = -1;
        l.center = false;
        this.menu.addComponent(l);

        for (int i = 0; i < 8; i++) {
            l = new Label(
                    30,
                    90 + i * 35,
                    "",
                    new Color(70, 110, 70),
                    new Font("Tahoma", Font.BOLD, 22),
                    0.9f
            );
            l.ID = i;
            l.center = false;
            this.menu.addComponent(l);
        }

        l = new Label(
                30,
                395,
                "Block",
                new Color(110, 150, 110),
                new Font("Tahoma", Font.BOLD, 29),
                0.9f
        );
        l.ID = -1;
        l.center = false;
        this.menu.addComponent(l);

        l = new Label(
                70,
                435,
                "",
                new Color(50, 90, 50),
                new Font("Tahoma", Font.BOLD, 22),
                0.9f
        );
        l.ID = 9;
        l.center = false;
        this.menu.addComponent(l);

        for (int i = 0; i < 6; i++) {
            l = new Label(
                    30,
                    475 + i * 30,
                    "",
                    new Color(70, 110, 70),
                    new Font("Tahoma", Font.BOLD, 22),
                    0.9f
            );
            l.ID = 10 + i;
            l.center = false;
            this.menu.addComponent(l);
        }
        //#############################################
        l = new Label(
                (int) (size.width - 15 - (size.width - 60) * 0.175f),
                60,
                "",
                new Color(110, 150, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.9f
        );
        l.ID = 8;
        this.menu.addComponent(l);
        //#############################################
    }

    /**
     * ID (label) 0 - coins; 1<->11 number of blocks
     */
    private void initShop() {
        this.shop = new Menu(0, 0);
        Panel p = new Panel(
                0,
                0,
                new Dimension(size.width, size.height),
                new Color(0, 0, 0),
                0.7f
        );
        p.X = 0;
        this.shop.addComponent(p);
        p = new Panel(
                size.width / 2,
                (int) (size.height * 0.15),
                new Dimension((int) (size.width * 0.6), (int) (size.height * 0.7)),
                new Color(50, 50, 65),
                0.9f
        );
        this.shop.addComponent(p);
        Label l = new Label(
                0,
                (int) (size.height * 0.15 + 35),
                "Shop",
                new Color(110, 110, 150),
                new Font("Tahoma", Font.BOLD, 30),
                0.9f
        );
        l.ID = -1;
        l.center = false;
        l.X = (int) (size.width * 0.2 + 20);
        this.shop.addComponent(l);
        l = new Label(
                0,
                (int) (size.height * 0.15 + 35),
                "Coins:",
                new Color(100, 100, 130),
                new Font("Tahoma", Font.PLAIN, 22),
                0.9f
        );
        l.center = false;
        l.X = (int) (size.width * 0.2 + 200);
        l.ID = 0;
        this.shop.addComponent(l);
        int f = 0;
        for (int i = 0; i < 13; i++) {
            BlockType bt = BlockType.getBlockWithID(i);
            if (bt != BlockType.CPU_BLOCK) {
                l = new Label(
                        0,
                        (int) (size.height * 0.15 + 75 + (i - f) * 35),
                        "",
                        new Color(100, 100, 140),
                        new Font("Tahoma", Font.BOLD, 22),
                        0.9f
                );
                l.center = false;
                l.X = (int) (size.width * 0.2 + 100);
                l.ID = -1;
                l.TEXT = bt.getName();
                BufferedImage img = new BufferedImage((int) (Block.SIZE * 1.6f), (int) (Block.SIZE * 1.7f), BufferedImage.TYPE_INT_ARGB);
                Graphics2D g2 = (Graphics2D) img.getGraphics();
                Block b = BlockBuilder.getBlock(
                        new Point((int) (Block.SIZE * 0.3f), (int) (Block.SIZE * 0.6f)),
                        this.blockColor,
                        bt
                );
                b.render(g2, true, false, 0, 0);
                b.render(g2, true, true, 0, 0);
                l.setImage(img, -45, -30);
                this.shop.addComponent(l);
                l = new Label(
                        0,
                        (int) (size.height * 0.15 + 75 + (i - f) * 35),
                        "",
                        new Color(100, 140, 100),
                        new Font("Tahoma", Font.BOLD, 22),
                        0.9f
                );
                l.center = false;
                l.X = (int) (size.width * 0.2 + 350);
                l.ID = -1;
                l.TEXT = "Cost:" + bt.getCost();
                this.shop.addComponent(l);
                l = new Label(
                        0,
                        (int) (size.height * 0.15 + 75 + (i - f) * 35),
                        "x",
                        new Color(140, 100, 100),
                        new Font("Tahoma", Font.BOLD, 22),
                        0.9f
                );
                l.center = false;
                l.X = (int) (size.width * 0.2 + 475);
                l.ID = 1 + i - f;
                this.shop.addComponent(l);
                Button bb = new Button(
                        0,
                        (int) (size.height * 0.15 + 65 + (i - f) * 35),
                        new Dimension(100, 30),
                        "Buy",
                        new Color(100, 60, 60),
                        new Color(140, 110, 110),
                        new Font("Tahoma", Font.BOLD, 22),
                        0.8f
                );
                bb.ID = 1 + i - f;
                bb.X = (int) (size.width * 0.2 + 565);
                this.shop.addComponent(bb);
            } else {
                f++;
            }
        }
        Button b = new Button(
                0,
                (int) (size.height * 0.85 - 45),
                new Dimension(100, 30),
                "Back",
                new Color(60, 60, 100),
                new Color(110, 110, 140),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = (int) (size.width * 0.2 + 15);
        this.shop.addComponent(b);
    }

    private void initInstruction() {
        this.inst = new Menu(0, 0);
        Panel p = new Panel(
                size.width / 2,
                0,
                new Dimension(size.width, size.height),
                new Color(0, 0, 0),
                0.7f
        );
        this.inst.addComponent(p);
        p = new Panel(
                size.width / 2,
                (int) (size.height * 0.1),
                new Dimension((int) (size.width * 0.6f), (int) (size.height * 0.8f)),
                new Color(40, 55, 40),
                new Color(110, 140, 110),
                new Font("Tahoma", Font.BOLD, 21),
                0.85f,
                new String[]{
                    "Instructions",
                    "",
                    "Blocks forming the spaceship must be joined in one group.",
                    "Every spaceship must have a CPU block without it spaceship",
                    "can't live. For moving you must use engine block and for firing",
                    "some gun block. Complixity of your spaceship can't rewind",
                    "maximum complexity. Block you can buy in shop. Coins you",
                    "get in battle.",
                    "",
                    "Control:",
                    "Right mouse button -> place selected block",
                    "Left mouse button -> remove block from workspace",
                    "Middle(Wheel) mouse button -> Gets a block to use",
                    "Wheel scrolling -> block type changing",
                    "Wheel scrolling + CTRL -> color changing"
                }
        );
        this.inst.addComponent(p);
        Button b = new Button(
                (int) (size.width * 0.5),
                (int) (size.height * 0.85),
                new Dimension(180, 40),
                "Back",
                new Color(60, 100, 60),
                new Color(110, 140, 110),
                new Font("Tahoma", Font.BOLD, 30),
                0.8f
        );
        this.inst.addComponent(b);
    }

    public void render(Graphics2D g2) {
        this.menu.render(g2);
        drawBoard(
                g2,
                Block.SIZE * 15,
                30 + (int) ((this.size.width - 60) * 0.45f - Block.SIZE * 7.5),
                (int) (this.size.height * 0.6 - Block.SIZE * 7.5)
        );
        this.spaceship.render(g2, 0, 0);
        g2.setColor(Color.black);
        g2.setStroke(new BasicStroke(1));
        g2.drawLine(
                (int) (30 + (this.size.width - 60) * 0.45f - Block.SIZE / 4),
                (int) (this.size.height * 0.6),
                (int) (30 + (this.size.width - 60) * 0.45f + Block.SIZE / 4),
                (int) (this.size.height * 0.6)
        );
        g2.drawLine(
                (int) (30 + (this.size.width - 60) * 0.45f),
                (int) (this.size.height * 0.6 - Block.SIZE / 4),
                (int) (30 + (this.size.width - 60) * 0.45f),
                (int) (this.size.height * 0.6 + Block.SIZE / 4)
        );
        this.shop.render(g2);
        this.inst.render(g2);
    }

    private void drawBoard(Graphics2D g2, int size, int x, int y) {
        g2.setStroke(new BasicStroke(1));
        g2.setColor(new Color(90, 90, 80));
        g2.fillRect(x, y, size, size);
        g2.setColor(new Color(30, 30, 20));
        float step = Block.SIZE;
        for (int j = 1; j <= 15; j++) {
            g2.drawLine(x, y + (int) (j * step), x + size, y + (int) (j * step));
            g2.drawLine(x + (int) (j * step), y, x + (int) (j * step), y + size);
        }
        g2.drawRect(x, y, size, size);
    }

}
