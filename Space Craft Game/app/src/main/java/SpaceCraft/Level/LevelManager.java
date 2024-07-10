/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Level;

import SpaceCraft.Engine.EngineCore;
import SpaceCraft.Engine.EngineCore.EngineMode;
import SpaceCraft.Engine.GameManager;
import SpaceCraft.FloatPoint;
import SpaceCraft.Game;
import SpaceCraft.LevelIO;
import SpaceCraft.ModelIO;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.GraphicsText;
import SpaceCraft.Object.Spaceship.Spaceship;
import SpaceCraft.Tools;
import java.awt.Color;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Krcma
 */
public class LevelManager {

    private int WAIT_TIME = 0, TIME = 0;
    private boolean WFDE = false;

    private final GameManager gm;

    private Level level;

    private boolean b = true;

    public final List<String> sounds;

    public LevelManager(GameManager gm) {
        this.level = null;
        this.gm = gm;
        this.sounds = new ArrayList<>();
    }

    public void openLevel() {
        Game.engine.screen.loading = true;
        this.level = LevelIO.read(new File("levels/" + Game.gameManager.getSave().getGameDir() + "/level" + gm.getSave().getLevel() + ".scl"));
        this.WAIT_TIME = 0;
        this.TIME = 0;
        this.WFDE = false;
        this.b = true;
        //remove all sounds
        this.sounds.forEach((s) -> {
            Game.engine.removeSound(s);
        });
        this.sounds.clear();
        //add all sounds
        for (String command : this.level.commands) {
            try {
                String[] c = command.split(" ");
                if (c[0].equals("play_music")) {
                    boolean x = true;
                    for (String s : this.sounds) {
                        if (s.equals(c[1])) {
                            x = false;
                            break;
                        }
                    }
                    if (x) {
                        this.sounds.add(c[1]);
                        Game.engine.addSound(
                                c[1],
                                new File("sounds/" + Game.gameManager.getSave().getGameDir() + "/" + c[2]).toURL(),
                                c[3].equals("TRUE")
                        );
                    }
                }
            } catch (Exception ex) {
            }
        }
        Game.engine.screen.loading = false;
    }

    public void refresh(int numberOfObjects) {
        //waiting
        if (this.WFDE) {
            if (numberOfObjects == 0) {
                this.WFDE = false;
            } else {
                return;
            }
        }
        if (this.WAIT_TIME > this.TIME) {
            this.TIME++;
            return;
        }
        //level end
        if (this.level.commands.isEmpty() && this.b) {
            Thread t = new Thread() {
                public void run() {
                    boolean b = true;
                    for (int j = 0; j < Game.engine.objects.size(); j++) {
                        Spaceship s = Game.engine.objects.get(j);
                        if (s == Game.gameManager.getSave().getPlayer()) {
                            b = false;
                            break;
                        }
                    }
                    if (b) {
                        return;
                    }
                    Game.engine.screen.createTransition(Game.RPS * 2, EngineCore.EngineMode.INMENU);
                    Tools.waitFor(EngineMode.INMENU);
                    Game.hubMenu.visibility = true;
                    Game.gameManager.getSave().getBattleStats().writeToGlobal();
                    Game.gameManager.getSave().rebuilPlayer();
                    Game.messageMenu.panels.get(1).TEXT = new String[]{
                        "Info",
                        "You have finished level" + (Game.gameManager.getSave().getLevel() + 1)
                    };
                    Game.messageMenu.visibility = true;
                    Game.x = Game.hubMenu;
                    Game.x.editable = false;
                    Game.gameManager.getSave().setLevel(Game.gameManager.getSave().getLevel() + 1);
                    Game.gameManager.getLevelManager().openLevel();
                    if (Game.gameManager.getLevelManager().getLevel().TEXT.equals(LevelIO.ENDLEVEL)) {
                        Game.messageMenu.panels.get(1).TEXT = new String[]{
                            "Info",
                            "You have completed this campaign"
                        };
                    }
                    Game.gameManager.refreshImagesInHubMenu();
                    Game.messageMenu.visibility = true;
                    Game.x = Game.hubMenu;
                    Game.x.editable = false;
                    //stop all sounds
                    sounds.forEach((s) -> {
                        Game.engine.stopSound(s);
                    });
                    //play bg music
                    Game.engine.playSound("music1");
                }
            };
            t.start();
            this.b = false;
        }
        //commands
        String[] command = this.level.getCommand().split(" ");
        switch (command[0]) {
            case "kill":
                switch (command[0]) {
                    case "ALL":
                        Game.engine.objects.clear();
                        break;
                    case "ENEMIES":
                        Game.engine.objects.stream().filter((o) -> (o != Game.gameManager.getSave().getPlayer())).forEachOrdered((o) -> {
                            Game.engine.objects.remove(o);
                        });
                        break;
                    case "PLAYER":
                        Game.engine.objects.remove(Game.gameManager.getSave().getPlayer());
                        break;
                }
                break;
            case "spawn":
                Spaceship s = new Spaceship(
                        command[1],
                        new FloatPoint(0, 0),
                        false
                );
                List<Block> model = ModelIO.read(new File("models/" + Game.gameManager.getSave().getGameDir() + "/" + command[3]));
                Tools.rotateModel(model);   //rotate model because this is enemy
                s.buildModel(model);
                s.setPosition(new FloatPoint(
                        (Game.GAMESIZE.width / 5f) * Integer.parseInt(command[2]) + Game.GAMESIZE.width / 2,
                        -s.getSafeRange() - 50)
                );
                s.INCOMING = true;
                Game.engine.objects.add(s);
                break;
            case "text":
                String text = "";
                for (int i = 6; i < command.length; i++) {
                    if (i + 1 == command.length) {
                        text += command[i];
                    } else {
                        text += command[i] + " ";
                    }
                }
                Game.engine.texts.add(
                        new GraphicsText(
                                text,
                                Integer.parseInt(command[1]) * Game.engine.getSize().width / 10 + Game.engine.getSize().width / 2,
                                Integer.parseInt(command[2]) * Game.engine.getSize().height / 10 + Game.engine.getSize().height / 2,
                                Integer.parseInt(command[4]),
                                Integer.parseInt(command[5]) * Game.RPS,
                                new Color(
                                        Integer.parseInt(command[3].split(",")[0]),
                                        Integer.parseInt(command[3].split(",")[1]),
                                        Integer.parseInt(command[3].split(",")[2])
                                )
                        )
                );
                break;
            case "player":
                Game.engine.playerSpawned = true;
                Game.gameManager.getSave().getPlayer().setPosition(new FloatPoint(Game.GAMESIZE.width / 2, Game.GAMESIZE.height * 1.25f));
                Game.gameManager.getSave().getPlayer().INCOMING = true;
                Game.engine.objects.add(Game.gameManager.getSave().getPlayer());
                break;
            case "wait":
                this.TIME = 0;
                this.WAIT_TIME = Integer.parseInt(command[1]) * Game.RPS;
                break;
            case "wfde":
                this.WFDE = true;
                break;
            case "play_music":
                Game.engine.playSound(command[1]);
                break;
            case "stop_music":
                Game.engine.stopSound(command[1]);
                break;
        }

        this.level.nextCommand();
    }

    public Level getLevel() {
        return this.level;
    }

}
