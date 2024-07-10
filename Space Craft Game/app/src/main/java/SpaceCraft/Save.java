/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Inventory.Inventory;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Object.Spaceship.Spaceship;
import java.io.Serializable;
import java.util.List;

/**
 *
 * @author Krcma
 */
public class Save implements Serializable {
    
    private final String GAMEDIR;
    
    private final Inventory inv;
    
    private final Spaceship player;

    private int deaths = 0;
    
    private int total_kills = 0;
    
    private int total_time = 0;
    
    private int caused_damage = 0;
    
    private int received_damage = 0;
    
    private int level = 0;
    
    public boolean inGame = false;
    
    public BlockType gun;
    
    private final BattleStats battleStats = new BattleStats();
    
    public Save(String name, String gamedir) {
        this.player = new Spaceship(name, new FloatPoint(0, 0), true);
        this.inv = new Inventory();
        this.gun = BlockType.LASER_GUN;
        //default blocks
        this.inv.addBlock(
                BlockType.CPU_BLOCK,
                1
        );
        this.inv.addBlock(
                BlockType.NORMAL,
                8
        );
        this.inv.addBlock(
                BlockType.LASER_GUN,
                2
        );
        this.inv.addBlock(
                BlockType.ENGINE_BLOCK,
                1
        );
        this.GAMEDIR = gamedir;
    }
    
    public void rebuilPlayer() {
        this.player.buildModel(
                Tools.copyModel(this.player.getModelCopy())
        );
    }
    
    public BattleStats getBattleStats() {
        return this.battleStats;
    }
    
    public String getGameDir() {
        return this.GAMEDIR;
    }
    
    public Inventory getInventory() {
        return this.inv;
    }
    
    public Spaceship getPlayer() {
        return this.player;
    }
    
    public void addKills(int number) {
        this.total_kills += number;
    }
    
    public void addDeaths(int number) {
        this.deaths += number;
    }
    
    public void addTime(int seconds) {
        this.total_time += seconds;
    }
    
    public void addCausedDamage(int dmg) {
        this.caused_damage += dmg;
    }
    
    public void addReceivedDamage(int dmg) {
        this.received_damage += dmg;
    }
    
    public int getKills() {
        return this.total_kills;
    }
    
    public int getTotalTime() {
        return this.total_time;
    }
    
    public int getDeaths() {
        return this.deaths;
    }
    
    public int getCausedDamage() {
        return this.caused_damage;
    }
    
    public int getReceivedDamage() {
        return this.received_damage;
    }
    
    public int getLevel() {
        return this.level;
    }
    
    public void setLevel(int level) {
        this.level = level;
    }
    
    public void nextLevel() {
        this.level++;
    }
    
    public List<Block> getPlayerGuns() {
        return this.player.getGuns();
    }
    
    public class BattleStats implements Serializable {
        
        public int damage = 0;
        public int kills = 0;
        public int coins = 0;
        public int deaths = 0;
        
        public void clear() {
            this.damage = 0;
            this.kills = 0;
            this.coins = 0;
            this.deaths = 0;
        }
        
        public void writeToGlobal() {
            caused_damage += this.damage;
            int x = 0;
            for(Block b :player.getModelCopy()){
                x += b.getLife();
            }
            received_damage += x - player.getTotalLife();
            total_kills += this.kills;
            inv.addCoins(this.coins);
            addDeaths(this.deaths);
        }
    }
    
}
