/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Engine;

import SpaceCraft.FloatPoint;
import SpaceCraft.Game;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Object.Bullet.Bullet;
import SpaceCraft.Object.Bullet.BulletType;
import SpaceCraft.Object.PressureWave;
import SpaceCraft.Object.Spaceship.Spaceship;
import SpaceCraft.Tools;
import java.awt.Color;
import java.awt.Point;
import java.util.List;

/**
 *
 * @author Krcma
 */
public class Collisions {

    private final List<Spaceship> objects;
    private final List<Bullet> bullets;

    public Collisions(List<Spaceship> objects, List<Bullet> bullets) {
        this.objects = objects;
        this.bullets = bullets;
    }

    public void refresh() {
        //bullets
        for (int i = 0; i < this.bullets.size(); i++) {
            Bullet b = this.bullets.get(i);
            for (int j = 0; j < this.objects.size(); j++) {
                Spaceship p = this.objects.get(j);
                double r = Math.sqrt(
                        Math.pow(b.getPosition().x - p.getPosition().x, 2)
                        + Math.pow(b.getPosition().y - p.getPosition().y, 2)
                );
                if (r <= p.getSafeRange()) {
                    if (b.getOwner() != p) {
                        if (p.getAbsorbationBlocks().isEmpty()) {
                            //hit
                            bullet_objectCollisions(p, b);
                        } else {
                            //shield
                            this.bullets.remove(b);
                            int dmg = b.getDamage();
                            dmg = dmg > p.getAbsorbationBlocks().get(0).shield ? p.getAbsorbationBlocks().get(0).shield : dmg;
                            p.shieldAbsorbation(p.getAbsorbationBlocks().get(0), dmg);
                            Tools.showDropText(
                                    "-" + dmg,
                                    (int) b.getPosition().x,
                                    (int) b.getPosition().y,
                                    17,
                                    Color.CYAN
                            );
                            Tools.createExposion(b.getPosition(), 10, Color.CYAN, 5, Game.RPS / 2);
                        }
                    }
                }
            }
        }
        //blocks
        for (int j = 0; j < this.objects.size(); j++) {
            Spaceship o1 = this.objects.get(j);
            for (int i = 0; i < this.objects.size(); i++) {
                Spaceship o2 = this.objects.get(i);
                if (o1 != o2) {
                    double r = Math.sqrt(
                            Math.pow(o1.getPosition().x - o2.getPosition().x, 2)
                            + Math.pow(o1.getPosition().y - o2.getPosition().y, 2)
                    );
                    if (r <= Block.SIZE * 17) {
                        object_objectCollisions(o1, o2);
                    }
                }
            }
        }
    }

    private void bullet_objectCollisions(Spaceship o, Bullet b) {
        boolean blockKilled = false;
        int totalDMG = 0;
        for (int i = 0; i < o.getModel().size(); i++) {
            Block block = o.getModel().get(i);
            if (block.colision(new Point((int) b.getPosition().x, (int) b.getPosition().y))) {
                Block err = getBlockIn(
                        block.getOffset().x,
                        block.getOffset().y + (b.isFromDown() ? Block.SIZE : -Block.SIZE),
                        o.getModel()
                );
                block = err != null ? err : block;
                this.bullets.remove(b);
                //PLASMA########################
                if (b.getType() == BulletType.PLASMA) {
                    int[] xx = new int[]{0, 1, -1};
                    int[] yy = new int[]{-1, 0, 0};
                    for (int t = 0; t < 3; t++) {
                        for (int j = 0; j < o.getModel().size(); j++) {
                            Block f = o.getModel().get(j);
                            if (f.getOffset().x == block.getOffset().x + xx[t] * Block.SIZE
                                    && f.getOffset().y == block.getOffset().y + yy[t] * Block.SIZE) {
                                int dmg = 1 + (int) (Math.random() * 2);
                                dmg = dmg > f.getLife() ? f.getLife() : dmg;
                                totalDMG += dmg;
                                f.setLife(f.getLife() - dmg);
                                Tools.showDropText(
                                        "-" + dmg,
                                        (int) (f.getOffset().x + o.getPosition().x),
                                        (int) (f.getOffset().y + o.getPosition().y),
                                        17,
                                        Color.RED
                                );
                                if (f.getLife() <= 0) {
                                    o.removeBlock(f);
                                    blockBreak(block, new FloatPoint(
                                            o.getPosition().x + f.getOffset().x + Block.SIZE / 2,
                                            o.getPosition().y + f.getOffset().y + Block.SIZE / 2
                                    ));
                                    blockKilled = true;
                                }
                            }
                        }
                    }
                }
                //PLASMA########################
                int dmg = b.getDamage();
                dmg = dmg > block.getLife() ? block.getLife() : dmg;
                totalDMG += dmg;
                Tools.showDropText(
                        "-" + dmg,
                        (int) b.getPosition().x,
                        (int) b.getPosition().y,
                        15,
                        Color.RED
                );
                block.setLife(block.getLife() - b.getDamage());
                Tools.createExposion(b.getPosition(), 4, block.getColor(), 3, Game.RPS / 2);
                if (block.getLife() <= 0) {
                    o.removeBlock(block);
                    blockBreak(block, new FloatPoint(
                            o.getPosition().x + block.getOffset().x + Block.SIZE / 2,
                            o.getPosition().y + block.getOffset().y + Block.SIZE / 2
                    ));
                    blockKilled = true;
                }
                Game.engine.playSound("hit");
                break;
            }
        }
        if (blockKilled) {
            if (o.getModel().isEmpty()) {
                this.objects.remove(o);
                if (b.getOwner() == Game.gameManager.getSave().getPlayer()) {
                    stats();
                }
            } else {
                totalDMG += breakUp(o, (int) b.getPosition().x, (int) b.getPosition().y);
            }
        }
        if (b.getOwner() == Game.gameManager.getSave().getPlayer()) {
            Game.gameManager.getSave().getBattleStats().damage += totalDMG;
        }
    }

