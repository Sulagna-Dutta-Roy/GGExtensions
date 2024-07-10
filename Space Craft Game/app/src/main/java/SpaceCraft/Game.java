/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Engine.GameManager;
import SpaceCraft.Engine.KeyControler;
import SpaceCraft.Engine.MouseControler;
import SpaceCraft.Engine.EngineCore;
import SpaceCraft.Menu.Menu;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.swing.ImageIcon;
import javax.swing.JFrame;

/**
 *
 * @author Krcma
 */
public class Game extends JFrame {

    public static float XSCALE, YSCALE;

    public static final Dimension GAMESIZE = new Dimension(3000, 1700);

    public static final int FPS = 65, RPS = 55;

    public static final String author = "Martin Krčma";

    public static EngineCore engine;

    public static KeyControler Kcontroler;
    public static MouseControler Mcontroler;

    public static Menu mainMenu, infoMenu, newGameMenu, hubMenu, messageMenu, loadGameMenu, escMenu, soundMenu, x;

    private MenuBuilder mb;

    public static GameManager gameManager;

    public static DateFormat dateFormat = new SimpleDateFormat("dd.MM.yyyy - HH:mm:ss");
    
    public static String getDate() {
        Date d = new Date();
        return Game.dateFormat.format(d);
    }

    public Game() {
        super();
        Dimension size = Toolkit.getDefaultToolkit().getScreenSize();
        Game.XSCALE = size.width / 1366f;
        Game.YSCALE = size.height / 768f;
    }

    public void init(String arg) {
        Game.Kcontroler = new KeyControler();
        Game.Mcontroler = new MouseControler();
        Game.gameManager = new GameManager();
        this.mb = new MenuBuilder();
        //init frame
        this.setTitle("SpaceCraft");
        this.setDefaultCloseOperation(EXIT_ON_CLOSE);
        this.setIconImage(new ImageIcon(this.getClass().getResource("/logo.png")).getImage());
        if (arg.length() == 0) {
            this.setExtendedState(JFrame.MAXIMIZED_BOTH);
            this.setUndecorated(true);
        } else {
            String[] arr = arg.split(",");
            Game.XSCALE = Integer.parseInt(arr[0]) / 1366f;
            Game.YSCALE = Integer.parseInt(arr[1]) / 768f;
            this.setSize(Integer.parseInt(arr[0]), Integer.parseInt(arr[1]));
        }
        this.setVisible(true);
        //init engine
        Game.engine = new EngineCore(Game.FPS, Game.RPS);
        Game.engine.setSize(this.getSize());
        //set volume
        try {
            BufferedReader reader = new BufferedReader(new FileReader("data.dat"));
            String[] line = reader.readLine().split(",");
            Game.engine.FX_volume = Float.parseFloat(line[0]);
            Game.engine.MUSIC_volume = Float.parseFloat(line[1]);
        } catch (IOException ex) {
        }
        this.add(Game.engine);
        Game.engine.init();
        Game.engine.addKeyListener(Game.Kcontroler);
        Game.engine.addMouseListener(Game.Mcontroler);
        Game.engine.addMouseMotionListener(Game.Mcontroler);
        Game.engine.addMouseWheelListener(Game.Mcontroler);
        //build menu
        Game.mainMenu = this.mb.buildMainMenu(new Dimension(1366, 768));
        Game.infoMenu = this.mb.buildInfoMenu(new Dimension(1366, 768));
        Game.newGameMenu = this.mb.buildNewGameMenu(new Dimension(1366, 768));
        Game.loadGameMenu = this.mb.buildLoadGameMenu(new Dimension(1366, 768));
        Game.hubMenu = this.mb.buildHubMenu(new Dimension(1366, 768));
        Game.messageMenu = this.mb.buildMessageMenu(new Dimension(1366, 768));
        Game.escMenu = this.mb.buildEcsMenu(this.getSize());
        Game.soundMenu = this.mb.buildSoundMenu(new Dimension(1366, 768));
    }

    public void run() {
        Game.engine.run();
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        if (args.length == 0) {
            //start game
            Game g = new Game();
            g.init("");
            g.run();
            Game.engine.playBgMusic();
        } else {
            switch (args[0]) {
                case "SpaceshipEditor":
                    //run plane editor
                    new SpaceshipModelEditor(21).setVisible(true);
                    break;
                case "SpaceshipViewer":
                    //model viewer
                    new ModelViewer().setVisible(true);
                    break;
                case "LevelEditor":
                    //level editor
                    new LevelEditor().setVisible(true);
                    break;
                default:
                    //start game
                    Game g = new Game();
                    g.init(args[0]);
                    g.run();
                    break;
            }
        }
    }

}
