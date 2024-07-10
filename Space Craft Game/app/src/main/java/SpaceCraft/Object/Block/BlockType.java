/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object.Block;

import SpaceCraft.Game;
import SpaceCraft.Object.Bullet.BulletType;
//import java.io.Serializable;

/**
 *
 * @author Krcma
 */
public enum BlockType /*implements Serializable*/ {

    NORMAL(
            "Normal block",
            0,
            3,
            1.1f,
            0,
            0,
            3,
            10
    ),
    MEDIUM(
            "Medium block",
            1,
            6,
            1.5f,
            0,
            0,
            5,
            18
    ),
    HEAVY(
            "Heavy block",
            2,
            16,
            3.2f,
            0,
            0,
            10,
            35
    ),
    LASER_GUN(
            "Laser gun",
            3,
            3,
            2.0f,
            BulletType.SMALL.getDamage(),
            Game.RPS / 2,
            8,
            20
    ),
    DOUBLE_LASER_GUN(
            "Double laser gun",
            4,
            5,
            2.5f,
            BulletType.SMALL.getDamage(),
            Game.RPS / 2,
            15,
            38
    ),
    SNIPER_GUN(
            "Sniper gun",
            5,
            5,
            3.3f,
            BulletType.SNIPER.getDamage(),
            Game.RPS * 4,
            26,
            60
    ),
    PLASMA_GUN(
            "Plasma gun",
            6,
            5,
            3.5f,
            BulletType.PLASMA.getDamage(),
            Game.RPS * 3,
            20,
            60
    ),
    TRIPLE_GUN(
            "Triple gun",
            7,
            7,
            4.1f,
            BulletType.MEDIUM.getDamage(),
            (int) (Game.RPS / 2),
            32,
            85
    ),
    CPU_BLOCK(
            "CPU block",
            8,
            5,
            1.5f,
            0,
            0,
            2,
            0
    ),
    ENGINE_BLOCK(
            "Engine",
            9,
            4,
            1.2f,
            0,
            0,
            15,
            20
    ),
    HEALING_BLOCK(
            "Healing block",
            10,
            4,
            7.5f,
            0,
            0,
            90,
            200
    ),
    SHIELD_BLOCK(
            "Shield block",
            11,
            4,
            6.0f,
            0,
            0,
            90,
            180
    ),
    SHOTGUN(
            "Shotgun",
            12,
            8,
            4.8f,
            BulletType.MEDIUM.getDamage(),
            (int) (Game.RPS * 1.2),
            40,
            110
    );

    private final String name;
    private final int id;
    private final int life;
    private final float mass;
    private final int damage;
    private final int loadTime; //in RPS -> Time = loadTime/RPS;
    private final int complexity;
    private final int cost;

    private BlockType(String name, int id, int life, float mass, int damage, int loadTime, int complexity, int cost) {
        this.name = name;
        this.id = id;
        this.life = life;
        this.mass = mass;
        this.damage = damage;
        this.loadTime = loadTime;
        this.complexity = complexity;
        this.cost = cost;
    }

    public int getID() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public int getLife() {
        return this.life;
    }

    public float getMass() {
        return this.mass;
    }

    public int getComplexity() {
        return this.complexity;
    }

    public int getCost() {
        return this.cost;
    }

    /**
     *
     * @param id ID of block
     * @return BlockType
     */
    public static BlockType getBlockWithID(int id) {
        switch (id) {
            case 0:
                return BlockType.NORMAL;
            case 1:
                return BlockType.MEDIUM;
            case 2:
                return BlockType.HEAVY;
            case 3:
                return BlockType.LASER_GUN;
            case 4:
                return BlockType.DOUBLE_LASER_GUN;
            case 5:
                return BlockType.SNIPER_GUN;
            case 6:
                return BlockType.PLASMA_GUN;
            case 7:
                return BlockType.TRIPLE_GUN;
            case 8:
                return BlockType.CPU_BLOCK;
            case 9:
                return BlockType.ENGINE_BLOCK;
            case 10:
                return BlockType.HEALING_BLOCK;
            case 11:
                return BlockType.SHIELD_BLOCK;
            case 12:
                return BlockType.SHOTGUN;
        }
        return null;
    }

    public float getDamage() {
        if (this.damage == 0) {
            return 0f;
        } else {
            int n = 0;
            switch (this) {
                case DOUBLE_LASER_GUN:
                    n = 2;
                    break;
                case TRIPLE_GUN:
                    n = 3;
                    break;
                case SHOTGUN:
                    n = 5;
                    break;
                default:
                    n = 1;
                    break;
            }
            return (float) this.damage * ((float) Game.RPS / (float) this.loadTime) * n;
        }
    }

    public int getDamagePerHit() {
        return this.damage;
    }

    public int getLoadTime() {
        return this.loadTime;
    }

}
