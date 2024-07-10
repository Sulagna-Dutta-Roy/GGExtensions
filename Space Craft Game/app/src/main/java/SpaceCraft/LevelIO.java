/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Level.Level;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.logging.Logger;

/**
 *
 * @author Krcma
 */
public class LevelIO {

    public static String ENDLEVEL = "@542824674#LastLevel#671452448@";
    
    public static Level read(File file) {
        try {
            FileInputStream fis = new FileInputStream(file);
            ObjectInputStream ois = new ObjectInputStream(fis);
            Level l = (Level) ois.readObject();
            ois.close();
            fis.close();
            return l;
        } catch (FileNotFoundException ex) {
            Logger.getLogger(LevelIO.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IOException | ClassNotFoundException ex) {
            Logger.getLogger(LevelIO.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        Level l = new Level();
        l.TEXT = LevelIO.ENDLEVEL;
        return l;
    }

    public static void write(Level l, File file) {
        try {
            FileOutputStream fos = new FileOutputStream(file);
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            oos.writeObject(l);
            oos.close();
            fos.close();
        } catch (FileNotFoundException ex) {
            Logger.getLogger(LevelIO.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(LevelIO.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
    }

}
