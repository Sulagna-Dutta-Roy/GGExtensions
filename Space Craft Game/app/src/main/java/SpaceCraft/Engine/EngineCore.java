/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Engine;

import SpaceCraft.FloatPoint;
import SpaceCraft.Game;
import SpaceCraft.LevelIO;
import SpaceCraft.Menu.Label;
import SpaceCraft.Object.Block.ShieldBlock;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockBuilder;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Object.Bullet.Bullet;
import SpaceCraft.Object.GraphicsText;
import SpaceCraft.Object.Meteorite;
import SpaceCraft.Object.Particle;
import SpaceCraft.Object.PressureWave;
import SpaceCraft.Object.Spaceship.Spaceship;
import SpaceCraft.Tools;
import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Canvas;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Point;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.ImageIcon;

/**
 *
 * @author Krcma
 */
public class EngineCore extends Canvas {

    public Screen screen;

    public Thread render, physics;

    public List<Spaceship> objects;
    public List<Bullet> bullets;
    public List<GraphicsText> texts;
    public List<Particle> particles;
    public List<PressureWave> waves;
    private List<Meteorite> meteorites;

    private final int FPS, RPS;
    private double RperTick, PperTick;

    public enum EngineMode {
        INGAME, INMENU, INEDITOR, LOADING;
    }

    private EngineMode engineMode;

    private ModelEditor modelEditor;

    private Collisions collisions;

    private final ImageIcon img = new ImageIcon(this.getClass().getResource("/bg.png"));
    private final ImageIcon logo = new ImageIcon(this.getClass().getResource("/logo_1.png"));

    private HashMap<String, SoundPlayer> sounds;
    private List<String> music_list;
    public float FX_volume = 0.75f, MUSIC_volume = 0.75f;

    public boolean playerSpawned = false;

    public EngineCore(int fps, int rps) {
        super();
        this.engineMode = EngineMode.INMENU;
        this.FPS = fps;
        this.RPS = rps;
    }

    private void showLogo() {
        Thread t = new Thread() {
            public void run() {
                try {
                    float f = 0.0f;
                    for (int j = 0; j < 50; j++) {
                        Graphics2D g = (Graphics2D) getBufferStrategy().getDrawGraphics();
                        g.setColor(Color.black);
                        g.fillRect(0, 0, getWidth(), getHeight());
                        g.setComposite(AlphaComposite.SrcOver.derive(f));
                        g.drawImage(
                                logo.getImage(),
                                (int) ((getWidth() - logo.getIconWidth()) / 2),
                                (int) ((getHeight() - logo.getIconHeight()) / 2),
                                null
                        );
                        getBufferStrategy().show();
                        f += 0.02f;
                        Thread.sleep(20);
                    }
                } catch (Exception ex) {
                }
            }
        };
        t.start();
    }

