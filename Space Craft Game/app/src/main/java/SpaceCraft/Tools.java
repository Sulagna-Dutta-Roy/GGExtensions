/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Engine.EngineCore.EngineMode;
import SpaceCraft.Engine.MouseControler;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Object.GraphicsText;
import SpaceCraft.Object.Particle;
import SpaceCraft.Object.Spaceship.Spaceship;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.Point;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Krcma
 */
public class Tools {

    /**
     * Shift color for blocks
     *
     * @param c
     * @return
     */
    public static Color shiftColor(Color c) {
        return new Color(c.getBlue(), c.getRed(), c.getGreen());
    }

    /**
     * Darker color for blocks
     *
     * @param c
     * @return
     */
    public static Color darkerColor(Color c) {
        int r = c.getRed() - 150;
        int g = c.getGreen() - 150;
        int b = c.getBlue() - 150;
        r = r < 0 ? 0 : r;
        g = g < 0 ? 0 : g;
        b = b < 0 ? 0 : b;
        return new Color(r, g, b);
    }

    /**
     * Rotate model of spaceship (180)
     *
     * @param model
     */
    public static void rotateModel(List<Block> model) {
        Point min = new Point(Integer.MAX_VALUE, Integer.MAX_VALUE);
        Point max = new Point(Integer.MIN_VALUE, Integer.MIN_VALUE);
        model.stream().map((b) -> {
            min.x = Math.min(min.x, b.getOffset().x);
            return b;
        }).map((b) -> {
            min.y = Math.min(min.y, b.getOffset().y);
            return b;
        }).map((b) -> {
            max.x = Math.max(max.x, b.getOffset().x);
            return b;
        }).forEachOrdered((b) -> {
            max.y = Math.max(max.y, b.getOffset().y);
        });
        int w = max.x - min.x;
        int h = max.y - min.y;
        model.stream().map((b) -> {
            b.getOffset().x = w - b.getOffset().x + min.x * 2;
            return b;
        }).forEachOrdered((b) -> {
            b.getOffset().y = h - b.getOffset().y + min.y * 2;
        });
    }

