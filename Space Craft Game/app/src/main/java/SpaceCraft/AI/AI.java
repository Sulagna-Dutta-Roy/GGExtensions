/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.AI;

import SpaceCraft.Game;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Object.Spaceship.Spaceship;
import SpaceCraft.Tools;
import java.awt.Point;
import java.io.Serializable;

/**
 *
 * @author Krcma
 */
public class AI implements Serializable {

    //shooting
    private int lg = 0;
    private BlockType lastGun = null;
    //moving
    private int m = 0, ml = 0;
    private Point p = new Point();

    private final Spaceship s;

    public AI(Spaceship s) {
        this.s = s;
    }

    public Object[] refresh() {
        //x,y,gun,shoot
        Object[] out = new Object[]{-1, -1, BlockType.LASER_GUN, false};
        //gun
        for (int i = 0; i < this.s.getModel().size(); i++) {
            Block b = this.s.getModel().get(i);
            if (Tools.isGun(b.getType())) {
                if (this.lg > Game.RPS) {
                    this.lastGun = this.s.getGuns().get(
                            (int) (Math.random() * this.s.getGuns().size())
                    ).getType();
                    this.lg = 0;
                } else {
                    this.lg++;
                }
                if (this.lastGun == b.getType()) {
                    Point p1 = new Point(
                            b.getOffset().x + (int) this.s.getPosition().x + Block.SIZE / 2,
                            b.getOffset().y + (int) this.s.getPosition().y + Block.SIZE / 2
                    );
                    Point player = Game.gameManager.getSave().getPlayer().getPosition().getPoint();
                    int gl = 1;
                    switch (b.getType()) {
                        case LASER_GUN:
                            gl = this.s.gunLoading[0];
                            break;
                        case DOUBLE_LASER_GUN:
                            gl = this.s.gunLoading[1];
                            break;
                        case PLASMA_GUN:
                            gl = this.s.gunLoading[2];
                            break;
                        case SNIPER_GUN:
                            gl = this.s.gunLoading[3];
                            break;
                        case TRIPLE_GUN:
                            gl = this.s.gunLoading[4];
                            break;
                        case SHOTGUN:
                            gl = this.s.gunLoading[5];
                            break;
                        default:
                            break;
                    }
                    if (gl <= 0) {
                        if (shootTest(p1, player, b)) {
                            boolean en = true;
                            for (int k = 0; k < Game.engine.objects.size(); k++) {
                                Spaceship o = Game.engine.objects.get(k);
                                if (o != this.s && o != Game.gameManager.getSave().getPlayer()) {
                                    if (shootTest(p1, o.getPosition().getPoint(), b)) {
                                        en = false;
                                        break;
                                    }
                                }
                            }
                            if (en) {
                                out[2] = b.getType();
                                out[3] = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        //move
        if (this.m >= this.ml) {
            this.m = 0;
            this.ml = (int) ((Math.random() * 1.5f + 1f) * Game.RPS);
            if (this.s.getGuns().size() > 0) {
                this.p.x = (int) (Game.gameManager.getSave().getPlayer().getPosition().x + (Math.random() * 4 - 2) * Block.SIZE);
                this.p.y = (int) ((Math.random() * 0.5f + 0.1f) * Game.GAMESIZE.height);
                this.p.y = (int) Math.min(this.p.y, Game.gameManager.getSave().getPlayer().getPosition().y);
            } else {
                this.p.x = (int) Game.gameManager.getSave().getPlayer().getPosition().x;
                this.p.y = (int) Game.gameManager.getSave().getPlayer().getPosition().y;
            }
        } else {
            this.m++;
        }
        for (int i = 0; i < Game.engine.objects.size(); i++) {
            Spaceship o = Game.engine.objects.get(i);
            if (this.s != o) {
                if (o != Game.gameManager.getSave().getPlayer()) {
                    double d = Math.sqrt(Math.pow(o.getPosition().x - this.s.getPosition().x, 2)
                            + Math.pow(o.getPosition().y - this.s.getPosition().y, 2));
                    if (d < 17 * Block.SIZE) {
                        this.p.x = (int) (2 * this.s.getPosition().x - o.getPosition().x);
                        this.p.y = (int) (2 * this.s.getPosition().y - o.getPosition().y);
                    }
                }
            }
        }
        out[0] = this.p.x;
        out[1] = this.p.y;
        return out;
    }

    private boolean shootTest(Point p1, Point p2, Block b) {
        return Math.abs(p1.x - p2.x) < (b.getType() == BlockType.TRIPLE_GUN ? Block.SIZE * 15 : Block.SIZE * 7) && p2.y > p1.y;
    }

}
