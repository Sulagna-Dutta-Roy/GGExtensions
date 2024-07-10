/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Inventory;

import SpaceCraft.Object.Block.BlockType;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Krcma
 */
public class Inventory implements Serializable {

    private int coins;

    private final List<Item> items;

    public Inventory() {
        this.items = new ArrayList<>();
        this.coins = 0;
    }

    public int getCoins() {
        return this.coins;
    }

    public void addCoins(int coins) {
        this.coins += coins;
    }

    public int getNumberOfBlocks(BlockType block) {
        for (Item i : this.items) {
            if (i.getBlockType() == block) {
                return i.number;
            }
        }
        return 0;
    }

    /**
     * Get block from inventory
     *
     * @param block Block type
     * @param number Number of blocks
     * @return
     */
    public boolean getBlock(BlockType block, int number) {
        for (Item i : this.items) {
            if (i.getBlockType() == block) {
                if (i.number - number >= 0) {
                    i.number -= number;
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Add block to inventory
     *
     * @param block Block type
     * @param number Number of blocks
     */
    public void addBlock(BlockType block, int number) {
        for (Item i : this.items) {
            if (i.getBlockType() == block) {
                i.number += number;
                return;
            }
        }
        this.items.add(new Item(block, number));
    }

    public void buyBlock(BlockType bt) {
        int cost = bt.getCost();
        if (this.coins - cost >= 0) {
            this.coins -= cost;
            this.addBlock(bt, 1);
        }
    }

}
