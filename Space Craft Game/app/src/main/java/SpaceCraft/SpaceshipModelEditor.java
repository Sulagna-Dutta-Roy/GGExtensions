/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Block.BlockBuilder;
import SpaceCraft.Object.Block.BlockType;
import SpaceCraft.Object.Bullet.BulletType;
import SpaceCraft.Object.Spaceship.Spaceship;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Toolkit;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.swing.ImageIcon;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import javax.swing.filechooser.FileNameExtensionFilter;

/**
 *
 * @author Krcma
 */
public class SpaceshipModelEditor extends javax.swing.JFrame {
    
    private final Color[] color_list = new Color[]{
        Color.GREEN,
        Color.BLUE,
        Color.RED,
        Color.DARK_GRAY,
        Color.CYAN,
        Color.YELLOW,
        Color.PINK,
        Color.MAGENTA,
        Color.ORANGE
    };
    
    private List<Block> model;
    private Spaceship spaceship;
    
    private Color block_color = Color.GREEN;
    private BlockType block_type = BlockType.NORMAL;

    /**
     * Normal -> 15 Boss -> 21
     */
    public final int blocks_per_line;

    /**
     * Creates new form PlaneModelEditor
     *
     * @param blocks_per_line
     */
    public SpaceshipModelEditor(int blocks_per_line) {
        this.blocks_per_line = blocks_per_line;
        initComponents();
        this.setIconImage(new ImageIcon(this.getClass().getResource("/Editor.png")).getImage());

        //resize
        int x = this.getWidth() - this.canvas1.getWidth();
        int y = this.getHeight() - this.canvas1.getHeight();
        int w = Block.SIZE * blocks_per_line;
        this.setSize(
                new Dimension(
                        x + w,
                        y + w + 70
                )
        );
        this.canvas1.setSize(new Dimension(w, w + 70));
        this.canvas1.setPreferredSize(new Dimension(w, w + 70));
        this.canvas1.setMinimumSize(new Dimension(w, w + 70));
        //show on center of screen
        Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
        this.setLocation(
                (int) ((screen.getWidth() - this.getWidth()) / 2f),
                (int) ((screen.getHeight() - this.getHeight()) / 2f)
        );
        //create blocks
        this.model = new ArrayList<>();
        //create plane
        this.spaceship = new Spaceship("", new FloatPoint(this.canvas1.getWidth() / 2f, (this.canvas1.getHeight() - 70) / 2f), true);
        //canvas render thread
        this.canvas1.createBufferStrategy(3);
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        Graphics2D g2 = (Graphics2D) canvas1.getBufferStrategy().getDrawGraphics();
                        g2.setColor(new Color(90, 90, 80));
                        g2.fillRect(0, 0, canvas1.getWidth(), canvas1.getHeight());
                        render_loop(g2);
                        canvas1.getBufferStrategy().show();
                        Thread.sleep(20);
                    } catch (Exception ex) {
                    }
                }
            }
        });
        t.start();
        //set Wimdows design
        try {
            UIManager.setLookAndFeel(
                    UIManager.getInstalledLookAndFeels()[3].getClassName());
            SwingUtilities.updateComponentTreeUI(this);
        } catch (ClassNotFoundException | IllegalAccessException | InstantiationException | UnsupportedLookAndFeelException e) {
        }
    }
    
    private void render_loop(Graphics2D g2) {
        //draw grid
        g2.setStroke(new BasicStroke(1));
        g2.setColor(new Color(30, 30, 20));
        float step = Block.SIZE;
        for (int j = 1; j <= blocks_per_line; j++) {
            g2.drawLine(0, (int) (j * step), this.canvas1.getWidth(), (int) (j * step));
            g2.drawLine((int) (j * step), 0, (int) (j * step), this.canvas1.getHeight() - 70);
        }
        //draw (model)
        this.spaceship.render(g2, 0, 0);
        //draw info bar
        g2.setColor(new Color(60, 60, 50));
        g2.fillRect(0, this.canvas1.getHeight() - 70, this.canvas1.getWidth(), 70);
        g2.setColor(Color.WHITE);
        g2.setFont(new Font("Tahoma", Font.BOLD, 18));
        g2.drawString("Actual block:", 10, this.canvas1.getHeight() - 50);
        BufferedImage img = new BufferedImage((int) (Block.SIZE * 1.6), (int) (Block.SIZE * 1.7), BufferedImage.TYPE_4BYTE_ABGR);
        Block b = BlockBuilder.getBlock(new Point((int) (Block.SIZE * 0.3), (int) (Block.SIZE * 0.6)), this.block_color, this.block_type);
        b.render((Graphics2D) img.getGraphics(), true, false, 0, 0);
        b.render((Graphics2D) img.getGraphics(), true, true, 0, 0);
        g2.setFont(new Font("Tahoma", Font.BOLD, 13));
        g2.drawString(b.getType().getName(), 10, this.canvas1.getHeight() - 25);
        int xx = 135;
        g2.drawImage(img, xx, this.canvas1.getHeight() - 60, this);
        xx += img.getWidth() + 10;
        g2.drawString("Life: " + b.getLife() + "HP", xx, this.canvas1.getHeight() - 50);
        g2.drawString("Mass: " + b.getMass() + "t", xx, this.canvas1.getHeight() - 30);
        int dmg = -1;
        switch (b.getType()) {
            case LASER_GUN:
            case DOUBLE_LASER_GUN:
                dmg = BulletType.SMALL.getDamage();
                break;
            case TRIPLE_GUN:
                dmg = BulletType.MEDIUM.getDamage();
                break;
            case PLASMA_GUN:
                dmg = BulletType.PLASMA.getDamage();
                break;
            case SNIPER_GUN:
                dmg = BulletType.SNIPER.getDamage();
                break;
            default:
                break;
        }
        if (dmg != -1) {
            g2.drawString("Damage: " + dmg, xx, this.canvas1.getHeight() - 10);
        } else {
            if (b.getType() == BlockType.SHIELD_BLOCK) {
                g2.drawString("Can absorbate 100 dmg", xx, this.canvas1.getHeight() - 10);
            } else if (b.getType() == BlockType.HEALING_BLOCK) {
                g2.drawString("Add 1 HP per second", xx, this.canvas1.getHeight() - 10);
            }
        }
        xx += 20 + Math.max(
                g2.getFontMetrics().stringWidth("Life: " + b.getLife() + "HP"),
                g2.getFontMetrics().stringWidth("Mass: " + b.getMass() + "t")
        );

        //draw cross
        g2.setStroke(new BasicStroke(1));
        g2.setColor(Color.black);
        g2.drawLine(
                (int) (this.canvas1.getWidth() / 2f - step / 4f),
                (int) ((this.canvas1.getHeight() - 70) / 2f),
                (int) (this.canvas1.getWidth() / 2f + step / 4f),
                (int) ((this.canvas1.getHeight() - 70) / 2f)
        );
        g2.drawLine(
                (int) (this.canvas1.getWidth() / 2f),
                (int) ((this.canvas1.getHeight() - 70) / 2f - step / 4f),
                (int) (this.canvas1.getWidth() / 2f),
                (int) ((this.canvas1.getHeight() - 70) / 2f + step / 4f)
        );
        g2.setColor(Color.white);
        g2.drawString("Total life: " + this.spaceship.getTotalLife(), 5, 15);
        g2.drawString("Total mass: " + this.spaceship.getTotalMass(), 5, 35);
        int c = 0;
        c = this.spaceship.getModel().stream().map((x) -> x.getType().getComplexity()).reduce(c, Integer::sum);
        g2.drawString("Total complexity: " + c, (int) (this.canvas1.getWidth()*0.6), 15);
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        canvas1 = new java.awt.Canvas();
        jMenuBar1 = new javax.swing.JMenuBar();
        jMenu1 = new javax.swing.JMenu();
        jMenuItem1 = new javax.swing.JMenuItem();
        jMenuItem2 = new javax.swing.JMenuItem();
        jMenuItem3 = new javax.swing.JMenuItem();
        jMenu2 = new javax.swing.JMenu();
        jMenuItem5 = new javax.swing.JMenuItem();
        jMenuItem6 = new javax.swing.JMenuItem();
        jMenuItem7 = new javax.swing.JMenuItem();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Spaceship Model Editor");
        setResizable(false);

        canvas1.setName(""); // NOI18N
        canvas1.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mousePressed(java.awt.event.MouseEvent evt) {
                canvas1MousePressed(evt);
            }
        });
        canvas1.addMouseWheelListener(new java.awt.event.MouseWheelListener() {
            public void mouseWheelMoved(java.awt.event.MouseWheelEvent evt) {
                canvas1MouseWheelMoved(evt);
            }
        });
        canvas1.addKeyListener(new java.awt.event.KeyAdapter() {
            public void keyPressed(java.awt.event.KeyEvent evt) {
                canvas1KeyPressed(evt);
            }
        });

        jMenu1.setText("File");
        jMenu1.setFont(new java.awt.Font("Segoe UI", 0, 12)); // NOI18N

        jMenuItem1.setText("Save model");
        jMenuItem1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem1ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem1);

        jMenuItem2.setText("Open model");
        jMenuItem2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem2ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem2);

        jMenuItem3.setText("Clear");
        jMenuItem3.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem3ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem3);

        jMenuBar1.add(jMenu1);

        jMenu2.setText("Help");

        jMenuItem5.setText("About");
        jMenuItem5.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem5ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem5);

        jMenuItem6.setText("Info");
        jMenuItem6.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem6ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem6);

        jMenuItem7.setText("Spaceship breakeup test");
        jMenuItem7.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem7ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem7);

        jMenuBar1.add(jMenu2);

        setJMenuBar(jMenuBar1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(canvas1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(canvas1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void canvas1KeyPressed(java.awt.event.KeyEvent evt) {//GEN-FIRST:event_canvas1KeyPressed

    }//GEN-LAST:event_canvas1KeyPressed

    private void canvas1MousePressed(java.awt.event.MouseEvent evt) {//GEN-FIRST:event_canvas1MousePressed
        
        Point seg = new Point(0, 0);
        int w = evt.getX();
        while (w > Block.SIZE) {
            w -= Block.SIZE;
            seg.x++;
        }
        w = evt.getY();
        while (w > Block.SIZE) {
            w -= Block.SIZE;
            seg.y++;
        }
        seg.x -= (blocks_per_line - 1) / 2;
        seg.y -= (blocks_per_line - 1) / 2;
        seg.x *= Block.SIZE;
        seg.y *= Block.SIZE;
        seg.x -= Block.SIZE / 2;
        seg.y -= Block.SIZE / 2;

        //place
        if (evt.getButton() == MouseEvent.BUTTON1) {
            boolean b = true;
            for (Block block : this.model) {
                if (block.getOffset().equals(seg)) {
                    b = false;
                    break;
                }
            }
            if (b) {
                this.model.add(
                        BlockBuilder.getBlock(
                                seg,
                                this.block_color,
                                this.block_type
                        )
                );
            }
            this.spaceship.buildModel(this.model);
        }
        //delete
        if (evt.getButton() == MouseEvent.BUTTON3) {
            for (Block block : this.model) {
                if (block.getOffset().equals(seg)) {
                    model.remove(block);
                    this.spaceship.buildModel(this.model);
                    break;
                }
            }
        }
        //get block
        if (evt.getButton() == MouseEvent.BUTTON2) {
            for (Block block : this.model) {
                if (block.getOffset().equals(seg)) {
                    this.block_type = block.getType();
                    this.block_color = block.getColor();
                    break;
                }
            }
        }
    }//GEN-LAST:event_canvas1MousePressed

    private void canvas1MouseWheelMoved(java.awt.event.MouseWheelEvent evt) {//GEN-FIRST:event_canvas1MouseWheelMoved
        if (evt.isControlDown()) {
            //changing color of block
            if (evt.getWheelRotation() > 0) {
                int n = 0;
                for (int i = 0; i < this.color_list.length; i++) {
                    Color c = (Color) this.color_list[i];
                    if (c.equals(this.block_color)) {
                        i++;
                        n = i < this.color_list.length ? i : 0;
                        break;
                    }
                }
                this.block_color = this.color_list[n];
            }
            if (evt.getWheelRotation() < 0) {
                int n = 0;
                for (int i = 0; i < this.color_list.length; i++) {
                    Color c = (Color) this.color_list[i];
                    if (c.equals(this.block_color)) {
                        i--;
                        n = i >= 0 ? i : this.color_list.length - 1;
                        break;
                    }
                }
                this.block_color = this.color_list[n];
            }
        } else {
            //changing block type
            if (evt.getWheelRotation() > 0) {
                if (this.block_type.getID() < 12) {
                    this.block_type = BlockType.getBlockWithID(this.block_type.getID() + 1);
                } else {
                    this.block_type = BlockType.getBlockWithID(0);
                }
            }
            if (evt.getWheelRotation() < 0) {
                if (this.block_type.getID() > 0) {
                    this.block_type = BlockType.getBlockWithID(this.block_type.getID() - 1);
                } else {
                    this.block_type = BlockType.getBlockWithID(12);
                }
            }
        }
    }//GEN-LAST:event_canvas1MouseWheelMoved

    private void jMenuItem1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem1ActionPerformed
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(new FileNameExtensionFilter("SpaceCraft model", "scm"));
        if (fileChooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            if (fileChooser.getSelectedFile().toString().endsWith(".scm")) {
                ModelIO.write(this.model, fileChooser.getSelectedFile());
            } else {
                ModelIO.write(this.model, new File(fileChooser.getSelectedFile().toString() + ".scm"));
            }
        }
    }//GEN-LAST:event_jMenuItem1ActionPerformed

    private void jMenuItem2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem2ActionPerformed
        try {
            JFileChooser fileChooser = new JFileChooser();
            fileChooser.setFileFilter(new FileNameExtensionFilter("SpaceCraft model", "scm"));
            if (fileChooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
                this.model = ModelIO.read(fileChooser.getSelectedFile());
                this.spaceship.buildModel(this.model);
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "This model is broken.");
        }
    }//GEN-LAST:event_jMenuItem2ActionPerformed

    private void jMenuItem3ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem3ActionPerformed
        this.model.clear();
        this.spaceship.buildModel(this.model);
    }//GEN-LAST:event_jMenuItem3ActionPerformed

    private void jMenuItem5ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem5ActionPerformed
        JOptionPane.showMessageDialog(this, "Spaceship Model Editor\nIn this program you can make new model of plane or edit exist model.\nCreated by " + Game.author);
    }//GEN-LAST:event_jMenuItem5ActionPerformed

    private void jMenuItem6ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem6ActionPerformed
        JOptionPane.showMessageDialog(this, "Contor:\nLeft mouse - Place block\nRight mouse - Remove block\nMiddle mouse - Get block from workspace\nMouse wheel - Change block type\nMouse wheel + ctrl - Color of block\nRules:\nPlane must hava CPU block\nEvery plane must have engine for moving\nIn your plane you must hava guns\nBlock of plane mus be in group (no islands)");
    }//GEN-LAST:event_jMenuItem6ActionPerformed

    private void jMenuItem7ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem7ActionPerformed
        double l = System.nanoTime();
        List<Block> bb = Tools.spaceshipBreakupTest(this.spaceship.getModel());
        for (Block b : bb) {
            this.model.remove(b);
        }
        this.spaceship.buildModel(
                this.model
        );
        System.out.println((System.nanoTime() - l) / 1000000D + "ms");
    }//GEN-LAST:event_jMenuItem7ActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    public java.awt.Canvas canvas1;
    private javax.swing.JMenu jMenu1;
    private javax.swing.JMenu jMenu2;
    private javax.swing.JMenuBar jMenuBar1;
    private javax.swing.JMenuItem jMenuItem1;
    private javax.swing.JMenuItem jMenuItem2;
    private javax.swing.JMenuItem jMenuItem3;
    private javax.swing.JMenuItem jMenuItem5;
    private javax.swing.JMenuItem jMenuItem6;
    private javax.swing.JMenuItem jMenuItem7;
    // End of variables declaration//GEN-END:variables
}
