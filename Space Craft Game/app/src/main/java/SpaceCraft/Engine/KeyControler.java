/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Engine;

import SpaceCraft.Engine.EngineCore.EngineMode;
import SpaceCraft.Game;
import SpaceCraft.Menu.TextField;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

/**
 *
 * @author Krcma
 */
public class KeyControler implements KeyListener {

    @Override
    public void keyTyped(KeyEvent e) {

    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (Game.engine.getEngineMode() == EngineMode.INGAME) {
            if (e.getKeyCode() == KeyEvent.VK_Q || e.getKeyCode() == KeyEvent.VK_W || e.getKeyCode() == KeyEvent.VK_Q) {
                Game.gameManager.getSave().getPlayer().getGuns();
            }
            switch (e.getKeyCode()) {
                case KeyEvent.VK_Q:
                    if (Game.gameManager.getSave().getPlayerGuns().size() > 0) {
                        Game.gameManager.getSave().gun = Game.gameManager.getSave().getPlayerGuns().get(0).getType();
                    }
                    break;
                case KeyEvent.VK_W:
                    if (Game.gameManager.getSave().getPlayerGuns().size() > 1) {
                        Game.gameManager.getSave().gun = Game.gameManager.getSave().getPlayerGuns().get(1).getType();
                    }
                    break;
                case KeyEvent.VK_E:
                    if (Game.gameManager.getSave().getPlayerGuns().size() > 2) {
                        Game.gameManager.getSave().gun = Game.gameManager.getSave().getPlayerGuns().get(2).getType();
                    }
                    break;
                case KeyEvent.VK_ESCAPE:
                    Game.escMenu.visibility = !Game.escMenu.visibility;
                    if (Game.escMenu.visibility) {
                        Game.escMenu.labels.forEach((l) -> {
                            if (l.ID == 0) {
                                l.TEXT = (int) (Game.engine.FX_volume * 100) + "%";
                            } else if (l.ID == 1) {
                                l.TEXT = (int) (Game.engine.MUSIC_volume * 100) + "%";
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        } else if (Game.engine.getEngineMode() == EngineMode.INMENU) {
            if (Game.newGameMenu.visibility) {
                TextField t = Game.newGameMenu.textFields.get(0);
                if (t.selested) {
                    if (e.getKeyCode() == KeyEvent.VK_BACK_SPACE) {
                        if (t.TEXT.length() > 0) {
                            t.TEXT = t.TEXT.substring(0, t.TEXT.length() - 1);
                        }
                    } else {
                        if (t.TEXT.length() < 19) {
                            char c = Character.toLowerCase(e.getKeyChar());
                            if ((int) c >= 97 && (int) c <= 121) {
                                t.TEXT += c;
                            }
                        }
                    }
                }
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (Game.engine.getEngineMode() == EngineMode.INGAME) {
            //!!!!!!!!!
        }
    }

}
