/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object.Bullet;


/**
 *
 * @author Krcma
 */
public enum BulletType {

    SMALL(1,8,6),
    PLASMA(6,5,10),
    SNIPER(14,13,4),
    MEDIUM(2,8,7);

    private final int damage, size, speed;

    BulletType(int damage, int speed, int size) {
        this.damage = damage;
        this.speed = speed;
        this.size = size;
    }

    public int getDamage() {
        return this.damage;
    }

    public int getSpeed() {
        return this.speed;
    }
    
    public int getSize(){
        return this.size;
    }

}
