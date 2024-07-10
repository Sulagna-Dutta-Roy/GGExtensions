/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object.Spaceship;

import SpaceCraft.AI.AI;
import SpaceCraft.FloatPoint;
import SpaceCraft.Game;
import SpaceCraft.Object.Block.ShieldBlock;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Object.Bullet.Bullet;
import SpaceCraft.Object.Bullet.BulletType;
import SpaceCraft.Object.Particle;
import SpaceCraft.Tools;
import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Point;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Krcma
 */
public class Spaceship implements Serializable {

    private final String name;

    private final List<Block> model, model_copy;

    private final boolean fromDown;

    private FloatPoint position;

    private final MoveControler moveControler;

    public final int[] gunLoading;

    private final AI ai;

    private int safeRange;

    public boolean INCOMING = false;

    private int engines, healings;
    private List<Block> guns;
    private List<ShieldBlock> abs_blocks;

    public Spaceship(String name, FloatPoint position, boolean fromDown) {
        this.model = new ArrayList<>();
        this.model_copy = new ArrayList<>();
        this.name = name;
        this.fromDown = fromDown;
        this.position = position;
        this.moveControler = new MoveControler(this);
        this.gunLoading = new int[6];
        this.ai = new AI(this);
        this.guns = new ArrayList<>();
        this.abs_blocks = new ArrayList<>();
    }

    public List<ShieldBlock> getAbsorbationBlocks() {
        return this.abs_blocks;
    }

    public List<Block> getGuns() {
        return this.guns;
    }

    public float getAccelerationX() {
        return this.moveControler.xAC;
    }

    public float getAccelerationY() {
        return this.moveControler.yAC;
    }

    public int getGunLoadTime(BlockType bt) {
        switch (bt) {
            case LASER_GUN:
                return this.gunLoading[0];
            case DOUBLE_LASER_GUN:
                return this.gunLoading[1];
            case PLASMA_GUN:
                return this.gunLoading[2];
            case SNIPER_GUN:
                return this.gunLoading[3];
            case TRIPLE_GUN:
                return this.gunLoading[4];
            case SHOTGUN:
                return this.gunLoading[5];
        }
        return 0;
    }

    public AI getAI() {
        return this.ai;
    }

    public int getNumberOfEngines() {
        return this.engines;
    }

    public boolean removeBlock(Block b) {
        boolean x = this.model.remove(b);
        if (x) {
            //refresh blocks
            refreshBlocks();
        }
        return x;
    }

    public void buildModel(List<Block> model) {
        this.model.clear();
        this.model_copy.clear();
        //model
        model.forEach((block) -> {
            try {
                Block b = block.clone();
                b.setOwner(this);
                this.model.add(b);
            } catch (CloneNotSupportedException ex) {
                Logger.getLogger(Spaceship.class.getName()).log(Level.SEVERE, null, ex);
            }
        });
        //copy
        model.forEach((block) -> {
            try {
                Block b = block.clone();
                b.setOwner(this);
                this.model_copy.add(b);
            } catch (CloneNotSupportedException ex) {
                Logger.getLogger(Spaceship.class.getName()).log(Level.SEVERE, null, ex);
            }
        });
        //refresh blocks
        refreshBlocks();
    }

    public List<Block> getModel() {
        return this.model;
    }

    public List<Block> getModelCopy() {
        return this.model_copy;
    }

    public FloatPoint getPosition() {
        return this.position;
    }

