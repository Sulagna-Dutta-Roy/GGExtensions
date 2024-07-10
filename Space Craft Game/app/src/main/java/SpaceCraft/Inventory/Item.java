/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Inventory;

import SpaceCraft.Object.Block.BlockType;
import java.io.Serializable;

/**
 *
 * @author Krcma
 */
public class Item implements Serializable {

    private final BlockType block;
    public int number;

    public Item(BlockType block, int number){
        this.number = number;
        this.block = block;
    }
    
    public BlockType getBlockType(){
        return this.block;
    }
    
}
