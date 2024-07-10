/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Spaceship.Spaceship;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
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
public class ModelViewer extends javax.swing.JFrame {

    private final Spaceship obj;

    private File lastfile;
    private List<File> files;

    /**
     * Creates new form PlaneViewer
     */
    public ModelViewer() {
        initComponents();
        this.setIconImage(new ImageIcon(this.getClass().getResource("/Viewer.png")).getImage());
        this.files = new ArrayList<>();
        this.canvas1.createBufferStrategy(3);
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        Graphics2D g2 = (Graphics2D) canvas1.getBufferStrategy().getDrawGraphics();
                        g2.setColor(new Color(90, 90, 80));
                        g2.fillRect(0, 0, canvas1.getWidth(), canvas1.getHeight());
                        if (obj != null) {
                            obj.render(g2, 0, 0);
                            g2.setColor(new Color(20, 20, 10));
                            g2.setFont(new Font("Tahoma", Font.BOLD, 12));
                            g2.drawString("Total life: " + obj.getTotalLife() + " HP", 10, 18);
                            g2.drawString("Total mass: " + obj.getTotalMass() + " t", 10, 30);
                            int c = 0;
                            for (Block b : obj.getModel()) {
                                c += b.getType().getComplexity();
                            }
                            g2.drawString("Total complexity: " + c, 10, 42);
                            if (lastfile != null) {
                                g2.drawString("File: " + lastfile.getName(), 10, 54);
                            }
                        }
                        canvas1.getBufferStrategy().show();
                        Thread.sleep(20);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(ModelViewer.class.getName()).log(Level.SEVERE, null, ex);
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
        //show on center of screen
        Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
        this.setLocation(
                (int) ((screen.getWidth() - this.getWidth()) / 2f),
                (int) ((screen.getHeight() - this.getHeight()) / 2f)
        );
        this.obj = new Spaceship("", new FloatPoint(this.canvas1.getWidth() / 2f, this.canvas1.getHeight() / 2f), true);
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

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Model Viewer");
        addComponentListener(new java.awt.event.ComponentAdapter() {
            public void componentResized(java.awt.event.ComponentEvent evt) {
                formComponentResized(evt);
            }
        });

        jMenu1.setText("File");

        jMenuItem1.setText("Open");
        jMenuItem1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem1ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem1);

        jMenuItem2.setAccelerator(javax.swing.KeyStroke.getKeyStroke(java.awt.event.KeyEvent.VK_LEFT, 0));
        jMenuItem2.setText("Next");
        jMenuItem2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem2ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem2);

        jMenuItem3.setAccelerator(javax.swing.KeyStroke.getKeyStroke(java.awt.event.KeyEvent.VK_RIGHT, 0));
        jMenuItem3.setText("Last");
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

        jMenuBar1.add(jMenu2);

        setJMenuBar(jMenuBar1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 515, Short.MAX_VALUE)
            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addComponent(canvas1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 366, Short.MAX_VALUE)
            .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                .addComponent(canvas1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jMenuItem1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem1ActionPerformed
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(new FileNameExtensionFilter("SpaceCraft model", "scm"));
        if (fileChooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            open(fileChooser.getSelectedFile());
            try {
                File[] list = fileChooser.getCurrentDirectory().listFiles();
                this.files.clear();
                for (File f : list) {
                    if (f.toString().endsWith(".scm")) {
                        this.files.add(f);
                    }
                }
            } catch (Exception ex) {
            }
        }
    }//GEN-LAST:event_jMenuItem1ActionPerformed

    private void jMenuItem2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem2ActionPerformed
        for (int i = 0; i < this.files.size(); i++) {
            File f = this.files.get(i);
            if (f.equals(this.lastfile)) {
                if (i + 1 < this.files.size()) {
                    open(this.files.get(i + 1));
                } else {
                    open(this.files.get(0));
                }
                break;
            }
        }
    }//GEN-LAST:event_jMenuItem2ActionPerformed

    private void jMenuItem3ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem3ActionPerformed
        for (int i = 0; i < this.files.size(); i++) {
            File f = this.files.get(i);
            if (f.equals(this.lastfile)) {
                if (i - 1 >= 0) {
                    open(this.files.get(i - 1));
                } else {
                    open(this.files.get(this.files.size() - 1));
                }
                break;
            }
        }
    }//GEN-LAST:event_jMenuItem3ActionPerformed

    private void formComponentResized(java.awt.event.ComponentEvent evt) {//GEN-FIRST:event_formComponentResized
        if (this.obj != null) {
            this.obj.setPosition(new FloatPoint(this.getWidth() / 2f, this.getHeight() / 2f));
        }
    }//GEN-LAST:event_formComponentResized

    private void jMenuItem5ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem5ActionPerformed
        JOptionPane.showMessageDialog(this, "Model Viewer\nThis program can view models for SpaceCraft\nCreated by " + Game.author);
    }//GEN-LAST:event_jMenuItem5ActionPerformed

    private void open(File f) {
        try {
            List<Block> model = ModelIO.read(f);
            this.obj.buildModel(model);
            this.lastfile = f;
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "This model is broken.");
        }
    }

    public static BufferedImage getImageOfSpaceship(Spaceship s, int width, int height) {
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = (Graphics2D) img.getGraphics();
        g2.setColor(new Color(40, 40, 55));
        g2.fillRect(0, 0, width, height);
        g2.setColor(new Color(10, 10, 25));
        g2.setStroke(new BasicStroke(7));
        g2.drawRect(0, 0, width, height);
        s.setPosition(new FloatPoint(width / 2f, height / 2f));
        s.render(g2, 0, 0);
        g2.setColor(Color.WHITE);
        g2.setFont(new Font("Tahoma", Font.BOLD, 14));
        g2.drawString("Total life: " + s.getTotalLife() + " HP", 15, 15);
        g2.drawString("Total mass: " + String.format("%.2f", s.getTotalMass()) + " t", 15, 30);
        float td = 0f;
        List<Block> model = s.getModel();
        td = model.stream().map((b) -> b.getType().getDamage()).reduce(td, (accumulator, _item) -> accumulator + _item);
        g2.drawString("Damage/s: " + String.format("%.2f", td), 15, 45);
        return img;
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    public java.awt.Canvas canvas1;
    private javax.swing.JMenu jMenu1;
    private javax.swing.JMenu jMenu2;
    private javax.swing.JMenuBar jMenuBar1;
    private javax.swing.JMenuItem jMenuItem1;
    private javax.swing.JMenuItem jMenuItem2;
    private javax.swing.JMenuItem jMenuItem3;
    private javax.swing.JMenuItem jMenuItem5;
    // End of variables declaration//GEN-END:variables
}