    /**
     * If spaceship is divided into groups of blocks, then kill small groups
     *
     * @param ssm Model of spaceship
     * @return Return blocks from all small groups
     */
    public static List<Block> spaceshipBreakupTest(List<Block> ssm) {
        List<Point> model = new ArrayList<>();
        ssm.forEach((b) -> {
            model.add(b.getOffset());
        });
        List<List<Point>> groups = new ArrayList<>();
        int[] xx = new int[]{0, 0, Block.SIZE, -Block.SIZE};
        int[] yy = new int[]{Block.SIZE, -Block.SIZE, 0, 0};
        while (model.size() > 0) {
            Point p = (Point) model.get(0);
            List<Point> group = new ArrayList<>();
            groups.add(group);
            group.add(p);
            model.remove(p);
            for (int i = 0; i < 4; i++) {
                Point off = new Point(p.x + xx[i], p.y + yy[i]);
                breakupTest(
                        model,
                        group,
                        off
                );
            }
        }
        List<Block> out = new ArrayList<>();
        if (groups.size() == 1) {
            return out;
        } else {
            //find largest
            int index = 0, max = 0;
            for (int i = 0; i < groups.size(); i++) {
                List<Block> group = new ArrayList<>();
                for (Point p : groups.get(i)) {
                    for (Block b : ssm) {
                        if (b.getOffset().equals(p)) {
                            group.add(b);
                            break;
                        }
                    }
                }
                //if in the group is CPU block then return
                for (Block b : group) {
                    if (b.getType() == BlockType.CPU_BLOCK) {
                        for (int j = 0; j < groups.size(); j++) {
                            if (j != i) {
                                for (Point p : groups.get(j)) {
                                    for (Block c : ssm) {
                                        if (c.getOffset().equals(p)) {
                                            out.add(c);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        return out;
                    }
                }
                //max
                if (group.size() > max) {
                    max = group.size();
                    index = i;
                }
            }
            for (int j = 0; j < groups.size(); j++) {
                if (j != index) {
                    for (Point p : groups.get(j)) {
                        for (Block b : ssm) {
                            if (b.getOffset().equals(p)) {
                                out.add(b);
                                break;
                            }
                        }
                    }
                }
            }
            return out;
        }
    }

    private static void breakupTest(List<Point> model, List<Point> group, Point p) {
        int[] xx = new int[]{0, 0, Block.SIZE, -Block.SIZE};
        int[] yy = new int[]{Block.SIZE, -Block.SIZE, 0, 0};
        for (int j = 0; j < model.size(); j++) {
            Point b = (Point) model.get(j);
            if (p.equals(b)) {
                group.add(b);
                model.remove(b);
                for (int i = 0; i < 4; i++) {
                    Point off = new Point(b.x + xx[i], b.y + yy[i]);
                    breakupTest(
                            model,
                            group,
                            off
                    );
                }
                return;
            }
        }
    }

    public static List<Block> copyModel(List<Block> model) {
        List<Block> model_copy = new ArrayList<>();
        model.forEach((b) -> {
            try {
                model_copy.add(b.clone());
            } catch (CloneNotSupportedException ex) {
                Logger.getLogger(MouseControler.class.getName()).log(Level.SEVERE, null, ex);
            }
        });
        return model_copy;
    }

    public static BufferedImage getImageFromSave(Save s, Dimension size) {
        BufferedImage pl = new BufferedImage(Block.SIZE * 15, Block.SIZE * 15, BufferedImage.TYPE_INT_RGB);
        s.getPlayer().setPosition(new FloatPoint(Block.SIZE * 7.5f, Block.SIZE * 7.5f));
        try {
            s.getPlayer().render((Graphics2D) pl.getGraphics(), 0, 0);
        } catch (Exception ex) {
        }
        BufferedImage out = new BufferedImage(size.width, size.height, BufferedImage.TYPE_INT_ARGB);
        Image i = pl.getScaledInstance(size.width, size.height, Image.SCALE_DEFAULT);
        ((Graphics2D) out.getGraphics()).drawImage(i, 0, 0, null);
        return out;
    }

    public static BufferedImage risizeImage(BufferedImage img, Dimension size) {
        BufferedImage out = new BufferedImage(size.width, size.height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = out.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(img, 0, 0, size.width, size.height, null);
        return out;
    }

    public static void showDropText(String text, int x, int y, int size, Color c) {
        GraphicsText gt = new GraphicsText(
                text,
                x,
                y,
                size,
                Game.RPS * 2,
                c
        );
        gt.addMove((float) (Math.random() * 0.3f - 0.15f), 0.8f);
        gt.RealPosition = true;
        Game.engine.texts.add(gt);
    }

    public static void createExposion(FloatPoint p, int number, Color c, int speed, int time) {
        for (int i = 0; i < number; i++) {
            Game.engine.particles.add(
                    new Particle(
                            new FloatPoint(
                                    p.x + (float) (Math.random() * Block.SIZE - Block.SIZE / 2f),
                                    p.y + (float) (Math.random() * Block.SIZE - Block.SIZE / 2f)
                            ),
                            c,
                            time,
                            (int) (Math.random() * 2 + 3),
                            (float) (Math.random() * 2f * (float) speed - (float) speed),
                            (float) (Math.random() * 2f * (float) speed - (float) speed)
                    )
            );
        }
    }

    public static void shootEffect(FloatPoint p, Color c, int number, boolean fromDown, float x) {
        for (int i = 0; i < number; i++) {
            Game.engine.particles.add(
                    new Particle(
                            new FloatPoint(p.x, p.y),
                            c,
                            Game.RPS / 3,
                            2 + (int) (Math.random() * 2),
                            (float) (Math.random() * 2f - 1f) + x,
                            fromDown ? -(float) (Math.random() * 2f + 4f) : (float) (Math.random() * 2f + 4f)
                    )
            );
        }
    }

    public static boolean isGun(BlockType b) {
        return b == BlockType.LASER_GUN
                || b == BlockType.DOUBLE_LASER_GUN
                || b == BlockType.SNIPER_GUN
                || b == BlockType.PLASMA_GUN
                || b == BlockType.TRIPLE_GUN
                || b == BlockType.SHOTGUN;
    }

    public static int getNumberOf(List<Block> model, BlockType bt) {
        int c = 0;
        for (int i = 0; i < model.size(); i++) {
            Block b = model.get(i);
            if (b.getType() == bt) {
                c++;
            }
        }
        return c;
    }

    public static List<Block> getGuns(Spaceship s) {
        List<Block> guns = new ArrayList<>();
        for (int i = 0; i < s.getModel().size(); i++) {
            Block b = s.getModel().get(i);
            if (Tools.isGun(b.getType())) {
                boolean bx = true;
                for (Block block : guns) {
                    if (block.getType() == b.getType()) {
                        bx = false;
                        break;
                    }
                }
                if (bx) {
                    guns.add(b);
                }
            }
        }
        return guns;
    }

    public static void waitFor(EngineMode mode) {
        while (Game.engine.getEngineMode() != mode) {
            try {
                Thread.sleep(20);
            } catch (InterruptedException ex) {
                Logger.getLogger(MouseControler.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public static boolean isModelOk(Spaceship player) {
        boolean[] x = new boolean[3];
        for (Block b : player.getModel()) {
            if (b.getType() == BlockType.CPU_BLOCK) {
                x[0] = true;
            }
            if (b.getType() == BlockType.ENGINE_BLOCK) {
                x[1] = true;
            }
            if (Tools.isGun(b.getType())) {
                x[2] = true;
            }
        }
        return x[0] && x[1] && x[2];
    }

    static long l;

    public static void start() {
        l = System.nanoTime();
    }

    public static void end() {
        System.out.println(
                ((System.nanoTime() - l) / 1e6) + "ms"
        );
    }

}
