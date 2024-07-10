/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object.Block;

import java.awt.Color;
import java.awt.Point;

/**
 *
 * @author Krcma
 */
public class BlockBuilder {

    public static Block getBlock(Point offset_position, Color color, BlockType type) {
        switch (type) {
            case NORMAL:
                return new NormalBlock(offset_position, color);
            case MEDIUM:
                return new MediumBlock(offset_position, color);
            case HEAVY:
                return new HeavyBlock(offset_position, color);
            case LASER_GUN:
                return new LaserGunBlock(offset_position, color);
            case PLASMA_GUN:
                return new PlasmaGunBlock(offset_position, color);
            case DOUBLE_LASER_GUN:
                return new DoubleLaserGunBlock(offset_position, color);
            case TRIPLE_GUN:
                return new TripleGunBlock(offset_position, color);
            case SHIELD_BLOCK:
                return new ShieldBlock(offset_position, color);
            case CPU_BLOCK:
                return new CPUBlock(offset_position, color);
            case ENGINE_BLOCK:
                return new EngineBlock(offset_position, color);
            case HEALING_BLOCK:
                return new HealingBlock(offset_position, color);
            case SNIPER_GUN:
                return new SniperGunBlock(offset_position, color);
            case SHOTGUN:
                return new ShotgunBlock(offset_position, color);
        }
        return null;
    }

}
