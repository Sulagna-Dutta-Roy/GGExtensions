/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Engine;

import SpaceCraft.Engine.EngineCore.EngineMode;
import SpaceCraft.Game;
import SpaceCraft.LevelIO;
import SpaceCraft.Menu.Button;
import SpaceCraft.Menu.Label;
import SpaceCraft.Menu.Menu;
import SpaceCraft.Menu.TextField;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Tools;
import java.awt.Point;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Krcma
 */
public class MouseControler implements MouseListener, MouseMotionListener, MouseWheelListener {

    public Point mouse;

    public MouseControler() {
        this.mouse = new Point();
    }

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
        Point pt = new Point((int) (e.getPoint().x / Game.XSCALE), (int) (e.getPoint().y / Game.YSCALE));
        //events
        if (Game.engine.getEngineMode() == EngineMode.INMENU) {
            /**
             * MENU MODE
             * ###########################################################################
             */
            if (Game.mainMenu.visibility && Game.mainMenu.editable) {
                for (Button b : Game.mainMenu.buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        switch (b.TEXT) {
                            case "new game":
                                Game.mainMenu.visibility = false;
                                Game.newGameMenu.visibility = true;
                                break;
                            case "load game":
                                Game.mainMenu.visibility = false;
                                Game.loadGameMenu.visibility = true;
                                Game.gameManager.loadAllSaves((int) Game.loadGameMenu.variables.get(0));
                                break;
                            case "information":
                                Game.mainMenu.visibility = false;
                                Game.infoMenu.visibility = true;
                                break;
                            case "sounds":
                                Game.soundMenu.labels.forEach((l) -> {
                                    if (l.ID == 0) {
                                        l.TEXT = (int) (Game.engine.FX_volume * 100) + "%";
                                    } else if (l.ID == 1) {
                                        l.TEXT = (int) (Game.engine.MUSIC_volume * 100) + "%";
                                    }
                                });
                                Game.soundMenu.visibility = true;
                                Game.x = Game.mainMenu;
                                Game.x.editable = false;
                                break;
                            case "exit":
                                String dtat = Game.engine.FX_volume + "," + Game.engine.MUSIC_volume;
                                try {
                                    BufferedWriter writer = new BufferedWriter(new FileWriter("data.dat"));
                                    writer.write(dtat);
                                    writer.flush();
                                    writer.close();
                                } catch (IOException ex) {
                                    Logger.getLogger(Game.class.getName()).log(Level.SEVERE, null, ex);
                                }
                                System.exit(0);
                                break;
                        }
                    }
                }
            } else if (Game.infoMenu.visibility && Game.infoMenu.editable) {
                for (Button b : Game.infoMenu.buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        switch (b.TEXT) {
                            case "back":
                                Game.mainMenu.visibility = true;
                                Game.infoMenu.visibility = false;
                                break;
                        }
                    }
                }
            } else if (Game.newGameMenu.visibility && Game.newGameMenu.editable) {
                for (Button b : Game.newGameMenu.buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        switch (b.TEXT) {
                            case "next":
                                if (Game.newGameMenu.textFields.get(0).TEXT.length() == 0) {
                                    Game.messageMenu.panels.get(1).TEXT = new String[]{
                                        "Alert",
                                        "You must have a name"
                                    };
                                    Game.messageMenu.visibility = true;
                                    Game.x = Game.newGameMenu;
                                    Game.x.editable = false;
                                    return;
                                }
                                Game.gameManager.createSave(Game.newGameMenu.textFields.get(0).TEXT, Game.newGameMenu.labels.get(2).TEXT);
                                Game.gameManager.getLevelManager().openLevel(); //open actual level
                                Game.hubMenu.visibility = true;
                                Game.newGameMenu.visibility = false;
                                Game.messageMenu.panels.get(1).TEXT = new String[]{
                                    "Info",
                                    "For first you must build your spaceship",
                                    "(press Edit) and then you can press",
                                    "Play for game"
                                };
                                Game.messageMenu.visibility = true;
                                Game.x = Game.hubMenu;
                                Game.x.editable = false;
                                Game.gameManager.refreshImagesInHubMenu();
                                return;
                            case "back":
                                Game.mainMenu.visibility = true;
                                Game.newGameMenu.visibility = false;
                                return;
                            case "<":
                                File[] arr = new File("levels").listFiles();
                                String last = arr[arr.length - 1].getName();
                                for (File f : arr) {
                                    if (f.getName().equals(Game.newGameMenu.labels.get(2).TEXT)) {
                                        Game.newGameMenu.labels.get(2).TEXT = last;
                                        return;
                                    }
                                    last = f.getName();
                                }
                                return;
                            case ">":
                                arr = new File("levels").listFiles();
                                boolean x = false;
                                for (File f : arr) {
                                    if (x) {
                                        Game.newGameMenu.labels.get(2).TEXT = f.getName();
                                        return;
                                    }
                                    if (f.getName().equals(Game.newGameMenu.labels.get(2).TEXT)) {
                                        x = true;
                                    }
                                }
                                return;
                        }
                    }
                }
                TextField t = Game.newGameMenu.textFields.get(0);
                t.selested = t.mouseOn(0, 0, pt);
            } else if (Game.loadGameMenu.visibility && Game.loadGameMenu.editable) {
                for (Button b : Game.loadGameMenu.buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        switch (b.TEXT) {
                            case "back":
                                Game.mainMenu.visibility = true;
                                Game.loadGameMenu.visibility = false;
                                return;
                            case ">":
                                int val = (int) Game.loadGameMenu.variables.get(0);
                                if (new File("save").list().length > val) {
                                    Game.loadGameMenu.variables.put(0, val + 6);
                                    Game.gameManager.loadAllSaves((int) Game.loadGameMenu.variables.get(0));
                                }
                                return;
                            case "<":
                                val = (int) Game.loadGameMenu.variables.get(0);
                                if (6 < val) {
                                    Game.loadGameMenu.variables.put(0, val - 6);
                                    Game.gameManager.loadAllSaves((int) Game.loadGameMenu.variables.get(0));
                                }
                                return;
                        }
                    }
                }
                for (Button b : Game.loadGameMenu.buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        for (Label l : Game.loadGameMenu.labels) {
                            if (b.ID == l.ID) {
                                if (b.TEXT.equals("Play")) {
                                    Game.gameManager.loadSave(new File("save/" + l.TEXT.substring(6)));
                                    Game.gameManager.getLevelManager().openLevel(); //open actual level
                                    Game.gameManager.refreshImagesInHubMenu();
                                    Game.loadGameMenu.visibility = false;
                                    Game.hubMenu.visibility = true;
                                    return;
                                } else if (b.TEXT.equals("Delete")) {
                                    new File("save/" + l.TEXT.substring(6)).delete();
                                    Game.gameManager.loadAllSaves((int) Game.loadGameMenu.variables.get(0));
                                    return;
                                }
                            }
                        }
                    }
                }
            } else if (Game.messageMenu.visibility && Game.messageMenu.editable) {
                Button b = Game.messageMenu.buttons.get(0);
                if (b.mouseOn(0, 0, pt)) {
                    Game.engine.playSound("click");
                    Game.messageMenu.visibility = false;
                    Game.x.editable = true;
                }
            } else if (Game.hubMenu.visibility && Game.hubMenu.editable) {
                for (Button b : Game.hubMenu.buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        switch (b.TEXT) {
                            case "Play game":
                                if (!Game.gameManager.getLevelManager().getLevel().TEXT.equals(LevelIO.ENDLEVEL)) {
                                    if (Tools.isModelOk(Game.gameManager.getSave().getPlayer())) {
                                        //run level
                                        if (Game.gameManager.getSave().getPlayerGuns().size() > 0) {
                                            Game.gameManager.getSave().gun = Game.gameManager.getSave().getPlayerGuns().get(0).getType();
                                        }
                                        Game.gameManager.lifeBar_Max();
                                        Game.engine.clearAll();
                                        Game.engine.screen.goToPlayerSpawn();
                                        Game.gameManager.getSave().getBattleStats().clear();
                                        Game.engine.screen.createTransition(Game.RPS, EngineMode.INGAME);
                                        Game.engine.stopSound("music1");
                                    } else {
                                        Game.messageMenu.panels.get(1).TEXT = new String[]{
                                            "Info",
                                            "Your spaceship isnt't completed, ",
                                            "it must have CPU block, engine and",
                                            "some gun."
                                        };
                                        Game.messageMenu.visibility = true;
                                        Game.x = Game.hubMenu;
                                        Game.x.editable = false;
                                    }
                                }
                                break;
                            case "Back to menu":
                                Game.mainMenu.visibility = true;
                                Game.hubMenu.visibility = false;
                                if (Game.gameManager.saveGame()) {
                                    Game.messageMenu.panels.get(1).TEXT = new String[]{
                                        "Info",
                                        "Game successfully saved"
                                    };
                                    Game.messageMenu.visibility = true;
                                    Game.x = Game.mainMenu;
                                    Game.x.editable = false;
                                } else {
                                    Game.messageMenu.panels.get(1).TEXT = new String[]{
                                        "Info",
                                        "Game wasn't saved successfully"
                                    };
                                    Game.messageMenu.visibility = true;
                                    Game.x = Game.mainMenu;
                                    Game.x.editable = false;
                                }
                                Game.gameManager.closeSave();
                                Game.engine.screen.X_OFF = 0;
                                Game.engine.screen.Y_OFF = 0;
                                break;
                            case "Edit":
                                //set editor mode
                                Game.engine.setEngineMode(EngineCore.EngineMode.INEDITOR);
                                //copy model for editing
                                Game.engine.getModelEditor().getSpaceship().buildModel(
                                        Tools.copyModel(Game.gameManager.getSave().getPlayer().getModel())
                                );
                                Game.gameManager.refreshEditorMenuStats();
                                Game.gameManager.refreshEditorMenuImages();
                                break;
                        }
                    }
                }
            } else if (Game.soundMenu.visibility && Game.soundMenu.editable) {
                for (Button b : Game.soundMenu.buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        switch (b.TEXT) {
                            case "Back":
                                Game.x.editable = true;
                                Game.soundMenu.visibility = false;
                                break;
                            case "<":
                                if (b.ID == 0) {
                                    Game.engine.FX_volume -= 0.05f;
                                    Game.engine.FX_volume = Math.max(Game.engine.FX_volume, 0.0f);
                                } else {
                                    Game.engine.MUSIC_volume -= 0.05f;
                                    Game.engine.MUSIC_volume = Math.max(Game.engine.MUSIC_volume, 0.0f);
                                    Game.engine.refreshVolumeMusic();
                                }
                                Game.soundMenu.labels.forEach((l) -> {
                                    if (l.ID == 0) {
                                        l.TEXT = (int) (Game.engine.FX_volume * 100) + "%";
                                    } else if (l.ID == 1) {
                                        l.TEXT = (int) (Game.engine.MUSIC_volume * 100) + "%";
                                    }
                                });
                                break;
                            case ">":
                                if (b.ID == 0) {
                                    Game.engine.FX_volume += 0.05f;
                                    Game.engine.FX_volume = Math.min(Game.engine.FX_volume, 1.0f);
                                } else {
                                    Game.engine.MUSIC_volume += 0.05f;
                                    Game.engine.MUSIC_volume = Math.min(Game.engine.MUSIC_volume, 1.0f);
                                    Game.engine.refreshVolumeMusic();
                                }
                                Game.soundMenu.labels.forEach((l) -> {
                                    if (l.ID == 0) {
                                        l.TEXT = (int) (Game.engine.FX_volume * 100) + "%";
                                    } else if (l.ID == 1) {
                                        l.TEXT = (int) (Game.engine.MUSIC_volume * 100) + "%";
                                    }
                                });
                                break;
                        }
                    }
                }
            }
        } else if (Game.engine.getEngineMode() == EngineMode.INEDITOR) {
            /**
             * EDITOR MODE
             * ###########################################################################
             */
            if (Game.engine.getModelEditor().getMenu().editable) {
                for (Button b : Game.engine.getModelEditor().getMenu().buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        switch (b.TEXT) {
                            case "Back":
                                //#################################################################
                                Game.engine.getModelEditor().getRemovedBlocks().forEach((y) -> {
                                    Game.gameManager.getSave().getInventory().getBlock(y, 1);
                                });
                                Game.engine.getModelEditor().getAddedBlocks().forEach((y) -> {
                                    Game.gameManager.getSave().getInventory().addBlock(y, 1);
                                });
                                Game.engine.getModelEditor().getRemovedBlocks().clear();
                                //#################################################################
                                Game.engine.setEngineMode(EngineCore.EngineMode.INMENU);
                                Game.hubMenu.visibility = true;
                                Game.gameManager.refreshImagesInHubMenu();
                                return;
                            case "Build last model":
                                //#################################################################
                                Game.engine.getModelEditor().getRemovedBlocks().forEach((y) -> {
                                    Game.gameManager.getSave().getInventory().getBlock(y, 1);
                                });
                                Game.engine.getModelEditor().getAddedBlocks().forEach((y) -> {
                                    Game.gameManager.getSave().getInventory().addBlock(y, 1);
                                });
                                Game.engine.getModelEditor().getRemovedBlocks().clear();
                                Game.engine.getModelEditor().getAddedBlocks().clear();
                                //#################################################################
                                //copy model for editing
                                Game.engine.getModelEditor().getSpaceship().buildModel(
                                        Tools.copyModel(Game.gameManager.getSave().getPlayer().getModel())
                                );
                                Game.gameManager.refreshEditorMenuStats();
                                return;
                            case "Clear":
                                for (Block c : Game.engine.getModelEditor().getSpaceship().getModel()) {
                                    //insert block to inventory
                                    Game.gameManager.getSave().getInventory().addBlock(c.getType(), 1);
                                    Game.engine.getModelEditor().getRemovedBlocks().add(c.getType());
                                }
                                Game.gameManager.refreshEditorMenuStats();
                                Game.engine.getModelEditor().getSpaceship().getModel().clear();
                                return;
                            case "Destroy groups":
                                List<Block> model = Game.engine.getModelEditor().getSpaceship().getModel();
                                List<Block> br = Tools.spaceshipBreakupTest(model);
                                br.forEach((x) -> {
                                    model.remove(x);
                                    //insert block to inventory
                                    Game.gameManager.getSave().getInventory().addBlock(x.getType(), 1);
                                    Game.engine.getModelEditor().getRemovedBlocks().add(x.getType());
                                });
                                Game.gameManager.refreshEditorMenuStats();
                                return;
                            case "Save model":
                                Game.engine.getModelEditor().getRemovedBlocks().clear();
                                Game.engine.getModelEditor().getAddedBlocks().clear();
                                model = Tools.copyModel(Game.engine.getModelEditor().getSpaceship().getModel());
                                br = Tools.spaceshipBreakupTest(model);
                                br.forEach((x) -> {
                                    model.remove(x);
                                    Game.engine.getModelEditor().getAddedBlocks().add(x.getType());
                                });
                                Game.gameManager.getSave().getPlayer().buildModel(model);
                                Game.gameManager.refreshEditorMenuImages();
                                return;
                            case "Shop":
                                Game.engine.getModelEditor().getShop().visibility = true;
                                Game.engine.getModelEditor().getMenu().editable = false;
                                Game.gameManager.refreshEditorShopStats();
                                return;
                            case "Instructions":
                                Game.engine.getModelEditor().getInstructions().visibility = true;
                                Game.engine.getModelEditor().getMenu().editable = false;
                                return;
                        }
                    }
                }
                int n = Game.gameManager.getSave().getInventory().getNumberOfBlocks(
                        Game.engine.getModelEditor().getBlockType()
                );
                switch (e.getButton()) {
                    case MouseEvent.BUTTON1:
                        //place block
                        if (n > 0) {
                            BlockType bt = Game.engine.getModelEditor().getBlockType();
                            //complexity limit [start]
                            try {
                                int comp = 0;
                                comp = Game.engine.getModelEditor().getSpaceship().getModel().stream().map((b) -> b.getType().getComplexity()).reduce(comp, Integer::sum);
                                comp += bt.getComplexity();
                                if (comp > Game.gameManager.getLevelManager().getLevel().getMaxComplexity()) {
                                    return;
                                }
                            } catch (Exception ex) {
                            }
                            //complexity limit [end]
                            //gun limit 3 [start]
                            List<Block> guns = Tools.getGuns(Game.engine.getModelEditor().getSpaceship());
                            if (guns.size() >= 3) {
                                if (Tools.isGun(bt)) {
                                    boolean b = true;
                                    for (Block gun : guns) {
                                        if (gun.getType() == bt) {
                                            b = false;
                                        }
                                    }
                                    if (b) {
                                        return;
                                    }
                                }
                            }
                            //gun limit 3 [end]
                            if (Game.engine.getModelEditor().placeBlock(pt)) {
                                Game.gameManager.getSave().getInventory().getBlock(bt, 1);
                                Game.engine.getModelEditor().getAddedBlocks().add(bt);
                            }
                            Game.gameManager.refreshEditorMenuStats();
                        }
                        return;
                    case MouseEvent.BUTTON2:
                        //remove block
                        //get block from inventory
                        Game.engine.getModelEditor().getBlock(pt);
                        Game.gameManager.refreshEditorMenuStats();
                        return;
                    case MouseEvent.BUTTON3:
                        //remove block from workspace
                        BlockType bt = Game.engine.getModelEditor().deleteBlock(pt);
                        //insert block to inventory
                        Game.gameManager.getSave().getInventory().addBlock(bt, 1);
                        Game.engine.getModelEditor().getRemovedBlocks().add(bt);
                        Game.gameManager.refreshEditorMenuStats();
                        break;
                    default:
                        break;
                }
            } else if (Game.engine.getModelEditor().getInstructions().visibility) {
                if (Game.engine.getModelEditor().getInstructions().buttons.get(0).mouseOn(0, 0, pt)) {
                    Game.engine.playSound("click");
                    Game.engine.getModelEditor().getInstructions().visibility = false;
                    Game.engine.getModelEditor().getMenu().editable = true;
                }
            } else if (Game.engine.getModelEditor().getShop().visibility) {
                for (Button b : Game.engine.getModelEditor().getShop().buttons) {
                    if (b.mouseOn(0, 0, pt)) {
                        Game.engine.playSound("click");
                        switch (b.TEXT) {
                            case "Back":
                                Game.engine.getModelEditor().getShop().visibility = false;
                                Game.engine.getModelEditor().getMenu().editable = true;
                                Game.gameManager.refreshEditorMenuStats();
                                break;
                        }
                        switch (b.ID) {
                            case 1:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.NORMAL);
                                break;
                            case 2:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.MEDIUM);
                                break;
                            case 3:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.HEAVY);
                                break;
                            case 4:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.LASER_GUN);
                                break;
                            case 5:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.DOUBLE_LASER_GUN);
                                break;
                            case 6:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.SNIPER_GUN);
                                break;
                            case 7:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.PLASMA_GUN);
                                break;
                            case 8:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.TRIPLE_GUN);
                                break;
                            case 9:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.ENGINE_BLOCK);
                                break;
                            case 10:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.HEALING_BLOCK);
                                break;
                            case 11:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.SHIELD_BLOCK);
                                break;
                            case 12:
                                Game.gameManager.getSave().getInventory().buyBlock(BlockType.SHOTGUN);
                                break;
                        }
                        Game.gameManager.refreshEditorShopStats();
                    }
                }
            }
        } else if (Game.engine.getEngineMode() == EngineMode.INGAME) {
            if (e.getButton() == MouseEvent.BUTTON1) {
                if (!Game.escMenu.visibility) {
                    Game.gameManager.getSave().getPlayer().shoot(Game.gameManager.getSave().gun);
                } else {
                    for (Button b : Game.escMenu.buttons) {
                        if (b.mouseOn(0, 0, e.getPoint())) {
                            Game.engine.playSound("click");
                            switch (b.TEXT) {
                                case "Back":
                                    Game.engine.refreshVolumeFX();
                                    Game.escMenu.visibility = false;
                                    break;
                                case "Back to menu":
                                    Game.engine.refreshVolumeFX();
                                    Game.engine.screen.createTransition(Game.RPS, EngineMode.INMENU);
                                    Tools.waitFor(EngineMode.INMENU);
                                    Game.gameManager.getSave().rebuilPlayer();
                                    Game.gameManager.getLevelManager().openLevel(); //open actual level
                                    Game.escMenu.visibility = false;
                                    Game.hubMenu.visibility = true;
                                    Game.gameManager.refreshImagesInHubMenu();
                                    Game.engine.playSound("music1");
                                    break;
                                case "<":
                                    if (b.ID == 0) {
                                        Game.engine.FX_volume -= 0.05f;
                                        Game.engine.FX_volume = Math.max(Game.engine.FX_volume, 0.0f);
                                    } else {
                                        Game.engine.MUSIC_volume -= 0.05f;
                                        Game.engine.MUSIC_volume = Math.max(Game.engine.MUSIC_volume, 0.0f);
                                        Game.engine.refreshVolumeMusic();
                                    }
                                    Game.escMenu.labels.forEach((l) -> {
                                        if (l.ID == 0) {
                                            l.TEXT = (int) (Game.engine.FX_volume * 100) + "%";
                                        } else if (l.ID == 1) {
                                            l.TEXT = (int) (Game.engine.MUSIC_volume * 100) + "%";
                                        }
                                    });
                                    break;
                                case ">":
                                    if (b.ID == 0) {
                                        Game.engine.FX_volume += 0.05f;
                                        Game.engine.FX_volume = Math.min(Game.engine.FX_volume, 1.0f);
                                    } else {
                                        Game.engine.MUSIC_volume += 0.05f;
                                        Game.engine.MUSIC_volume = Math.min(Game.engine.MUSIC_volume, 1.0f);
                                        Game.engine.refreshVolumeMusic();
                                    }
                                    Game.escMenu.labels.forEach((l) -> {
                                        if (l.ID == 0) {
                                            l.TEXT = (int) (Game.engine.FX_volume * 100) + "%";
                                        } else if (l.ID == 1) {
                                            l.TEXT = (int) (Game.engine.MUSIC_volume * 100) + "%";
                                        }
                                    });
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void mouseDragged(MouseEvent e) {
    }

    long lastTime = 0;

    @Override
    public void mouseMoved(MouseEvent e) {
        Point pt = new Point((int) (e.getPoint().x / Game.XSCALE), (int) (e.getPoint().y / Game.YSCALE));
        if (System.nanoTime() - this.lastTime > 20000000) {
            this.lastTime = System.nanoTime();
            if (Game.engine.getEngineMode() == EngineMode.INMENU) {
                try {
                    if (Game.mainMenu.visibility && Game.mainMenu.editable) {
                        buttonRef(Game.mainMenu, pt);
                    } else if (Game.infoMenu.visibility && Game.infoMenu.editable) {
                        buttonRef(Game.infoMenu, pt);
                    } else if (Game.newGameMenu.visibility && Game.newGameMenu.editable) {
                        buttonRef(Game.newGameMenu, pt);
                    } else if (Game.loadGameMenu.visibility && Game.loadGameMenu.editable) {
                        buttonRef(Game.loadGameMenu, pt);
                    } else if (Game.messageMenu.visibility && Game.messageMenu.editable) {
                        buttonRef(Game.messageMenu, pt);
                    } else if (Game.hubMenu.visibility && Game.hubMenu.editable) {
                        buttonRef(Game.hubMenu, pt);
                    } else if (Game.soundMenu.visibility && Game.soundMenu.editable) {
                        buttonRef(Game.soundMenu, pt);
                    }
                } catch (Exception ex) {
                }
            } else if (Game.engine.getEngineMode() == EngineMode.INEDITOR) {
                if (Game.engine.getModelEditor().getMenu().editable) {
                    buttonRef(Game.engine.getModelEditor().getMenu(), pt);
                } else if (Game.engine.getModelEditor().getShop().visibility) {
                    buttonRef(Game.engine.getModelEditor().getShop(), pt);
                } else if (Game.engine.getModelEditor().getInstructions().visibility) {
                    buttonRef(Game.engine.getModelEditor().getShop(), pt);
                }
            } else {
                this.mouse = e.getPoint();
                if (Game.escMenu.visibility) {
                    buttonRef(Game.escMenu, e.getPoint());
                }
            }
        }
    }

    @Override
    public void mouseWheelMoved(MouseWheelEvent e) {
        if (Game.engine.getEngineMode() == EngineMode.INEDITOR) {
            if (e.getWheelRotation() > 0) {
                if (e.isControlDown()) {
                    Game.engine.getModelEditor().nextColor();
                } else {
                    Game.engine.getModelEditor().nextBlockType();
                }
            } else if (e.getWheelRotation() < 0) {
                if (e.isControlDown()) {
                    Game.engine.getModelEditor().lastColor();
                } else {
                    Game.engine.getModelEditor().lastBlockType();
                }
            }
            Game.gameManager.refreshEditorMenuStats();
        }
    }

    private void buttonRef(Menu m, Point p) {
        m.buttons.forEach((b) -> {
            if (b.mouseOn(0, 0, p)) {
                b.mouseIn();
            } else {
                b.mouseOut();
            }
        });
    }

}
