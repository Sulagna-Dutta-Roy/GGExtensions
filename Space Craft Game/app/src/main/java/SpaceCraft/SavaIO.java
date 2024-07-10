/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Krcma
 */
public class SavaIO {

    public static Save read(File file) {
        try {
            FileInputStream fis = new FileInputStream(file);
            ObjectInputStream ois = new ObjectInputStream(fis);
            Save s = (Save) ois.readObject();
            ois.close();
            fis.close();
            return s;
        } catch (IOException | ClassNotFoundException ex) {
            //Logger.getLogger(SavaIO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    public static boolean write(Save save, File file) {
        try {
            FileOutputStream fos = new FileOutputStream(file);
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            oos.writeObject(save);
            oos.close();
            fos.close();
        } catch (IOException ex) {
            Logger.getLogger(SavaIO.class.getName()).log(Level.SEVERE, null, ex);
            return false;
        }
        return true;
    }

}
