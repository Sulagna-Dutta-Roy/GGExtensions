/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Menu.Button;
import SpaceCraft.Menu.Label;
import SpaceCraft.Menu.Menu;
import SpaceCraft.Menu.Panel;
import SpaceCraft.Menu.TextField;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontFormatException;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Krcma
 */
public class MenuBuilder {

    private Font ttf;

    public MenuBuilder() {
        try {
            this.ttf = Font.createFont(
                    Font.TRUETYPE_FONT,
                    this.getClass().getResourceAsStream("/font.ttf")
            );
        } catch (FontFormatException | IOException ex) {
            Logger.getLogger(MenuBuilder.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public Font getFont() {
        return this.ttf;
    }

    public Menu buildMainMenu(Dimension size) {
        Menu m = new Menu(0, 0);
        m.visibility = true;
        this.ttf = this.ttf.deriveFont(60F);
        Label l = new Label(size.width / 2, (int) (size.height * 0.22), "spacecraft", new Color(110, 170, 110), this.ttf, 0.9f);
        m.addComponent(l);
        this.ttf = this.ttf.deriveFont(25F);
        l = new Label(size.width / 2, (int) (size.height * 0.26), "build and fight", new Color(70, 70, 70), this.ttf, 0.9f);
        m.addComponent(l);
        this.ttf = this.ttf.deriveFont(40F);
        Button b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.35),
                new Dimension((int) (size.width * 0.28f), (int) (size.height * 0.078f)),
                "new game",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.45),
                new Dimension((int) (size.width * 0.28f), (int) (size.height * 0.078f)),
                "load game",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.55),
                new Dimension((int) (size.width * 0.28f), (int) (size.height * 0.078f)),
                "information",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.65),
                new Dimension((int) (size.width * 0.28f), (int) (size.height * 0.078f)),
                "sounds",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.75),
                new Dimension((int) (size.width * 0.28f), (int) (size.height * 0.078f)),
                "exit",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        return m;
    }

    public Menu buildInfoMenu(Dimension size) {
        Menu m = new Menu(0, 0);
        Panel p = new Panel(
                size.width / 2,
                (int) (size.height * 0.1),
                new Dimension((int) (size.width * 0.55), (int) (size.height * 0.7)),
                new Color(40, 55, 40),
                new Color(110, 140, 110),
                new Font("Tahoma", Font.BOLD, 25),
                0.8f,
                new String[]{
                    "Description:",
                    "In this game you build your own spaceship",
                    "and then go to the battle. Spaceships are builded",
                    "from blocks. Each block has different properties.",
                    "After battle you can rebuild your spaceship and use",
                    "new block from shop. The game will automatically",
                    "save at the end of each level. Next info about blocks",
                    "and spaceship building in game.",
                    "",
                    "Contor:",
                    "Mouse -> moving",
                    "Left mouse button -> shooting",
                    "Q, W, E, R, T -> gun switching",
                    "ESC -> pause",
                    "",
                    "Game created by Martin Krčma",
                    "Last update: 7.9.2018"
                }
        );
        m.addComponent(p);
        this.ttf = this.ttf.deriveFont(40F);
        Button b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.85),
                new Dimension((int) (size.width * 0.22f), (int) (size.height * 0.078f)),
                "back",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        return m;
    }

    public Menu buildNewGameMenu(Dimension size) {
        Menu m = new Menu(0, 0);
        Panel p = new Panel(
                size.width / 2,
                (int) (size.height * 0.32),
                new Dimension((int) (size.width * 0.7), (int) (size.height * 0.3)),
                new Color(40, 55, 40),
                0.8f
        );
        m.addComponent(p);
        this.ttf = this.ttf.deriveFont(40F);
        Label l = new Label(size.width / 2, (int) (size.height * 0.22), "new game", new Color(110, 150, 110), this.ttf, 0.9f);
        m.addComponent(l);
        Button b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.85),
                new Dimension((int) (size.width * 0.22f), (int) (size.height * 0.078f)),
                "back",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.55),
                new Dimension((int) (size.width * 0.28f), (int) (size.height * 0.078f)),
                "next",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        this.ttf = this.ttf.deriveFont(32F);
        l = new Label(size.width / 4, (int) (size.height * 0.35 + 40), "your name", new Color(60, 85, 60), this.ttf, 0.9f);
        m.addComponent(l);
        this.ttf = this.ttf.deriveFont(32F);
        TextField t = new TextField(
                size.width / 2 + 140,
                (int) (size.height * 0.35),
                new Dimension((int) (size.width * 0.4), 40),
                new Color(90, 110, 90),
                new Color(60, 70, 60),
                this.ttf,
                0.8f
        );
        m.addComponent(t);
        b = new Button(
                (int) (size.width / 2) - 200,
                (int) (size.height * 0.45),
                new Dimension(90, 40),
                "<",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        m.addComponent(b);
        b = new Button(
                (int) (size.width / 2) + 200,
                (int) (size.height * 0.45),
                new Dimension(90, 40),
                ">",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        m.addComponent(b);
        l = new Label(size.width / 2, (int) (size.height * 0.45 + 5), "Default", new Color(60, 85, 60), new Font("Tahoma", Font.BOLD, 28), 0.9f);
        l.ID = 1;
        m.addComponent(l);
        return m;
    }

    /**
     * ID Label list 0 - Name; 1 - center up label; 2 - Date; 3 - Level; 4 -
     * Model; 5 - Total live; 6 - Total mass; 7 - Blocks; 8 - Complexity; 9 -
     * Guns; 10 - Damage/s; 11 - Total game time; 12 - Kills; 13 - Deaths; 14 -
     * blocks placed; 15 - Level name; 16 - level number
     *
     * @param size
     * @return
     */
    public Menu buildHubMenu(Dimension size) {
        Menu m = new Menu(0, 0);
        //###################################################
        Panel p = new Panel(
                size.width / 2,
                0,
                new Dimension((int) (size.width), 50),
                new Color(40, 55, 40),
                0.7f
        );
        m.addComponent(p);
        Label l = new Label(
                40,
                35,
                "name: ",
                new Color(110, 150, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.9f
        );
        l.center = false;
        m.addComponent(l);
        l = new Label(
                size.width / 2,
                35,
                "",
                new Color(110, 150, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.9f
        );
        l.ID = 1;
        m.addComponent(l);
        l = new Label(
                size.width - 300,
                35,
                "",
                new Color(110, 150, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.9f
        );
        l.center = false;
        l.ID = 2;
        m.addComponent(l);
        //###################################################
        p = new Panel(
                0,
                65,
                new Dimension((int) (size.width / 2) - 30, (int) (size.height * 0.6)),
                new Color(40, 40, 55),
                0.55f
        );
        p.X = 15;
        m.addComponent(p);
        l = new Label(
                30,
                90,
                "Your spaceship",
                new Color(110, 110, 150),
                new Font("Tahoma", Font.BOLD, 25),
                0.9f
        );
        l.ID = -1;
        l.center = false;
        m.addComponent(l);
        for (int i = 0; i < 6; i++) {
            l = new Label(
                    30,
                    135 + i * 30,
                    "",
                    new Color(100, 100, 130),
                    new Font("Tahoma", Font.BOLD, 22),
                    0.9f
            );
            l.center = false;
            l.ID = 5 + i;
            m.addComponent(l);
        }
        p = new Panel(
                0,
                65,
                new Dimension((int) (size.width / 2) - 30, (int) (size.height * 0.6)),
                new Color(55, 40, 40),
                0.55f
        );
        p.X = (int) (size.width / 2) + 15;
        m.addComponent(p);
        l = new Label(
                size.width / 2 + 30,
                90,
                "Next level",
                new Color(150, 110, 110),
                new Font("Tahoma", Font.BOLD, 25),
                0.9f
        );
        l.blink = true;
        l.center = false;
        l.ID = 3;
        m.addComponent(l);
        l = new Label(
                size.width / 2 + 30,
                120,
                "",
                new Color(130, 110, 110),
                new Font("Tahoma", Font.BOLD, 25),
                0.9f
        );
        l.center = false;
        l.ID = 16;
        m.addComponent(l);
        l = new Label(
                size.width / 2 + 30,
                150,
                "",
                new Color(130, 110, 110),
                new Font("Tahoma", Font.BOLD, 25),
                0.9f
        );
        l.center = false;
        l.ID = 17;
        m.addComponent(l);
        l = new Label(
                size.width - 21 - (int) (Game.engine.getHeight() * 0.5f * 1f / Game.YSCALE),
                130,
                "",
                new Color(130, 110, 110),
                new Font("Tahoma", Font.BOLD, 25),
                0.9f
        );
        l.center = false;
        l.ID = 18;
        m.addComponent(l);
        for (int i = 0; i < 15; i++) {
            l = new Label(
                    size.width / 2 + 30,
                    180 + i * 20,
                    "",
                    new Color(130, 110, 110),
                    new Font("Tahoma", Font.BOLD, 15),
                    0.9f
            );
            l.center = false;
            l.ID = 19 + i;
            m.addComponent(l);
        }
        Button b = new Button(
                0,
                (int) (size.height * 0.6 + 30),
                new Dimension(100, 40),
                "Edit",
                new Color(60, 60, 100),
                new Color(110, 110, 140),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = 30;
        m.addComponent(b);
        b = new Button(
                0,
                (int) (size.height * 0.6 + 30),
                new Dimension(200, 40),
                "Play game",
                new Color(100, 60, 60),
                new Color(140, 110, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = (int) (size.width / 2) + 30;
        m.addComponent(b);
        //###################################################
        p = new Panel(
                0,
                (int) (size.height * 0.6) + 80,
                new Dimension((int) (size.width) - 30, (int) (size.height * 0.4 - 95)),
                new Color(40, 55, 40),
                0.5f
        );
        p.X = 15;
        m.addComponent(p);
        b = new Button(
                0,
                (int) (size.height - 55),
                new Dimension(220, 40),
                "Back to menu",
                new Color(60, 100, 60),
                new Color(100, 140, 110),
                new Font("Tahoma", Font.BOLD, 22),
                0.8f
        );
        b.X = (int) (size.width) - 250;
        m.addComponent(b);
        //###################################################
        l = new Label(
                (int) (size.width / 2 - size.height * 0.5f - 21),
                65 + (int) (size.height * 0.05f),
                "",
                new Color(110, 110, 150),
                new Font("Tahoma", Font.BOLD, 22),
                0.9f
        );
        l.ID = 4;
        l.center = false;
        m.addComponent(l);
        //###################################################
        for (int i = 0; i < 5; i++) {
            l = new Label(
                    30,
                    (int) (size.height * 0.6) + 110 + i * 42,
                    "",
                    new Color(110, 150, 110),
                    new Font("Tahoma", Font.BOLD, 25),
                    0.9f
            );
            l.ID = 11 + i;
            l.center = false;
            m.addComponent(l);
        }
        //###################################################
        return m;
    }

    public Menu buildMessageMenu(Dimension size) {
        Menu m = new Menu(0, 0);
        Panel p = new Panel(
                size.width / 2,
                0,
                new Dimension(size.width, size.height),
                new Color(0, 0, 0),
                0.55f
        );
        m.addComponent(p);
        p = new Panel(
                size.width / 2,
                (int) (size.height * 0.35),
                new Dimension((int) (size.width * 0.4f), (int) (size.height * 0.3f)),
                new Color(40, 55, 40),
                new Color(110, 140, 110),
                new Font("Tahoma", Font.BOLD, 25),
                0.8f,
                new String[]{""}
        );
        m.addComponent(p);
        Button b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.6),
                new Dimension((int) (size.width * 0.22f), (int) (size.height * 0.078f)),
                "back",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        return m;
    }

    public Menu buildLoadGameMenu(Dimension size) {
        Menu m = new Menu(0, 0);
        Panel p = new Panel(
                size.width / 2,
                (int) (size.height * 0.075),
                new Dimension((int) (size.width * 0.85f), (int) (size.height * 0.9f)),
                new Color(40, 55, 40),
                0.5f
        );
        m.addComponent(p);
        Button b = new Button(
                (int) (size.width / 2),
                (int) (size.height * 0.92),
                new Dimension((int) (size.width * 0.22f), (int) (size.height * 0.078f)),
                "back",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                this.ttf,
                0.8f
        );
        m.addComponent(b);
        b = new Button(
                (int) (size.width / 2 - size.width * 0.17f - 10),
                (int) (size.height * 0.92),
                new Dimension((int) (size.width * 0.12f), (int) (size.height * 0.078f)),
                "<",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                new Font("Tahoma", Font.BOLD, 25),
                0.8f
        );
        m.addComponent(b);
        b = new Button(
                (int) (size.width / 2 + size.width * 0.17f + 10),
                (int) (size.height * 0.92),
                new Dimension((int) (size.width * 0.12f), (int) (size.height * 0.078f)),
                ">",
                new Color(80, 90, 80),
                new Color(110, 140, 110),
                new Font("Tahoma", Font.BOLD, 25),
                0.8f
        );
        m.addComponent(b);
        m.variables.put(0, 6);
        return m;
    }

    public Menu buildEcsMenu(Dimension size) {
        Menu m = new Menu(0, 0);
        Panel p = new Panel(
                size.width / 2,
                (int) (size.height / 2 - 125),
                new Dimension(450, 180),
                new Color(55, 55, 65),
                0.75f
        );
        m.addComponent(p);
        Button b = new Button(
                0,
                0,
                new Dimension(150, 42),
                "Back",
                new Color(80, 80, 90),
                new Color(110, 110, 140),
                new Font("Tahoma", Font.BOLD, 25),
                0.6f
        );
        b.X = (int) (size.width / 2 - 205);
        b.Y = (int) (size.height / 2 - 110);
        m.addComponent(b);
        b = new Button(
                0,
                0,
                new Dimension(240, 42),
                "Back to menu",
                new Color(80, 80, 90),
                new Color(110, 110, 140),
                new Font("Tahoma", Font.BOLD, 25),
                0.6f
        );
        b.X = (int) (size.width / 2 - 35);
        b.Y = (int) (size.height / 2 - 110);
        m.addComponent(b);
        for (int i = 0; i <= 1; i++) {
            b = new Button(
                    0,
                    0,
                    new Dimension(80, 32),
                    "<",
                    new Color(80, 80, 90),
                    new Color(110, 110, 140),
                    new Font("Tahoma", Font.BOLD, 25),
                    0.6f
            );
            b.X = (int) (size.width / 2 - 35);
            b.Y = (int) (size.height / 2 - 50 + 50 * i);
            b.ID = i;
            m.addComponent(b);
            b = new Button(
                    0,
                    0,
                    new Dimension(80, 32),
                    ">",
                    new Color(80, 80, 90),
                    new Color(110, 110, 140),
                    new Font("Tahoma", Font.BOLD, 25),
                    0.6f
            );
            b.X = (int) (size.width / 2 + 125);
            b.Y = (int) (size.height / 2 - 50 + 50 * i);
            b.ID = i;
            m.addComponent(b);
            Label l = new Label(
                    (int) (size.width / 2 + 85),
                    (int) (size.height / 2 - 25 + 50 * i),
                    "100%",
                    new Color(110, 110, 150),
                    new Font("Tahoma", Font.BOLD, 22),
                    0.9f
            );
            l.ID = i;
            m.addComponent(l);
            l = new Label(
                    (int) (size.width / 2 - 205),
                    (int) (size.height / 2 - 25 + 50 * i),
                    i == 0 ? "Sound effects:" : "Music:",
                    new Color(110, 110, 150),
                    new Font("Tahoma", Font.BOLD, 22),
                    0.9f
            );
            l.center = false;
            l.ID = -1;
            m.addComponent(l);
        }
        return m;
    }

    public Menu buildSoundMenu(Dimension size) {
        Menu m = new Menu(0, 0);
        Panel p = new Panel(
                size.width / 2,
                0,
                new Dimension(size.width, size.height),
                new Color(0, 0, 0),
                0.55f
        );
        m.addComponent(p);
        p = new Panel(
                size.width / 2,
                (int) (size.height / 2 - 125),
                new Dimension(450, 180),
                new Color(55, 55, 65),
                0.75f
        );
        m.addComponent(p);
        Button b = new Button(
                0,
                0,
                new Dimension(410, 42),
                "Back",
                new Color(80, 80, 90),
                new Color(110, 110, 140),
                new Font("Tahoma", Font.BOLD, 25),
                0.6f
        );
        b.X = (int) (size.width / 2 - 205);
        b.Y = (int) (size.height / 2 - 110);
        m.addComponent(b);
        for (int i = 0; i <= 1; i++) {
            b = new Button(
                    0,
                    0,
                    new Dimension(80, 32),
                    "<",
                    new Color(80, 80, 90),
                    new Color(110, 110, 140),
                    new Font("Tahoma", Font.BOLD, 25),
                    0.6f
            );
            b.X = (int) (size.width / 2 - 35);
            b.Y = (int) (size.height / 2 - 50 + 50 * i);
            b.ID = i;
            m.addComponent(b);
            b = new Button(
                    0,
                    0,
                    new Dimension(80, 32),
                    ">",
                    new Color(80, 80, 90),
                    new Color(110, 110, 140),
                    new Font("Tahoma", Font.BOLD, 25),
                    0.6f
            );
            b.X = (int) (size.width / 2 + 125);
            b.Y = (int) (size.height / 2 - 50 + 50 * i);
            b.ID = i;
            m.addComponent(b);
            Label l = new Label(
                    (int) (size.width / 2 + 85),
                    (int) (size.height / 2 - 25 + 50 * i),
                    "100%",
                    new Color(110, 110, 150),
                    new Font("Tahoma", Font.BOLD, 22),
                    0.9f
            );
            l.ID = i;
            m.addComponent(l);
            l = new Label(
                    (int) (size.width / 2 - 205),
                    (int) (size.height / 2 - 25 + 50 * i),
                    i == 0 ? "Sound effects:" : "Music:",
                    new Color(110, 110, 150),
                    new Font("Tahoma", Font.BOLD, 22),
                    0.9f
            );
            l.center = false;
            l.ID = -1;
            m.addComponent(l);
        }
        return m;
    }

}