    public void render(Graphics2D g2, int x_off, int y_off) {
        //lower
        for (int i = 0; i < this.model.size(); i++) {
            Block block = this.model.get(i);
            block.render(g2, this.fromDown, false, x_off, y_off);
        }
        //upper
        for (int i = 0; i < this.model.size(); i++) {
            Block block = this.model.get(i);
            block.render(g2, this.fromDown, true, x_off, y_off);
        }
        //name
        if (Game.gameManager != null) {
            if (Game.gameManager.getSave().getPlayer() != this) {
                g2.setFont(new Font("Tahoma", Font.BOLD, 25));
                g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.4f));
                g2.setColor(Color.RED);
                g2.drawString(
                        this.name,
                        x_off + this.position.x - g2.getFontMetrics().stringWidth(this.name) / 2,
                        y_off + this.position.y - this.safeRange
                );
                g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));
            }
        }
    }

    public void refresh(Point goTo) {
        if (!this.INCOMING) {
            //move
            this.moveControler.refresh(goTo);
            this.position.x += this.moveControler.xAC;
            this.position.y += this.moveControler.yAC;
            if (this.position.x < 0) {
                this.position.x = 0;
            }
            if (this.position.y < 0) {
                this.position.y = 0;
            }
            if (this.position.x > Game.GAMESIZE.width) {
                this.position.x = Game.GAMESIZE.width;
            }
            if (this.position.y > Game.GAMESIZE.height) {
                this.position.y = Game.GAMESIZE.height;
            }
        } else {
            this.moveControler.refresh(new Point((int) this.position.x, 0));
            this.position.y += this.moveControler.yAC;
            if (this.position.y < Game.GAMESIZE.height) {
                this.INCOMING = false;
            }
        }
        //shooting
        for (int i = 0; i < this.gunLoading.length; i++) {
            if (this.gunLoading[i] > 0) {
                this.gunLoading[i]--;
            }
        }
        //refresh
        refresh_sub();
    }

    public void refreshAI() {
        if (!this.INCOMING) {
            //AI
            Object[] commands = this.ai.refresh();
            //move
            if ((int) commands[0] >= 0 && (int) commands[1] >= 0) {
                this.moveControler.refresh(new Point((int) commands[0], (int) commands[1]));
            } else {
                this.moveControler.refresh(new Point((int) this.position.x, (int) this.position.y));
            }
            this.position.x += this.moveControler.xAC;
            this.position.y += this.moveControler.yAC;
            if (this.position.x < 0) {
                this.position.x = 0;
            }
            if (this.position.y < 0) {
                this.position.y = 0;
            }
            if (this.position.x > Game.GAMESIZE.width) {
                this.position.x = Game.GAMESIZE.width;
            }
            if (this.position.y > Game.GAMESIZE.height) {
                this.position.y = Game.GAMESIZE.height;
            }
            //shooting
            if ((boolean) commands[3]) {
                this.shoot((BlockType) commands[2]);
            }
        } else {
            this.moveControler.refresh(new Point((int) this.position.x, 1000));
            this.position.y += this.moveControler.yAC;
            if (this.position.y > 0) {
                this.INCOMING = false;
            }
        }
        //shooting
        for (int i = 0; i < this.gunLoading.length; i++) {
            if (this.gunLoading[i] > 0) {
                this.gunLoading[i]--;
            }
        }
        //refresh
        refresh_sub();
    }

    public String getName() {
        return this.name;
    }

    public int getTotalLife() {
        int total = 0;
        total = this.model.stream().map((block) -> block.getLife()).reduce(total, Integer::sum);
        return total;
    }

    public void setPosition(FloatPoint position) {
        this.position = position;
    }

    public float getTotalMass() {
        float total = 0f;
        total = this.model.stream().map((block) -> block.getMass()).reduce(total, Float::sum);
        return total;
    }

    public void shoot(BlockType bt) {
        int gun = 0;
        float d = this.fromDown ? -Block.SIZE / 2 : Block.SIZE * 1.5f;
        for (int i = 0; i < this.model.size(); i++) {
            Block b = this.model.get(i);
            if (bt == b.getType()) {
                switch (bt) {
                    case LASER_GUN:
                        if (this.gunLoading[0] > 0) {
                            return;
                        }
                        Game.engine.bullets.add(
                                new Bullet(
                                        new FloatPoint(
                                                b.getOffset().x + this.position.x + Block.SIZE / 2,
                                                b.getOffset().y + this.position.y + d
                                        ),
                                        BulletType.SMALL,
                                        b.getColor().darker(),
                                        0,
                                        this.fromDown,
                                        this
                                )
                        );
                        Tools.shootEffect(
                                new FloatPoint(
                                        b.getOffset().x + this.position.x + Block.SIZE / 2,
                                        b.getOffset().y + this.position.y + d * 0.8f
                                ),
                                b.getColor().brighter(),
                                5,
                                this.fromDown,
                                0f
                        );
                        gun = 1;
                        break;
                    case DOUBLE_LASER_GUN:
                        if (this.gunLoading[1] > 0) {
                            return;
                        }
                        for (int j = 0; j <= 1; j++) {
                            Game.engine.bullets.add(
                                    new Bullet(
                                            new FloatPoint(
                                                    b.getOffset().x + this.position.x + Block.SIZE * (0.3f + j * 0.4f),
                                                    b.getOffset().y + this.position.y + d
                                            ),
                                            BulletType.SMALL,
                                            b.getColor().darker(),
                                            0,
                                            this.fromDown,
                                            this
                                    )
                            );
                        }
                        for (int j = 0; j <= 1; j++) {
                            Tools.shootEffect(
                                    new FloatPoint(
                                            b.getOffset().x + this.position.x + Block.SIZE * (0.3f + 0.4f * j),
                                            b.getOffset().y + this.position.y + d * 0.8f
                                    ),
                                    b.getColor().brighter(),
                                    4,
                                    this.fromDown,
                                    0f
                            );
                        }
                        gun = 2;
                        break;
                    case PLASMA_GUN:
                        if (this.gunLoading[2] > 0) {
                            return;
                        }
                        Game.engine.bullets.add(
                                new Bullet(
                                        new FloatPoint(
                                                b.getOffset().x + this.position.x + Block.SIZE / 2,
                                                b.getOffset().y + this.position.y + d
                                        ),
                                        BulletType.PLASMA,
                                        b.getColor().darker(),
                                        0,
                                        this.fromDown,
                                        this
                                )
                        );
                        Tools.shootEffect(
                                new FloatPoint(
                                        b.getOffset().x + this.position.x + Block.SIZE / 2,
                                        b.getOffset().y + this.position.y + d * 0.8f
                                ),
                                b.getColor().brighter(),
                                15,
                                this.fromDown,
                                0f
                        );
                        gun = 3;
                        break;
                    case SNIPER_GUN:
                        if (this.gunLoading[3] > 0) {
                            return;
                        }
                        Game.engine.bullets.add(
                                new Bullet(
                                        new FloatPoint(
                                                b.getOffset().x + this.position.x + Block.SIZE * 0.5f,
                                                b.getOffset().y + this.position.y + d
                                        ),
                                        BulletType.SNIPER,
                                        b.getColor().darker(),
                                        0,
                                        this.fromDown,
                                        this
                                )
                        );
                        Tools.shootEffect(
                                new FloatPoint(
                                        b.getOffset().x + this.position.x + Block.SIZE / 2,
                                        b.getOffset().y + this.position.y + d * 0.8f
                                ),
                                b.getColor().brighter(),
                                12,
                                this.fromDown,
                                0f
                        );
                        gun = 4;
                        break;
                    case TRIPLE_GUN:
                        if (this.gunLoading[4] > 0) {
                            return;
                        }
                        for (int j = -1; j <= 1; j++) {
                            Game.engine.bullets.add(
                                    new Bullet(
                                            new FloatPoint(
                                                    b.getOffset().x + this.position.x + Block.SIZE * -0.2f + j * 0.7f,
                                                    b.getOffset().y + this.position.y + d
                                            ),
                                            BulletType.MEDIUM,
                                            b.getColor().darker(),
                                            BulletType.MEDIUM.getSpeed() * j,
                                            this.fromDown,
                                            this
                                    )
                            );
                        }
                        for (int j = -1; j <= 1; j++) {
                            Tools.shootEffect(
                                    new FloatPoint(
                                            b.getOffset().x + this.position.x + Block.SIZE * (0.5f + j * 0.5f),
                                            b.getOffset().y + this.position.y + d * 0.7f
                                    ),
                                    b.getColor().brighter(),
                                    7,
                                    this.fromDown,
                                    j * 4f
                            );
                        }
                        gun = 5;
                        break;
                    case SHOTGUN:
                        if (this.gunLoading[5] > 0) {
                            return;
                        }
                        for (int j = -2; j <= 2; j++) {
                            Game.engine.bullets.add(
                                    new Bullet(
                                            new FloatPoint(
                                                    b.getOffset().x + this.position.x + Block.SIZE * -0.2f + j * 0.7f,
                                                    b.getOffset().y + this.position.y + d
                                            ),
                                            BulletType.MEDIUM,
                                            b.getColor().darker(),
                                            j,
                                            this.fromDown,
                                            this
                                    )
                            );
                        }
                        Tools.shootEffect(
                                new FloatPoint(
                                        b.getOffset().x + this.position.x + Block.SIZE * 0.5f,
                                        b.getOffset().y + this.position.y + d * 0.7f
                                ),
                                b.getColor().brighter(),
                                15,
                                this.fromDown,
                                0f
                        );
                        gun = 6;
                        break;
                }
            }
        }
        if (gun - 1 >= 0) {
            this.gunLoading[gun - 1] = bt.getLoadTime();
            switch (gun) {
                case 6:
                    Game.engine.playSound("shoot_sh");
                    break;
                case 4:
                    Game.engine.playSound("shoot_s");
                    break;
                case 3:
                    Game.engine.playSound("shoot_p");
                    break;
                default:
                    Game.engine.playSound("shoot");
                    break;
            }
        }
    }

    public int getSafeRange() {
        return this.safeRange;
    }

    private void refreshBlocks() {
        this.engines = Tools.getNumberOf(this.model, BlockType.ENGINE_BLOCK);
        this.healings = Tools.getNumberOf(this.model, BlockType.HEALING_BLOCK);
        this.guns = Tools.getGuns(this);
        this.abs_blocks.clear();
        this.safeRange = 0;
        for (int i = 0; i < this.model.size(); i++) {
            Block x = this.model.get(i);
            this.safeRange = (int) Math.max(
                    this.safeRange, Math.sqrt(Math.pow(x.getOffset().x, 2) + Math.pow(x.getOffset().y, 2))
            );
            if (x.getType() == BlockType.SHIELD_BLOCK) {
                if (((ShieldBlock) x).shield > 0) {
                    this.abs_blocks.add((ShieldBlock) x);
                }
            }
        }
        this.safeRange = this.safeRange == 0 ? Block.SIZE * 14 : this.safeRange + Block.SIZE;
    }

    private int e = 0, eN = 8;
    private int h = 0;

    private void refresh_sub() {
        //engine
        if (this.e > this.eN) {
            this.e = 0;
            this.eN = (int) (Math.random() * 6 + 7);
            for (int i = 0; i < this.model.size(); i++) {
                Block b = this.model.get(i);
                if (b.getType() == BlockType.ENGINE_BLOCK) {
                    int rnd = (int) (Math.random() * 2 + 2);
                    int c = (int) (Math.random() * 50 + 110);
                    for (int j = 0; j < rnd; j++) {
                        Game.engine.particles.add(
                                new Particle(
                                        new FloatPoint(
                                                b.getOffset().x + this.position.x + (int) (Math.random() * Block.SIZE),
                                                b.getOffset().y + this.position.y + (int) (Math.random() * Block.SIZE)
                                        ),
                                        new Color(c, c, c),
                                        Game.RPS,
                                        (int) (Math.random() * 2 + 3),
                                        (float) (Math.random() * 0.3f - 0.15f),
                                        (float) (Math.random() * 0.3f - 0.15f)
                                )
                        );
                    }
                }
            }
        } else {
            this.e++;
        }
        //healing
        if (this.healings > 0) {
            if (this.h == Game.RPS / this.healings) {
                this.h = 0;
                for (int i = 0; i < this.model.size(); i++) {
                    Block b = this.model.get(i);
                    if (b.getLife() < b.getType().getLife()) {
                        b.setLife(b.getLife() + 1);
                        Tools.showDropText(
                                "+1",
                                (int) (b.getOffset().x + this.getPosition().x),
                                (int) (b.getOffset().y + this.getPosition().y),
                                17,
                                Color.GREEN
                        );
                        return;
                    }
                }
                if (this.model.size() == this.model_copy.size()) {
                    return;
                }
                try {
                    for (int i = 0; i < this.model_copy.size(); i++) {
                        Block z = this.model_copy.get(i);
                        boolean ok = true;
                        for (int j = 0; j < this.model.size(); j++) {
                            Block b = this.model.get(j);
                            if (z.getOffset() == b.getOffset()) {
                                ok = false;
                            }
                        }
                        if (ok) {
                            z = z.clone();
                            if (z.getType() == BlockType.SHIELD_BLOCK) {
                                ((ShieldBlock) z).shield = 0;
                            }
                            z.setLife(1);
                            z.setOwner(this);
                            this.model.add(z);
                            Tools.showDropText(
                                    "+1",
                                    (int) (z.getOffset().x + this.getPosition().x),
                                    (int) (z.getOffset().y + this.getPosition().y),
                                    17,
                                    Color.GREEN
                            );
                            return;
                        }
                    }
                } catch (CloneNotSupportedException ex) {
                    Logger.getLogger(Spaceship.class.getName()).log(Level.SEVERE, null, ex);
                }
            } else {
                this.h++;
            }
        }
    }

    public void shieldAbsorbation(ShieldBlock ab, int dmg) {
        ab.shield -= dmg;
        if (ab.shield <= 0) {
            this.abs_blocks.remove(ab);
        }
    }

}
