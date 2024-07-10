/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockBuilder;
import SpaceCraft.Object.Block.BlockType;
import java.awt.Color;
import java.awt.Point;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Krcma
 */
public class ModelIO {

    public static List<Block> read(File file) {
        List<Block> model = new ArrayList<>();
        try {
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line;
            while ((line = reader.readLine()) != null) {
                String[] arr = line.split(";");
                String[] sa = arr[1].split(",");
                Point p = new Point(Integer.parseInt(sa[0]), Integer.parseInt(sa[1]));
                sa = arr[2].split(",");
                Color c = new Color(Integer.parseInt(sa[0]), Integer.parseInt(sa[1]), Integer.parseInt(sa[2]));
                model.add(
                        BlockBuilder.getBlock(
                                p,
                                c,
                                BlockType.getBlockWithID(Integer.parseInt(arr[0]))
                        )
                );
            }
            reader.close();
        } catch (IOException ex) {
            Logger.getLogger(ModelIO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return model;
    }

    public static void write(List<Block> model, File file) {
        try {
            BufferedWriter writer = new BufferedWriter(new FileWriter(file));
            for (Block b : model) {
                writer.write(
                        b.getType().getID() + ";"
                        + b.getOffset().x + "," + b.getOffset().y + ";"
                        + b.getColor().getRed() + "," + b.getColor().getGreen() + "," + b.getColor().getBlue()
                );
                writer.newLine();
            }
            writer.flush();
            writer.close();
        } catch (IOException ex) {
            Logger.getLogger(ModelIO.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