    private Block getBlockIn(int x, int y, List<Block> model) {
        for (int i = 0; i < model.size(); i++) {
            Block block = model.get(i);
            if (block.getOffset().x == x && block.getOffset().y == y) {
                return block;
            }
        }
        return null;
    }

    private void object_objectCollisions(Spaceship o1, Spaceship o2) {
        boolean blockKilled = false;
        int[] xy = new int[4];
        for (int i = 0; i < o1.getModel().size(); i++) {
            Block b1 = o1.getModel().get(i);
            for (int j = 0; j < o2.getModel().size(); j++) {
                Block b2 = o2.getModel().get(j);
                //########################################
                FloatPoint f1 = new FloatPoint(
                        b1.getOffset().x + o1.getPosition().x,
                        b1.getOffset().y + o1.getPosition().y
                );
                FloatPoint f2 = new FloatPoint(
                        b2.getOffset().x + o2.getPosition().x,
                        b2.getOffset().y + o2.getPosition().y
                );
                if (f1.x >= f2.x && f1.x <= f2.x + Block.SIZE
                        && f1.y >= f2.y && f1.y <= f2.y + Block.SIZE) {
                    xy[0] = (int) f1.x;
                    xy[1] = (int) f1.y;
                    xy[2] = (int) f2.x;
                    xy[3] = (int) f2.y;
                    o1.removeBlock(b1);
                    o2.removeBlock(b2);
                    Game.engine.playSound("hit");
                    Game.engine.playSound("hit");
                    Tools.showDropText(
                            "-" + b1.getLife(), (int) f1.x, (int) f1.y, 17, Color.RED
                    );
                    Tools.showDropText(
                            "-" + b2.getLife(), (int) f2.x, (int) f2.y, 17, Color.RED
                    );
                    blockKilled = true;
                    blockBreak(b1, f1);
                    blockBreak(b2, f2);
                }
                //########################################
            }
        }
        if (blockKilled) {
            if (o1.getModel().isEmpty()) {
                this.objects.remove(o1);
                if (o2 == Game.gameManager.getSave().getPlayer()) {
                    stats();
                }
            } else {
                breakUp(o1, xy[0], xy[1]);
            }
            if (o2.getModel().isEmpty()) {
                this.objects.remove(o1);
                if (o1 == Game.gameManager.getSave().getPlayer()) {
                    stats();
                }
            } else {
                breakUp(o2, xy[2], xy[3]);
            }
        }
    }

    private int breakUp(Spaceship o, int x, int y) {
        boolean cpu = false;
        for (int i = 0; i < o.getModel().size(); i++) {
            Block b = o.getModel().get(i);
            if (b.getType() == BlockType.CPU_BLOCK) {
                cpu = true;
                break;
            }
        }
        List<Block> db = cpu ? Tools.spaceshipBreakupTest(o.getModel()) : o.getModel();
        if (db.isEmpty()) {
            return 0;
        }
        int life = 0;
        int rmv = 0;
        while ((db.size() - rmv > 0 && cpu) || (o.getModel().size() > 0 && !cpu)) {
            for (int i = 0; i < db.size(); i++) {
                Block b = db.get(i);
                if (o.removeBlock(b)) {
                    rmv++;
                    life += b.getLife();
                    Tools.createExposion(
                            new FloatPoint(
                                    o.getPosition().x + b.getOffset().x + Block.SIZE / 2,
                                    o.getPosition().y + b.getOffset().y + Block.SIZE / 2
                            ),
                            15,
                            b.getColor(),
                            4,
                            Game.RPS / 2
                    );
                }
            }
        }
        Tools.showDropText(
                "-" + life, x, y, 29, Color.MAGENTA.darker()
        );
        //object destroy
        if (o.getModel().isEmpty()) {
            this.objects.remove(o);
            Game.engine.waves.add(
                    new PressureWave(
                            (int) o.getPosition().x,
                            (int) o.getPosition().y,
                            Game.RPS / 2,
                            (int) (Math.random() * 4 + 28)
                    )
            );
            Tools.createExposion(
                    new FloatPoint(
                            o.getPosition().x,
                            o.getPosition().y
                    ),
                    90,
                    new Color(215, 196, 80),
                    9,
                    Game.RPS
            );
            Game.engine.screen.shake(Game.RPS, o.getPosition());
            if (o != Game.gameManager.getSave().getPlayer()) {
                stats();
            }
            Game.engine.playSound("explode");
        }
        return life;
    }

    private void blockBreak(Block b, FloatPoint p) {
        Tools.createExposion(
                new FloatPoint(
                        p.x + Block.SIZE / 2,
                        p.y + Block.SIZE / 2
                ),
                15,
                b.getColor(),
                4,
                Game.RPS / 2
        );
    }

    private void stats() {
        Game.gameManager.getSave().getBattleStats().coins += (int) (5f * (1f + Game.gameManager.getSave().getLevel() / 5f));
        Game.gameManager.getSave().getBattleStats().kills++;
    }

}
