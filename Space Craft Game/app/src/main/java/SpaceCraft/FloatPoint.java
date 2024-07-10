/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import java.awt.Point;
import java.io.Serializable;

/**
 *
 * @author Krcma
 */
public class FloatPoint implements Serializable{

    public float x, y;

    public FloatPoint(float x, float y) {
        this.x = x;
        this.y = y;
    }
    
    public Point getPoint() {
        return new Point(
                (int) this.x,
                (int) this.y
        );
    }

}