    public void init() {
        this.createBufferStrategy(3);
        this.setBackground(Color.black);
        this.setEngineMode(EngineMode.LOADING);
        showLogo();
        //arrays
        this.objects = new ArrayList<>();
        this.texts = new ArrayList<>();
        this.bullets = new ArrayList<>();
        this.particles = new ArrayList<>();
        this.waves = new ArrayList<>();
        this.meteorites = new ArrayList<>();
        this.music_list = new ArrayList<>();
        this.music_list.add("music1");
        //####################
        this.screen = new Screen();
        this.collisions = new Collisions(this.objects, this.bullets);
        //this.soundCore = new SoundCore();
        this.modelEditor = new ModelEditor(new Dimension(1366, 768));
        this.modelEditor.init();
        //init basic sounds
        this.sounds = new HashMap<>();
        this.sounds.put("shoot", new SoundPlayer(this.getClass().getResource("/shoot.wav"), 7, false, this.FX_volume));
        this.sounds.put("shoot_s", new SoundPlayer(this.getClass().getResource("/shoot_sniper.wav"), 4, false, this.FX_volume));
        this.sounds.put("shoot_p", new SoundPlayer(this.getClass().getResource("/shoot_plasma.wav"), 5, false, this.FX_volume));
        this.sounds.put("shoot_sh", new SoundPlayer(this.getClass().getResource("/shoot_shotgun.wav"), 5, false, this.FX_volume));
        this.sounds.put("hit", new SoundPlayer(this.getClass().getResource("/hit.wav"), 10, false, this.FX_volume));
        this.sounds.put("explode", new SoundPlayer(this.getClass().getResource("/explode.wav"), 4, false, this.FX_volume));
        this.sounds.put("click", new SoundPlayer(this.getClass().getResource("/click.wav"), 2, false, this.FX_volume));
        this.sounds.put("music1", new SoundPlayer(this.getClass().getResource("/music1.wav"), 1, true, this.MUSIC_volume));
        //rendering
        this.render = new Thread(new Runnable() {
            @Override
            public void run() {
                double last = System.nanoTime(), ticks = 0;
                while (true) {
                    double now = System.nanoTime();
                    ticks += (now - last) / RperTick;
                    last = now;
                    while (ticks >= 1) {
                        ticks--;
                        try {
                            Graphics2D g2 = (Graphics2D) getBufferStrategy().getDrawGraphics();
                            g2.setColor(Color.black);
                            g2.fillRect(0, 0, getWidth(), getHeight());
                            switch (engineMode) {
                                case LOADING:
                                    g2.drawImage(
                                            logo.getImage(),
                                            (int) ((getWidth() - logo.getIconWidth()) / 2),
                                            (int) ((getHeight() - logo.getIconHeight()) / 2),
                                            null
                                    );
                                    break;
                                case INGAME:
                                    g2.setComposite(AlphaComposite.SrcOver.derive(0.3f));
                                    g2.drawImage(img.getImage(), screen.X_OFF, screen.Y_OFF, null);
                                    g2.setComposite(AlphaComposite.SrcOver.derive(1.0f));
                                    render_game(g2);
                                    break;
                                case INMENU:
                                    g2.setComposite(AlphaComposite.SrcOver.derive(0.3f));
                                    g2.drawImage(img.getImage(), 0, 0, null);
                                    g2.setComposite(AlphaComposite.SrcOver.derive(1.0f));
                                    render_menu(g2);
                                    break;
                                case INEDITOR:
                                    g2.setComposite(AlphaComposite.SrcOver.derive(0.3f));
                                    g2.drawImage(img.getImage(), 0, 0, null);
                                    g2.setComposite(AlphaComposite.SrcOver.derive(1.0f));
                                    render_editor(g2);
                                    break;
                            }
                            float t = screen.getTransition();
                            if (t != 0.0f) {
                                g2.setComposite(AlphaComposite.SrcOver.derive(t));
                                g2.setColor(Color.black);
                                g2.fillRect(0, 0, getWidth(), getHeight());
                            }
                            g2.dispose();
                            getBufferStrategy().show();
                        } catch (Exception ex) {
                            Logger.getLogger(EngineCore.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }
            }
        });
        this.render.setName("Rendering thread");
        //physics
        this.physics = new Thread(new Runnable() {
            @Override
            public void run() {
                double last = System.nanoTime(), ticks = 0;
                while (true) {
                    double now = System.nanoTime();
                    ticks += (now - last) / PperTick;
                    last = now;
                    while (ticks >= 1) {
                        ticks--;
                        try {
                            screen.refresTransition();
                            screen.refreshLoading();
                            switch (engineMode) {
                                case INGAME:
                                    physics_game();
                                    break;
                                case INMENU:
                                    physics_menu();
                                    break;
                            }
                        } catch (Exception ex) {
                            Logger.getLogger(EngineCore.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }
            }
        });
        this.physics.setName("Physics thread");
        this.screen.createTransition(Game.RPS, EngineMode.INMENU);
        spawnMeteorites(true, 10);
    }

    public ModelEditor getModelEditor() {
        return this.modelEditor;
    }

    public void run() {
        this.render.start();
        this.physics.start();
    }

    /**
     * Render #############################################################
     */
    private void render_game(Graphics2D g2) {
        //meteorites
        for (int i = 0; i < this.meteorites.size(); i++) {
            Meteorite m = this.meteorites.get(i);
            if (m.x + m.radius + this.screen.X_OFF >= 0
                    && m.x - m.radius + this.screen.X_OFF <= this.getWidth()
                    && m.y + m.radius + this.screen.Y_OFF >= 0
                    && m.y - m.radius + this.screen.Y_OFF <= this.getHeight()) {
                m.render(g2, this.screen.X_OFF, this.screen.Y_OFF);
            }
        }
        //physics objects
        for (int i = 0; i < this.objects.size(); i++) {
            Spaceship obj = this.objects.get(i);
            if (obj.getPosition().x + obj.getSafeRange() + this.screen.X_OFF >= 0
                    && obj.getPosition().x - obj.getSafeRange() + this.screen.X_OFF <= this.getWidth()
                    && obj.getPosition().y + obj.getSafeRange() + this.screen.Y_OFF >= 0
                    && obj.getPosition().y - obj.getSafeRange() + this.screen.Y_OFF <= this.getHeight()) {
                obj.render(g2, this.screen.X_OFF, this.screen.Y_OFF);
            }
        }
        //bullets
        for (int i = 0; i < this.bullets.size(); i++) {
            Bullet b = this.bullets.get(i);
            if (b.getPosition().x + 10 + this.screen.X_OFF >= 0
                    && b.getPosition().x - 10 + this.screen.X_OFF <= this.getWidth()
                    && b.getPosition().y + 40 + this.screen.Y_OFF >= 0
                    && b.getPosition().y - 40 + this.screen.Y_OFF <= this.getHeight()) {
                b.render(g2, this.screen.X_OFF, this.screen.Y_OFF);
            }
        }
        //particles 
        for (int i = 0; i < this.particles.size(); i++) {
            Particle p = this.particles.get(i);
            if (p != null) {
                if (p.getPosition().x + p.getSize() + this.screen.X_OFF >= 0
                        && p.getPosition().x + this.screen.X_OFF <= this.getWidth()
                        && p.getPosition().y + p.getSize() + this.screen.Y_OFF >= 0
                        && p.getPosition().y + this.screen.Y_OFF <= this.getHeight()) {
                    p.render(g2, this.screen.X_OFF, this.screen.Y_OFF);
                }
            }
        }
        //pressureWaves
        for (int i = 0; i < this.waves.size(); i++) {
            PressureWave p = this.waves.get(i);
            p.render(g2, this.screen.X_OFF, this.screen.Y_OFF);
        }
        //texts
        for (int i = 0; i < this.texts.size(); i++) {
            GraphicsText txt = this.texts.get(i);
            txt.render(g2, this.screen.X_OFF, this.screen.Y_OFF);
        }
        //gun list
        int n = 0;
        for (int i = 0; i < Game.gameManager.getSave().getPlayerGuns().size(); i++) {
            BlockType bt = Game.gameManager.getSave().getPlayerGuns().get(i).getType();
            Block b = BlockBuilder.getBlock(
                    new Point(
                            15 + i * (Block.SIZE + 25),
                            15
                    ),
                    Game.gameManager.getSave().getPlayerGuns().get(i).getColor(),
                    bt
            );
            if (bt == Game.gameManager.getSave().gun) {
                g2.setColor(Color.RED);
            } else {
                g2.setColor(Color.CYAN);
            }
            g2.setComposite(AlphaComposite.SrcOver.derive(0.45f));
            g2.setStroke(new BasicStroke(2));
            int h = (int) (20 + Block.SIZE - ((float) (20 + Block.SIZE) / (float) bt.getLoadTime()) * (float) Game.gameManager.getSave().getPlayer().getGunLoadTime(bt));
            g2.fillRect(
                    5 + i * (Block.SIZE + 25),
                    25 + Block.SIZE,
                    Block.SIZE + 20,
                    -h
            );
            g2.drawRect(
                    5 + i * (Block.SIZE + 25),
                    5,
                    Block.SIZE + 20,
                    Block.SIZE + 20
            );
            g2.setComposite(AlphaComposite.SrcOver.derive(1.0f));
            b.render(g2, true, false, 0, 0);
            b.render(g2, true, true, 0, 0);
            g2.setFont(new Font("Tahoma", Font.BOLD, 15));
            g2.setColor(Color.WHITE);
            String t = "";
            switch (i) {
                case 0:
                    t = "Q";
                    break;
                case 1:
                    t = "W";
                    break;
                case 2:
                    t = "E";
                    break;
            }
            g2.drawString(t, 20 + i * (Block.SIZE + 25), 30 + Block.SIZE);
            n++;
        }
        //absorbation blocks
        for (int i = 0; i < Game.gameManager.getSave().getPlayer().getAbsorbationBlocks().size(); i++) {
            ShieldBlock a = Game.gameManager.getSave().getPlayer().getAbsorbationBlocks().get(i);
            Block b = BlockBuilder.getBlock(new Point(
                    15 + (i + n) * (Block.SIZE + 25),
                    15
            ),
                    a.getColor(),
                    BlockType.SHIELD_BLOCK
            );
            g2.setComposite(AlphaComposite.SrcOver.derive(0.45f));
            g2.setStroke(new BasicStroke(2));
            int h = (int) (20 + Block.SIZE - ((float) (20 + Block.SIZE) / 100f) * (100 - a.shield));
            g2.setColor(Color.CYAN);
            g2.fillRect(
                    5 + (i + n) * (Block.SIZE + 25),
                    25 + Block.SIZE,
                    Block.SIZE + 20,
                    -h
            );
            g2.drawRect(
                    5 + (i + n) * (Block.SIZE + 25),
                    5,
                    Block.SIZE + 20,
                    Block.SIZE + 20
            );
            g2.setComposite(AlphaComposite.SrcOver.derive(1.0f));
            b.render(g2, true, false, 0, 0);
            b.render(g2, true, true, 0, 0);
        }
        //battle stats
        g2.setComposite(AlphaComposite.SrcOver.derive(0.4f));
        g2.setColor(new Color(50, 50, 60));
        g2.fillRoundRect(5, this.getHeight() - 80, 200, 75, 10, 10);
        g2.setComposite(AlphaComposite.SrcOver.derive(0.8f));
        g2.drawRoundRect(5, this.getHeight() - 80, 200, 75, 10, 10);
        g2.setFont(new Font("Tahoma", Font.BOLD, 18));
        g2.setColor(new Color(80, 80, 100));
        g2.drawString("Damage: " + Game.gameManager.getSave().getBattleStats().damage, 15, this.getHeight() - 55);
        g2.drawString("Coins: " + Game.gameManager.getSave().getBattleStats().coins, 15, this.getHeight() - 35);
        g2.drawString("Kills: " + Game.gameManager.getSave().getBattleStats().kills, 15, this.getHeight() - 15);
        g2.setColor(Color.RED);
        g2.fillRoundRect(5, this.getHeight() - 110, Game.gameManager.lifeBar(200), 20, 10, 10);
        g2.setColor(Color.DARK_GRAY);
        g2.drawRoundRect(5, this.getHeight() - 110, 200, 20, 10, 10);
        //esc menu
        Game.escMenu.render(g2);
    }

    private void render_menu(Graphics2D g2) {
        if (Game.mainMenu.visibility) {
            //particles
            for (int i = 0; i < this.particles.size(); i++) {
                Particle p = this.particles.get(i);
                p.render(g2, this.screen.X_OFF, this.screen.Y_OFF);
            }
        }
        g2.scale(Game.XSCALE, Game.YSCALE);
        Game.mainMenu.render(g2);
        Game.infoMenu.render(g2);
        Game.newGameMenu.render(g2);
        Game.hubMenu.render(g2);
        if (Game.hubMenu.visibility) {
            if (Game.gameManager.getLevelManager().getLevel().TEXT.equals(LevelIO.ENDLEVEL)) {
                g2.setFont(new Font("Tahoma", Font.BOLD, 35));
                g2.setColor(new Color(100, 80, 80));
                g2.drawString("Campaign completed", this.getWidth() * 0.63f, this.getHeight() * 0.35f);
            }
        }
        Game.messageMenu.render(g2);
        Game.loadGameMenu.render(g2);
        Game.soundMenu.render(g2);
        g2.scale(1f / Game.XSCALE, 1f / Game.YSCALE);
        if (screen.loading) {
            g2.setColor(Color.GRAY);
            g2.setStroke(new BasicStroke(40));
            g2.drawArc(this.getWidth() / 2 - 70, this.getHeight() / 2 - 70, 140, 140, 0, screen.loading_c);
        }
    }

    private void render_editor(Graphics2D g2) {
        g2.scale(Game.XSCALE, Game.YSCALE);
        this.modelEditor.render(g2);
        g2.scale(1f / Game.XSCALE, 1f / Game.YSCALE);
    }

    /**
     * Physics #############################################################
     */
    private void physics_game() {
        if (!Game.escMenu.visibility) {
            //meteorites
            for (int i = 0; i < this.meteorites.size(); i++) {
                Meteorite m = this.meteorites.get(i);
                m.refresh();
                if (m.isOut(Game.GAMESIZE)) {
                    this.meteorites.remove(m);
                    this.meteorites.add(
                            new Meteorite(
                                    (int) (Game.GAMESIZE.width * (Math.random() * 0.8f + 0.1f)),
                                    -(int) (Game.GAMESIZE.height * (Math.random() * 0.2f + 0.1f)),
                                    (int) (Math.random() * 70 + 60)
                            )
                    );
                }
            }
            //objects
            boolean player = false;
            for (int i = 0; i < this.objects.size(); i++) {
                Spaceship obj = this.objects.get(i);
                if (obj.equals(Game.gameManager.getSave().getPlayer())) {
                    obj.refresh(
                            new Point(Game.Mcontroler.mouse.x - this.screen.X_OFF, Game.Mcontroler.mouse.y - this.screen.Y_OFF)
                    );
                    player = true;
                } else {
                    obj.refreshAI();
                }
            }
            if (!player && this.playerSpawned) {
                playerDestroyed();
            }
            //text
            for (int i = 0; i < this.texts.size(); i++) {
                GraphicsText txt = this.texts.get(i);
                if (txt.refresh()) {
                    this.texts.remove(txt);
                }
            }
            //bullets
            for (int i = 0; i < this.bullets.size(); i++) {
                Bullet b = this.bullets.get(i);
                b.refresh();
                if (b.isOut(Game.GAMESIZE)) {
                    this.bullets.remove(b);
                }
            }
            //particles
            for (int i = 0; i < this.particles.size(); i++) {
                Particle p = this.particles.get(i);
                if (p == null) {
                    this.particles.remove(p);
                } else if (p.refresh()) {
                    this.particles.remove(p);
                }
            }
            //pressureWaves
            for (int i = 0; i < this.waves.size(); i++) {
                PressureWave p = this.waves.get(i);
                if (p.refresh()) {
                    this.waves.remove(p);
                }
            }
            //level manager
            int n = 0;
            for (int j = 0; j < this.objects.size(); j++) {
                if (this.objects.get(j) != Game.gameManager.getSave().getPlayer()) {
                    n++;
                }
            }
            Game.gameManager.getLevelManager().refresh(n);
            //screen moving
            if (player) {
                this.screen.refresh(
                        (int) Game.gameManager.getSave().getPlayer().getPosition().x,
                        (int) Game.gameManager.getSave().getPlayer().getPosition().y
                );
            }
            //collisions
            this.collisions.refresh();
            //bg
            float px = (float) (Math.random() * (-this.screen.X_OFF + this.getWidth()));
            float py = (float) (Math.random() * (-this.screen.Y_OFF + this.getHeight()));
            this.particles.add(
                    new Particle(
                            new FloatPoint(
                                    px,
                                    py
                            ),
                            new Color(160, 160, 220),
                            Game.RPS / 2,
                            (int) (Math.random() * 2 + 3),
                            (float) (Math.random() * 2f - 1f - Game.gameManager.getSave().getPlayer().getAccelerationX()),
                            (float) (Math.random() * 4f + 2f - Game.gameManager.getSave().getPlayer().getAccelerationY() / 2)
                    )
            );
        }
    }

    private void physics_menu() {
        if (Game.hubMenu.visibility) {
            String[] ia = new String[15];
            try {
                String[] info = Game.gameManager.getLevelManager().getLevel().TEXT.split(";");
                if (info.length > 1) {
                    String[] words = info[1].split(" ");
                    int i = 0;
                    ia[0] = "";
                    for (String word : words) {
                        ia[i] += word + " ";
                        if (ia[i].length() >= 20) {
                            i++;
                            ia[i] = "";
                        }
                    }
                }
            } catch (Exception ex) {
            }
            boolean end_level = !Game.gameManager.getLevelManager().getLevel().TEXT.equals(LevelIO.ENDLEVEL);
            for (Label l : Game.hubMenu.labels) {
                switch (l.ID) {
                    case 0:
                        String n = Game.gameManager.getSave().getPlayer().getName();
                        l.TEXT = "Name: " + Character.toUpperCase(n.charAt(0)) + n.substring(1);
                        break;
                    case 1:
                        if (Game.gameManager.getSave().getLevel() != 0) {
                            l.TEXT = "Level " + Game.gameManager.getSave().getLevel() + " completed";
                        } else {
                            l.TEXT = "You haven't played yet";
                        }
                        break;
                    case 2:
                        l.TEXT = Game.getDate();
                        if (l.TEXT.endsWith("00:00:00")) {
                            Game.messageMenu.visibility = true;
                            String date = new SimpleDateFormat("dd.MM.yyyy").format(new Date());
                            if (date.startsWith("01.01.")) {
                                Game.messageMenu.panels.get(1).TEXT = new String[]{
                                    "Info",
                                    "Happy new year",
                                    "A new day begins",
                                    "Today is " + date
                                };
                            } else {
                                Game.messageMenu.panels.get(1).TEXT = new String[]{
                                    "Info",
                                    "A new day begins",
                                    "Today is " + date
                                };
                            }
                            Game.x = Game.hubMenu;
                            Game.x.editable = false;
                        }
                        break;
                    case 5:
                        l.TEXT = "Total life: " + Game.gameManager.getSave().getPlayer().getTotalLife() + " HP";
                        break;
                    case 6:
                        l.TEXT = "Total mass: " + String.format("%.2f", Game.gameManager.getSave().getPlayer().getTotalMass()) + " t";
                        break;
                    case 7:
                        l.TEXT = "Blocks: " + Game.gameManager.getSave().getPlayer().getModel().size();
                        break;
                    case 8:
                        int comp = 0;
                        comp = Game.gameManager.getSave().getPlayer().getModel().stream().map((b) -> b.getType().getComplexity()).reduce(comp, Integer::sum);
                        l.TEXT = "Complexity: " + comp;
                        break;
                    case 9:
                        l.TEXT = "Guns: " + Game.gameManager.getSave().getPlayer().getGuns().size();
                        break;
                    case 10:
                        float td = 0;
                        List<Block> model = Game.gameManager.getSave().getPlayer().getModel();
                        td = model.stream().map((b) -> b.getType().getDamage()).reduce(td, (accumulator, _item) -> accumulator + _item);
                        l.TEXT = "Damage/s: " + String.format("%.2f", td);
                        break;
                    case 11:
                        int s = Game.gameManager.getSave().getTotalTime();
                        int h = 0,
                         m = 0;
                        while (s > 59) {
                            s -= 60;
                            m++;
                        }
                        while (m > 59) {
                            m -= 60;
                            h++;
                        }
                        l.TEXT = "Total game time: " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
                        break;
                    case 12:
                        l.TEXT = "Kills: " + Game.gameManager.getSave().getKills();
                        break;
                    case 13:
                        l.TEXT = "Deaths: " + Game.gameManager.getSave().getDeaths();
                        break;
                    case 14:
                        l.TEXT = "Total caused damage: " + Game.gameManager.getSave().getCausedDamage();
                        break;
                    case 15:
                        l.TEXT = "Total received damage: " + Game.gameManager.getSave().getReceivedDamage();
                        break;
                    case 16:
                        if (end_level) {
                            l.TEXT = "Name: " + Game.gameManager.getLevelManager().getLevel().TEXT.split(";")[0];
                        } else {
                            l.TEXT = "";
                        }
                        break;
                    case 17:
                        if (end_level) {
                            l.TEXT = "Level: " + (Game.gameManager.getSave().getLevel() + 1);
                        } else {
                            l.TEXT = "";
                        }
                        break;
                }
                if (l.ID >= 19) {
                    if (end_level) {
                        if (ia[l.ID - 19] != null) {
                            l.TEXT = ia[l.ID - 19];
                        }
                    } else {
                        l.TEXT = "";
                    }
                }
            }
        } else if (Game.mainMenu.visibility) {
            //bg
            float px = (float) (Math.random() * (-this.screen.X_OFF + this.getWidth()));
            float py = (float) (Math.random() * (-this.screen.Y_OFF + this.getHeight()));
            this.particles.add(
                    new Particle(
                            new FloatPoint(
                                    px,
                                    py
                            ),
                            new Color(160, 160, 220),
                            Game.RPS,
                            (int) (Math.random() * 2 + 2),
                            (float) (Math.random() * 2f - 1f),
                            (float) (Math.random() * 4f + 2f)
                    )
            );
            //particles
            for (int i = 0; i < this.particles.size(); i++) {
                Particle p = this.particles.get(i);
                if (p == null) {
                    this.particles.remove(p);
                } else if (p.refresh()) {
                    this.particles.remove(p);
                }
            }
        }
    }

    public EngineMode getEngineMode() {
        return this.engineMode;
    }

    public void setEngineMode(EngineMode mode) {
        this.engineMode = mode;
        switch (mode) {
            case INEDITOR:
                this.PperTick = 1e9 / 1;
                this.RperTick = 1e9 / 20;
                break;
            case INGAME:
                this.PperTick = 1e9 / this.RPS;
                this.RperTick = 1e9 / this.FPS;
                break;
            case INMENU:
            case LOADING:
                this.PperTick = 1e9 / 50;
                this.RperTick = 1e9 / 25;
                break;
        }
    }

    public final class Screen {

        private final float fsu = 0.07f, fsd = 0.085f, mx = 6.5f;
        public int X_OFF, Y_OFF;
        private float xAC, yAC;
        private int loading_c;

        public Screen() {
            this.xAC = 0;
            this.yAC = 0;
            goToPlayerSpawn();
        }

        private int Sx = 0, Sy = 0, St = 0, Sc = 0;

        public boolean loading = false;

        public void shake(int time, FloatPoint fp) {
            this.St = time;
            try {
                FloatPoint p = Game.gameManager.getSave().getPlayer().getPosition();
                this.Sx = (int) (Math.random() * 5 + 7) * (fp.x < p.x ? -1 : 1);
                this.Sy = (int) (Math.random() * 5 + 7) * (fp.y < p.y ? -1 : 1);
            } catch (Exception ex) {
                this.Sx = (int) (Math.random() * 5 + 7) * (Math.random() > 0.5 ? -1 : 1);
                this.Sy = (int) (Math.random() * 5 + 7) * (Math.random() > 0.5 ? -1 : 1);
            }
        }

        private float f = 0.0f, pf = 0.0f;
        private boolean b = false;
        private EngineMode em;

        public float getTransition() {
            return this.f > 1.0f ? 1.0f : (this.f < 0.0f ? 0.0f : this.f);
        }

        public void goToPlayerSpawn() {
            this.X_OFF = -Game.GAMESIZE.width / 2 + Game.engine.getWidth() / 2;
            this.Y_OFF = -(int) (Game.GAMESIZE.height * 0.85f) + Game.engine.getHeight() / 2;
            if (Game.engine.getHeight() - this.Y_OFF > Game.GAMESIZE.height) {
                this.Y_OFF = -Game.GAMESIZE.height + Game.engine.getHeight();
            }
            this.xAC = 0f;
            this.yAC = 0f;
        }

        public void refresh(int x, int y) {
            //centering
            int xTarget = -x + Game.engine.getWidth() / 2;
            int yTarget = -y + (int) (Game.engine.getHeight() * 0.7f);
            float x_ = xTarget - X_OFF;
            float y_ = yTarget - Y_OFF;
            float maxX = Math.abs(x_) <= 150 ? (Math.abs(x_) / 150) * mx : mx;
            float maxY = Math.abs(y_) <= 150 ? (Math.abs(y_) / 150) * mx : mx;
            if (maxX > maxY) {
                maxY *= Math.abs(y_ / x_);
            } else if (maxX < maxY) {
                maxX *= Math.abs(x_ / y_);
            }
            if (x_ > 0) {
                if (this.xAC < maxX) {
                    this.xAC += fsu;
                } else {
                    this.xAC -= fsd;
                }
            } else if (x_ < 0) {
                if (this.xAC > -maxX) {
                    this.xAC -= fsu;
                } else {
                    this.xAC += fsd;
                }
            }
            if (y_ > 0) {
                if (this.yAC < maxY) {
                    this.yAC += fsu;
                } else {
                    this.yAC -= fsd;
                }
            } else if (y_ < 0) {
                if (this.yAC > -maxY) {
                    this.yAC -= fsu;
                } else {
                    this.yAC += fsd;
                }
            }
            this.X_OFF += this.xAC;
            this.Y_OFF += this.yAC;
            if (this.X_OFF > 0) {
                this.X_OFF = 0;
            } else if (Game.engine.getWidth() - this.X_OFF > Game.GAMESIZE.width) {
                this.X_OFF = -Game.GAMESIZE.width + Game.engine.getWidth();
            }
            if (this.Y_OFF > 0) {
                this.Y_OFF = 0;
            } else if (Game.engine.getHeight() - this.Y_OFF > Game.GAMESIZE.height) {
                this.Y_OFF = -Game.GAMESIZE.height + Game.engine.getHeight();
            }
            //shaking
            if (this.St > 0) {
                this.St--;
                if (this.Sc > Game.RPS / 15) {
                    this.Sx *= -Math.random() * 0.2f + 0.7f;
                    this.Sy *= -Math.random() * 0.2f + 0.7f;
                    this.Sc = 0;
                } else {
                    this.Sc++;
                }
                this.X_OFF += this.Sx;
                this.Y_OFF += this.Sy;
            }
        }

        public void refresTransition() {
            if (this.pf != 0.0f) {
                this.f += this.b ? -this.pf : this.pf;
                if (this.f >= 1.0f) {
                    Game.engine.setEngineMode(this.em);
                    this.b = true;
                }
                if (this.f <= 0.0f && this.b) {
                    this.b = false;
                    this.pf = 0.0f;
                }
            }
        }

        public void refreshLoading() {
            //loading
            if (this.loading) {
                this.loading_c += 15;
                if (this.loading_c > 360) {
                    this.loading_c = 0;
                }
            }
        }

        public void createTransition(int time, EngineMode e) {
            this.pf = 1.0f / (time / 2f);
            this.em = e;
        }

    }

    public void clearAll() {
        this.objects.clear();
        this.bullets.clear();
        this.texts.clear();
    }

    public void playSound(String name) {
        SoundPlayer sp = this.sounds.get(name);
        if (sp != null) {
            sp.play();
        }
    }

    public void stopSound(String name) {
        SoundPlayer sp = this.sounds.get(name);
        if (sp != null) {
            sp.stop();
        }
    }

    public void closeSound(String name) {
        SoundPlayer sp = this.sounds.get(name);
        if (sp != null) {
            sp.close();
        }
    }

    public void playBgMusic() {
        //int rnd = Math.round((float) (Math.random() * 1f))+1;
        playSound("music1");
    }

    public void refreshVolumeFX() {
        this.sounds.get("shoot").setVolume(this.FX_volume);
        this.sounds.get("shoot_s").setVolume(this.FX_volume);
        this.sounds.get("shoot_p").setVolume(this.FX_volume);
        this.sounds.get("shoot_sh").setVolume(this.FX_volume);
        this.sounds.get("hit").setVolume(this.FX_volume);
        this.sounds.get("explode").setVolume(this.FX_volume);
        this.sounds.get("click").setVolume(this.FX_volume);
    }

    public void refreshVolumeMusic() {
        this.sounds.get("music1").setVolume(this.MUSIC_volume);
        Game.gameManager.getLevelManager().sounds.forEach((m) -> {
            try {
                this.sounds.get(m).setVolume(this.MUSIC_volume);
            } catch (Exception ex) {
            }
        });
    }

    public void addSound(String name, URL u, boolean repeating) {
        switch (name) {
            case "music1":
            case "shoot":
            case "shoot_s":
            case "shoot_p":
            case "shoot_sh":
            case "hit":
            case "explode":
            case "click":
                return;
        }
        this.sounds.put(name, new SoundPlayer(u, 1, repeating, this.MUSIC_volume));
    }

    public void removeSound(String name) {
        switch (name) {
            case "music1":
            case "shoot":
            case "shoot_s":
            case "shoot_p":
            case "shoot_sh":
            case "hit":
            case "explode":
            case "click":
                return;
        }
        this.sounds.get(name).close();
        this.sounds.remove(name);
    }

    public void spawnMeteorites(boolean fullscreen, int n) {
        if (fullscreen) {
            for (int i = 0; i < n; i++) {
                this.meteorites.add(
                        new Meteorite(
                                (int) (Game.GAMESIZE.width * (Math.random() * 0.8f + 0.1f)),
                                (int) (Game.GAMESIZE.height * (Math.random() * 0.8f + 0.1f)),
                                (int) (Math.random() * 70 + 40)
                        )
                );
            }
        } else {
            for (int i = 0; i < n; i++) {

            }
        }
    }

    private void playerDestroyed() {
        this.playerSpawned = false;
        Thread t = new Thread() {
            public void run() {
                Game.engine.screen.createTransition(Game.RPS * 2, EngineCore.EngineMode.INMENU);
                Tools.waitFor(EngineMode.INMENU);
                Game.gameManager.getSave().rebuilPlayer();
                Game.engine.screen.loading = true;
                Game.gameManager.getLevelManager().openLevel();
                Game.gameManager.getSave().getBattleStats().clear();
                Game.gameManager.getSave().getBattleStats().deaths = 1;
                Game.gameManager.getSave().getBattleStats().writeToGlobal();
                Game.engine.playSound("music1");
            }
        };
        t.start();
    }

}
