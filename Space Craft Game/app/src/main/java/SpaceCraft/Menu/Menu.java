/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Menu;

import java.awt.Graphics2D;
import java.awt.Point;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Marti
 */
public class Menu {

    public List<Button> buttons;
    public List<Label> labels;
    public List<Panel> panels;
    public List<TextField> textFields;

    public HashMap<Object,Object> variables;
    
    public boolean visibility, editable;

    public int X, Y;

    public Menu(int x, int y) {
        this.variables = new HashMap<>();
        this.buttons = new ArrayList<>();
        this.labels = new ArrayList<>();
        this.panels = new ArrayList<>();
        this.textFields = new ArrayList<>();
        this.visibility = false;
        this.editable = true;
        this.X = x;
        this.Y = y;
    }

    /**
     *
     * @param p mouse cursor position
     */
    public void refresh(Point p) {
        try {
            for (int i = 0; i < this.buttons.size(); i++) {
                Button b = this.buttons.get(i);
                if (b.mouseOn(this.X, this.Y, p)) {
                    b.mouseIn();
                } else {
                    b.mouseOut();
                }
            }
        } catch (Exception ex) {
        }
    }

    public void render(Graphics2D g2) {
        if (!this.visibility) {
            return;
        }
        try {
            for (int i = 0; i < this.panels.size(); i++) {
                Panel p = this.panels.get(i);
                p.render(g2, this.X, this.Y);
            }
        } catch (Exception ex) {
            Logger.getLogger(Menu.class.getName()).log(Level.SEVERE, null, ex);
        }
        try {
            for (int i = 0; i < this.buttons.size(); i++) {
                Button b = this.buttons.get(i);
                b.render(g2, this.X, this.Y);
            }
        } catch (Exception ex) {
        }
        try {
            for (int i = 0; i < this.labels.size(); i++) {
                Label l = this.labels.get(i);
                l.render(g2, this.X, this.Y);
            }
        } catch (Exception ex) {
        }
        try {
            for (int i = 0; i < this.textFields.size(); i++) {
                TextField t = this.textFields.get(i);
                t.render(g2, this.X, this.Y);
            }
        } catch (Exception ex) {
        }
    }

    public void addComponent(Button b) {
        this.buttons.add(b);
    }

    public void addComponent(Label l) {
        this.labels.add(l);
    }

    public void addComponent(Panel p) {
        this.panels.add(p);
    }

    public void addComponent(TextField t) {
        this.textFields.add(t);
    }

}
