/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft;

import SpaceCraft.Level.Level;
import SpaceCraft.Object.Block.Block;
import SpaceCraft.Object.Spaceship.Spaceship;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JSlider;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ListCellRenderer;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;
import javax.swing.filechooser.FileNameExtensionFilter;

/**
 * Commands: kill {ALL;ENEMIES;PLAYER} spawn {name} {position} {file[model]}
 * text {position[x,y]} {color} {size} {time} {text} player shooting {boolean}
 * bg {color} {speed} {intensity} wait {time} wfde play_music {name} {file}
 * {repeating} stop_music {name}
 */
/**
 *
 * @author Krcma
 */
public class LevelEditor extends javax.swing.JFrame {

    private Level level;
    private int index = 0;
    private JPanel text, kill, spawn, wait, wfde, bg, player, play_music, stop_music;
    private String commandType = "";

    private JFileChooser jfc;

    private TextEditor te;

    private JFrame info;

    /**
     * Creates new form LevelEditor
     */
    public LevelEditor() {
        initComponents();
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
        this.jfc = new JFileChooser();
        //level
        this.level = new Level();
        //text editor
        this.te = new TextEditor(this.level);
        //[play_music]################################
        this.play_music = new JPanel();
        this.play_music.setToolTipText("Play music");
        this.play_music.setLayout(new GridLayout(6, 2));
        this.play_music.setSize(this.body.getSize());
        this.play_music.add(new JLabel("Command:"));
        this.play_music.add(new JLabel("PLAY_MUSIC"));
        this.play_music.add(new JLabel("Name:"));
        this.play_music.add(new JTextField() {
            @Override
            public String getName() {
                return "name";
            }
        });
        JLabel j = new JLabel("File:");
        j.setName("File:");
        this.play_music.add(j);
        JButton b = new JButton("Open");
        b.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (jfc.showOpenDialog(null) == JFileChooser.APPROVE_OPTION) {
                    try {
                        for (Component c : play_music.getComponents()) {
                            if (c.getName() != null) {
                                if (c.getName().startsWith("File:")) {
                                    String fn = jfc.getSelectedFile().getName();
                                    if (fn.length() > 28) {
                                        fn = fn.substring(0, 12) + "...";
                                    }
                                    ((JLabel) c).setText("File: " + fn);
                                    c.setName("File:" + jfc.getSelectedFile().getName());
                                }
                            }
                        }
                    } catch (Exception ex) {
                    }
                }
            }
        });
        this.play_music.add(b);
        this.play_music.add(new JLabel("Repeat:"));
        this.play_music.add(new JCheckBox() {
            @Override
            public String getName() {
                return "repeating";
            }

        });
        for (int i = 0; i < 4; i++) {
            this.play_music.add(new JLabel(""));
        }
        //[stop_music]################################
        this.stop_music = new JPanel();
        this.stop_music.setToolTipText("Play music");
        this.stop_music.setLayout(new GridLayout(6, 2));
        this.stop_music.setSize(this.body.getSize());
        this.stop_music.add(new JLabel("Command:"));
        this.stop_music.add(new JLabel("STOP_MUSIC"));
        this.stop_music.add(new JLabel("Name:"));
        this.stop_music.add(new JTextField() {
            @Override
            public String getName() {
                return "name";
            }
        });
        for (int i = 0; i < 6; i++) {
            this.stop_music.add(new JLabel(""));
        }
        //[player]################################
        this.player = new JPanel();
        this.player.setToolTipText("Spawn player");
        this.player.setLayout(new GridLayout(6, 2));
        this.player.setSize(this.body.getSize());
        this.player.add(new JLabel("Command:"));
        this.player.add(new JLabel("PLAYER"));
        for (int i = 0; i < 10; i++) {
            this.player.add(new JLabel(""));
        }
        //[text]################################
        this.text = new JPanel();
        this.text.setToolTipText("In game display text");
        this.text.setLayout(new GridLayout(7, 2));
        this.text.setSize(this.body.getSize());
        this.text.add(new JLabel("Command:"));
        this.text.add(new JLabel("TEXT"));
        this.text.add(
                new JLabel("Text:")
        );
        this.text.add(
                new JTextField() {
            @Override
            public String getName() {
                return "text";
            }
        }
        );
        this.text.add(
                new JLabel("Size:")
        );
        JSlider js = new JSlider(8, 150, 35);
        js.setName("size");
        js.setPaintTicks(true);
        js.setMajorTickSpacing(20);
        js.setPaintLabels(true);
        this.text.add(js);
        this.text.add(
                new JLabel("Color:")
        );
        JComboBox jcb = new JComboBox(
                new Object[]{
                    Color.WHITE, Color.BLUE,
                    Color.CYAN, Color.DARK_GRAY,
                    Color.GRAY, Color.GREEN,
                    Color.LIGHT_GRAY, Color.MAGENTA,
                    Color.ORANGE, Color.PINK,
                    Color.RED, Color.BLACK,
                    Color.YELLOW}
        );
        jcb.setRenderer(new CellR());
        jcb.setSelectedIndex(0);
        jcb.setBackground(Color.WHITE);
        jcb.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Color selectedColor = (Color) jcb.getSelectedObjects()[0];
                jcb.setBackground(selectedColor);
            }
        });
        jcb.setName("color");
        this.text.add(jcb);
        this.text.add(
                new JLabel("Vertical position:")
        );
        js = new JSlider(-5, 5, 0);
        js.setName("y");
        js.setPaintTicks(true);
        js.setMajorTickSpacing(1);
        this.text.add(js);
        this.text.add(
                new JLabel("Horisontal position:")
        );
        js = new JSlider(-5, 5, 0);
        js.setName("x");
        js.setPaintTicks(true);
        js.setMajorTickSpacing(1);
        this.text.add(js);
        this.text.add(
                new JLabel("TIME[seconds]: ")
        );
        js = new JSlider(0, 10, 1);
        js.setName("time");
        js.setPaintTicks(true);
        js.setMajorTickSpacing(2);
        js.setPaintLabels(true);
        this.text.add(js);
        //[kill]######################
        this.kill = new JPanel();
        this.kill.setToolTipText("Kill objects in game");
        this.kill.setLayout(new GridLayout(6, 2));
        this.kill.setSize(this.body.getSize());
        this.kill.add(new JLabel("Command:"));
        this.kill.add(new JLabel("KILL"));
        this.kill.add(
                new JLabel("TYPE: ")
        );
        this.kill.add(
                new JComboBox(new Object[]{"ALL", "ENEMIES", "PLAYER"}) {
            @Override
            public String getName() {
                return "type";
            }

        });
        for (int i = 0; i < 8; i++) {
            this.kill.add(new JLabel(""));
        }
        //[spawn]######################
        this.spawn = new JPanel();
        this.spawn.setToolTipText("Spawn object");
        this.spawn.setLayout(new GridLayout(6, 2));
        this.spawn.setSize(this.body.getSize());
        this.spawn.add(new JLabel("Command:"));
        this.spawn.add(new JLabel("SPAWN"));
        this.spawn.add(
                new JLabel("Name:")
        );
        this.spawn.add(
                new JTextField() {
            @Override
            public String getName() {
                return "name";
            }
        }
        );
        this.spawn.add(
                new JLabel("Horisontal position:")
        );
        js = new JSlider(-5, 5, 0);
        js.setName("x");
        js.setPaintTicks(true);
        js.setMajorTickSpacing(1);
        this.spawn.add(js);
        JLabel jmn = new JLabel("Model:");
        jmn.setName("Model:");
        this.spawn.add(jmn);
        b = new JButton("Open");
        b.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                jfc.setFileFilter(new FileNameExtensionFilter("SpaceCraft model", "scm"));
                if (jfc.showOpenDialog(null) == JFileChooser.APPROVE_OPTION) {
                    try {
                        for (Component c : spawn.getComponents()) {
                            if (c.getName() != null) {
                                if (c.getName().startsWith("Model:")) {
                                    String fn = jfc.getSelectedFile().getName();
                                    c.setName("Model:" + fn);
                                    if (fn.length() > 28) {
                                        fn = fn.substring(0, 12) + "...";
                                    }
                                    ((JLabel) c).setText("Model: " + fn);
                                }
                            }
                        }
                        Spaceship s = new Spaceship("", new FloatPoint(0f, 0f), true);
                        s.buildModel(ModelIO.read(jfc.getSelectedFile()));
                        BufferedImage img = ModelViewer.getImageOfSpaceship(s, Block.SIZE * 20, Block.SIZE * 20);
                        JFrame f = new JFrame();
                        f.setSize(img.getWidth() + 5, img.getHeight() + 5);
                        Dimension size = Toolkit.getDefaultToolkit().getScreenSize();
                        f.setLocation(
                                (int) ((size.width - f.getWidth()) / 2),
                                (int) ((size.height - f.getHeight()) / 2)
                        );
                        f.setResizable(false);
                        f.setType(Type.UTILITY);
                        f.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
                        JLabel l = new JLabel(new ImageIcon(img));
                        f.add(l);
                        f.setVisible(true);
                    } catch (Exception ex) {
                        JOptionPane.showMessageDialog(null, "This model is broken.");
                    }
                }
            }
        });
        this.spawn.add(b);
        for (int i = 0; i < 4; i++) {
            this.spawn.add(new JLabel(""));
        }
        //[WAIT]##################################
        this.wait = new JPanel();
        this.wait.setToolTipText("Wait specific time");
        this.wait.setLayout(new GridLayout(6, 2));
        this.wait.setSize(this.body.getSize());
        this.wait.add(new JLabel("Command:"));
        this.wait.add(new JLabel("WAIT"));
        this.wait.add(
                new JLabel("TIME[seconds]: ")
        );
        js = new JSlider(0, 100, 1);
        js.setName("time");
        js.setPaintTicks(true);
        js.setMajorTickSpacing(25);
        js.setPaintLabels(true);
        this.wait.add(js);
        for (int i = 0; i < 8; i++) {
            this.wait.add(new JLabel(""));
        }
        //[wait for enemies death]##################################
        this.wfde = new JPanel();
        this.wfde.setToolTipText("Wait while enemies live");
        this.wfde.setLayout(new GridLayout(6, 2));
        this.wfde.setSize(this.body.getSize());
        this.wfde.add(new JLabel("Command:"));
        this.wfde.add(new JLabel("WAIT FOR DEATH OF ENEMIES"));
        for (int i = 0; i < 10; i++) {
            this.wfde.add(new JLabel(""));
        }
        //###########################
        this.info = new JFrame();
        this.info.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        this.info.setResizable(false);
        this.info.setSize(305, 380);
        this.info.add(new JLabel(new ImageIcon(this.getClass().getResource("/info.png"))));
        this.info.setTitle("INFO");
        this.info.setType(Type.UTILITY);
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        body = new javax.swing.JPanel();
        jPanel2 = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jButton1 = new javax.swing.JButton();
        img = new javax.swing.JLabel();
        jButton2 = new javax.swing.JButton();
        jButton3 = new javax.swing.JButton();
        jButton4 = new javax.swing.JButton();
        jProgressBar1 = new javax.swing.JProgressBar();
        jMenuBar1 = new javax.swing.JMenuBar();
        jMenu1 = new javax.swing.JMenu();
        jMenuItem1 = new javax.swing.JMenuItem();
        jMenuItem2 = new javax.swing.JMenuItem();
        jMenuItem3 = new javax.swing.JMenuItem();
        jMenuItem10 = new javax.swing.JMenuItem();
        jMenu2 = new javax.swing.JMenu();
        jMenuItem4 = new javax.swing.JMenuItem();
        jMenuItem5 = new javax.swing.JMenuItem();
        jMenuItem6 = new javax.swing.JMenuItem();
        jMenuItem7 = new javax.swing.JMenuItem();
        jMenuItem8 = new javax.swing.JMenuItem();
        jSeparator1 = new javax.swing.JPopupMenu.Separator();
        jMenuItem9 = new javax.swing.JMenuItem();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setTitle("Level editor");
        setResizable(false);

        body.setBackground(new java.awt.Color(101, 101, 125));
        body.setForeground(new java.awt.Color(202, 202, 222));
        body.setToolTipText("");

        javax.swing.GroupLayout bodyLayout = new javax.swing.GroupLayout(body);
        body.setLayout(bodyLayout);
        bodyLayout.setHorizontalGroup(
            bodyLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 0, Short.MAX_VALUE)
        );
        bodyLayout.setVerticalGroup(
            bodyLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGap(0, 363, Short.MAX_VALUE)
        );

        jPanel2.setBorder(javax.swing.BorderFactory.createEtchedBorder());
        jPanel2.setRequestFocusEnabled(false);

        jLabel1.setText("Commands: 0 - Actual: 0");

        jLabel2.setText("Level image:");

        jButton1.setText("Find");
        jButton1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton1ActionPerformed(evt);
            }
        });

        img.setMaximumSize(new java.awt.Dimension(68, 68));
        img.setMinimumSize(new java.awt.Dimension(68, 68));
        img.setName(""); // NOI18N
        img.setPreferredSize(new java.awt.Dimension(110, 110));

        jButton2.setText("<");
        jButton2.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton2ActionPerformed(evt);
            }
        });

        jButton3.setText(">");
        jButton3.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton3ActionPerformed(evt);
            }
        });

        jButton4.setText("ADD");
        jButton4.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton4ActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(5, 5, 5)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jLabel1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING, false)
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addComponent(jButton2)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jButton4)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jButton3))
                            .addGroup(jPanel2Layout.createSequentialGroup()
                                .addComponent(jLabel2)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(jButton1, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addGap(48, 48, 48)
                .addComponent(img, javax.swing.GroupLayout.PREFERRED_SIZE, 68, javax.swing.GroupLayout.PREFERRED_SIZE))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addGap(5, 5, 5)
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(img, javax.swing.GroupLayout.PREFERRED_SIZE, 69, javax.swing.GroupLayout.PREFERRED_SIZE)
                    .addGroup(jPanel2Layout.createSequentialGroup()
                        .addComponent(jLabel1)
                        .addGap(5, 5, 5)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jLabel2)
                            .addComponent(jButton1, javax.swing.GroupLayout.PREFERRED_SIZE, 19, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                        .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(jButton2)
                            .addComponent(jButton3)
                            .addComponent(jButton4))))
                .addGap(5, 12, Short.MAX_VALUE))
        );

        jMenu1.setText("File");

        jMenuItem1.setText("Save level");
        jMenuItem1.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem1ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem1);

        jMenuItem2.setText("Open level");
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

        jMenuItem10.setText("Info");
        jMenuItem10.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem10ActionPerformed(evt);
            }
        });
        jMenu1.add(jMenuItem10);

        jMenuBar1.add(jMenu1);

        jMenu2.setText("Edit");

        jMenuItem4.setText("Add command");
        jMenuItem4.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem4ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem4);

        jMenuItem5.setText("Next command");
        jMenuItem5.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem5ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem5);

        jMenuItem6.setText("Last command");
        jMenuItem6.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem6ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem6);

        jMenuItem7.setText("Remove command");
        jMenuItem7.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem7ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem7);

        jMenuItem8.setText("Swap commands");
        jMenu2.add(jMenuItem8);
        jMenu2.add(jSeparator1);

        jMenuItem9.setText("Open in text editor");
        jMenuItem9.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jMenuItem9ActionPerformed(evt);
            }
        });
        jMenu2.add(jMenuItem9);

        jMenuBar1.add(jMenu2);

        setJMenuBar(jMenuBar1);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addComponent(jPanel2, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(body, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
            .addComponent(jProgressBar1, javax.swing.GroupLayout.DEFAULT_SIZE, 450, Short.MAX_VALUE)
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addComponent(jProgressBar1, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, 0)
                .addComponent(body, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                .addGap(0, 0, 0)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addGap(0, 0, 0))
        );

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void jMenuItem6ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem6ActionPerformed
        try {
            writeCommandToLevel(this.index, this.commandType);
        } catch (Exception ex) {
        }
        if (this.index - 1 >= 0) {
            this.index--;
            displayControlers(this.index);
            refreshInfo();
        }    }//GEN-LAST:event_jMenuItem6ActionPerformed

    private void jMenuItem5ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem5ActionPerformed
        try {
            writeCommandToLevel(this.index, this.commandType);
        } catch (Exception ex) {
        }
        if (this.index + 1 < this.level.commands.size()) {
            this.index++;
            displayControlers(this.index);
            refreshInfo();
        }    }//GEN-LAST:event_jMenuItem5ActionPerformed

    private void jMenuItem4ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem4ActionPerformed
        try {
            writeCommandToLevel(this.index, this.commandType);
        } catch (Exception ex) {
        }
        String[] choices = {"spawn", "text", "kill", "player", "wait", "wfde", "play_music", "stop_music"};
        String input = (String) JOptionPane.showInputDialog(this, "Choose command",
                "Command", JOptionPane.QUESTION_MESSAGE, null, // Use
                // default
                // icon
                choices, // Array of choices
                choices[0]); // Initial choice
        if (input == null) {
            return;
        }
        this.level.commands.add(input);
        displayControlers(this.level.commands.size() - 1);
        refreshInfo();    }//GEN-LAST:event_jMenuItem4ActionPerformed

    private void jButton1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton1ActionPerformed
        JFileChooser jfc = new JFileChooser();
        if (jfc.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            try {
                this.level.createImage(
                        Tools.risizeImage(ImageIO.read(jfc.getSelectedFile()), new Dimension(400, 400))
                );
                this.img.setIcon(
                        new ImageIcon(Tools.risizeImage(ImageIO.read(jfc.getSelectedFile()), new Dimension(68, 68)))
                );
            } catch (IOException ex) {
                Logger.getLogger(LevelEditor.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
            }
        }
    }//GEN-LAST:event_jButton1ActionPerformed

    private void jMenuItem1ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem1ActionPerformed
        String m = (String) JOptionPane.showInputDialog(
                this,
                "Write something",
                "Level info",
                JOptionPane.QUESTION_MESSAGE,
                null,
                null,
                this.level.TEXT
        );
        if (m == null) {
            return;
        }
        this.level.TEXT = m;
        try {
            int c = Integer.parseInt((String) JOptionPane.showInputDialog(
                    this,
                    "Write maximum complexity for this level",
                    "Complexity",
                    JOptionPane.QUESTION_MESSAGE,
                    null,
                    null,
                    this.level.max_complexity
            ));
            this.level.max_complexity = c;
        } catch (Exception ex) {
            return;
        }
        try {
            writeCommandToLevel(this.index, this.commandType);
        } catch (Exception ex) {
        }
        JFileChooser save = new JFileChooser();
        save.addChoosableFileFilter(new FileNameExtensionFilter("SpaceCraft level", "scl"));
        if (save.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            if (save.getSelectedFile().getAbsolutePath().endsWith(".scl")) {
                LevelIO.write(this.level, save.getSelectedFile());
            } else {
                LevelIO.write(this.level, new File(save.getSelectedFile() + ".scl"));
            }
        }
    }//GEN-LAST:event_jMenuItem1ActionPerformed

    private void jMenuItem2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem2ActionPerformed
        jfc.addChoosableFileFilter(new FileNameExtensionFilter("SpaceCraft level", "scl"));
        if (jfc.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            try {
                this.level = LevelIO.read(jfc.getSelectedFile());
                this.te = new TextEditor(this.level);
                try {
                    this.img.setIcon(
                            new ImageIcon(this.level.getBufferedImage())
                    );
                } catch (Exception ex) {
                }
            } catch (Exception ex) {
                Logger.getLogger(LevelEditor.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
            }
        }
        displayControlers(0);
        refreshInfo();
    }//GEN-LAST:event_jMenuItem2ActionPerformed

    private void jMenuItem3ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem3ActionPerformed
        this.level.commands.clear();
    }//GEN-LAST:event_jMenuItem3ActionPerformed

    private void jMenuItem7ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem7ActionPerformed
        this.level.commands.remove(this.index);
        refreshInfo();
        if (this.index < this.level.commands.size()) {
            displayControlers(this.index);
        } else {
            displayControlers(this.level.commands.size() - 1);
        }
    }//GEN-LAST:event_jMenuItem7ActionPerformed

    private void jButton2ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton2ActionPerformed
        writeCommandToLevel(this.index, this.commandType);
        if (this.index - 1 >= 0) {
            this.index--;
            displayControlers(this.index);
            refreshInfo();
        }
    }//GEN-LAST:event_jButton2ActionPerformed

    private void jButton3ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton3ActionPerformed
        writeCommandToLevel(this.index, this.commandType);
        if (this.index + 1 < this.level.commands.size()) {
            this.index++;
            displayControlers(this.index);
            refreshInfo();
        }
    }//GEN-LAST:event_jButton3ActionPerformed

    private void jButton4ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jButton4ActionPerformed
        try {
            writeCommandToLevel(this.index, this.commandType);
        } catch (Exception ex) {
        }
        String[] choices = {"spawn", "text", "kill", "player", "wait", "wfde", "play_music", "stop_music"};
        String input = (String) JOptionPane.showInputDialog(this, "Choose command",
                "Command", JOptionPane.QUESTION_MESSAGE, null, // Use
                // default
                // icon
                choices, // Array of choices
                choices[0]); // Initial choice
        if (input != null) {
            this.level.commands.add(input);
            displayControlers(this.level.commands.size() - 1);
            refreshInfo();
        }
    }//GEN-LAST:event_jButton4ActionPerformed

    private void jMenuItem9ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem9ActionPerformed
        try {
            writeCommandToLevel(this.index, this.commandType);
        } catch (Exception ex) {
        }
        this.te.show(this);
        Thread t = new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        Thread.sleep(100);
                        if (!te.isActive()) {
                            refreshInfo();
                            if (index < level.commands.size()) {
                                displayControlers(index);
                            } else {
                                displayControlers(level.commands.size() - 1);
                            }
                            return;
                        }
                    } catch (Exception ex) {
                    }
                }
            }
        });
        t.start();
    }//GEN-LAST:event_jMenuItem9ActionPerformed

    private void jMenuItem10ActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_jMenuItem10ActionPerformed
        this.info.setLocation(this.getX() + (this.getWidth() - this.info.getWidth()) / 2, this.getY() + (this.getHeight() - this.info.getHeight()) / 2);
        this.info.setVisible(true);
    }//GEN-LAST:event_jMenuItem10ActionPerformed

    private void writeCommandToLevel(int index, String commandType) {
        String command = commandType;
        switch (commandType) {
            case "kill":
                command += " " + ((JComboBox) getComponent(this.kill, "type")).getSelectedObjects()[0];
                break;
            case "spawn":
                command += " " + ((JTextField) getComponent(this.spawn, "name")).getText();
                command += " " + ((JSlider) getComponent(this.spawn, "x")).getValue();
                for (Component cc : this.spawn.getComponents()) {
                    if (cc.getName() != null) {
                        if (cc.getName().startsWith("Model:")) {
                            command += " " + cc.getName().substring(6);
                            break;
                        }
                    }
                }
                break;
            case "text":
                command += " " + ((JSlider) getComponent(this.text, "x")).getValue();
                command += " " + ((JSlider) getComponent(this.text, "y")).getValue();
                Color c = (Color) ((JComboBox) getComponent(this.text, "color")).getSelectedObjects()[0];
                command += " " + c.getRed() + "," + c.getGreen() + "," + c.getBlue();
                command += " " + ((JSlider) getComponent(this.text, "size")).getValue();
                command += " " + ((JSlider) getComponent(this.text, "time")).getValue();
                command += " " + ((JTextField) getComponent(this.text, "text")).getText();
                break;
            case "wait":
                command += " " + ((JSlider) getComponent(this.wait, "time")).getValue();
                break;
            case "bg":
                c = (Color) ((JComboBox) getComponent(this.bg, "color")).getSelectedObjects()[0];
                command += " " + c.getRed() + "," + c.getGreen() + "," + c.getBlue();
                command += " " + ((JSlider) getComponent(this.bg, "speed")).getValue();
                command += " " + ((JSlider) getComponent(this.bg, "f")).getValue();
                break;
            case "play_music":
                command += " " + ((JTextField) getComponent(this.play_music, "name")).getText();
                for (Component cc : this.play_music.getComponents()) {
                    if (cc.getName() != null) {
                        if (cc.getName().startsWith("File:")) {
                            command += " " + cc.getName().substring(5);
                            break;
                        }
                    }
                }
                command += ((JCheckBox) getComponent(this.play_music, "repeating")).isSelected() ? " TRUE" : " FALSE";
                break;
            case "stop_music":
                command += " " + ((JTextField) getComponent(this.stop_music, "name")).getText();
                break;
        }
        this.level.commands.set(index, command);
    }

    private void displayControlers(int c) {
        try {
            this.body.removeAll();
            this.index = c;
            String[] command = this.level.commands.get(c).split(" ");
            switch (command[0]) {
                case "play_music":
                    this.commandType = "play_music";
                    this.body.add(this.play_music);
                    try {
                        ((JTextField) getComponent(this.play_music, "name")).setText(command[1]);
                    } catch (Exception ex) {
                    }
                    try {
                        for (Component cc : this.spawn.getComponents()) {
                            if (cc.getName() != null) {
                                if (cc.getName().startsWith("File:")) {
                                    cc.setName("File:" + command[2]);
                                    ((JLabel) cc).setText("File: " + command[2]);
                                    break;
                                }
                            }
                        }
                    } catch (Exception ex) {
                    }
                    try {
                        ((JCheckBox) getComponent(this.play_music, "repeating")).setSelected(command[3].equals("TRUE"));
                    } catch (Exception ex) {
                    }
                    break;
                case "stop_music":
                    this.commandType = "stop_music";
                    this.body.add(this.stop_music);
                    try {
                        ((JTextField) getComponent(this.stop_music, "name")).setText(command[1]);
                    } catch (Exception ex) {
                    }
                    break;
                case "kill":
                    this.commandType = "kill";
                    this.body.add(this.kill);
                    try {
                        ((JComboBox) getComponent(this.kill, "type")).setSelectedItem(command[1]);
                    } catch (Exception ex) {
                    }
                    break;
                case "spawn":
                    this.commandType = "spawn";
                    this.body.add(this.spawn);
                    try {
                        ((JTextField) getComponent(this.spawn, "name")).setText(command[1]);
                    } catch (Exception ex) {
                    }
                    try {
                        ((JSlider) getComponent(this.spawn, "x")).setValue(Integer.parseInt(command[2]));
                    } catch (Exception ex) {
                    }
                    try {
                        for (Component cc : this.spawn.getComponents()) {
                            if (cc.getName() != null) {
                                if (cc.getName().startsWith("Model:")) {
                                    cc.setName("Model:" + command[3]);
                                    ((JLabel) cc).setText("Model: " + command[3]);
                                    break;
                                }
                            }
                        }
                    } catch (Exception ex) {
                    }
                    break;
                case "text":
                    this.commandType = "text";
                    this.body.add(this.text);
                    try {
                        ((JSlider) getComponent(this.text, "x")).setValue(Integer.parseInt(command[1]));
                        ((JSlider) getComponent(this.text, "y")).setValue(Integer.parseInt(command[2]));
                        String[] c1 = command[3].split(",");
                        ((JComboBox) getComponent(this.text, "color")).setSelectedItem(
                                new Color(Integer.parseInt(c1[0]), Integer.parseInt(c1[1]), Integer.parseInt(c1[2]))
                        );
                        ((JSlider) getComponent(this.text, "size")).setValue(Integer.parseInt(command[4]));
                        ((JSlider) getComponent(this.text, "time")).setValue(Integer.parseInt(command[5]));
                        String text = "";
                        for (int i = 6; i < command.length; i++) {
                            if (i + 1 == command.length) {
                                text += command[i];
                            } else {
                                text += command[i] + " ";
                            }
                        }
                        ((JTextField) getComponent(this.text, "text")).setText(text);
                    } catch (Exception ex) {
                    }
                    break;
                case "player":
                    this.commandType = "player";
                    this.body.add(this.player);
                    break;
                case "wait":
                    this.commandType = "wait";
                    this.body.add(this.wait);
                    try {
                        ((JSlider) getComponent(this.wait, "time")).setValue(Integer.parseInt(command[1]));
                    } catch (Exception ex) {
                    }
                    break;
                case "wfde":
                    this.commandType = "wfde";
                    this.body.add(this.wfde);
                    break;
            }
            this.body.revalidate();
            this.body.repaint();
        } catch (Exception ex) {
        }
    }

    private Component getComponent(JPanel p, String name) {
        for (Component c : p.getComponents()) {
            if (c.getName() != null) {
                if (c.getName().equals(name)) {
                    return c;
                }
            }
        }
        return null;
    }

    private void refreshInfo() {
        this.jLabel1.setText("Commands: " + this.level.commands.size() + " - Actual command: " + (this.index + 1));
        this.jProgressBar1.setMaximum(this.level.commands.size());
        this.jProgressBar1.setValue(this.index + 1);
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JPanel body;
    private javax.swing.JLabel img;
    private javax.swing.JButton jButton1;
    private javax.swing.JButton jButton2;
    private javax.swing.JButton jButton3;
    private javax.swing.JButton jButton4;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JMenu jMenu1;
    private javax.swing.JMenu jMenu2;
    private javax.swing.JMenuBar jMenuBar1;
    private javax.swing.JMenuItem jMenuItem1;
    private javax.swing.JMenuItem jMenuItem10;
    private javax.swing.JMenuItem jMenuItem2;
    private javax.swing.JMenuItem jMenuItem3;
    private javax.swing.JMenuItem jMenuItem4;
    private javax.swing.JMenuItem jMenuItem5;
    private javax.swing.JMenuItem jMenuItem6;
    private javax.swing.JMenuItem jMenuItem7;
    private javax.swing.JMenuItem jMenuItem8;
    private javax.swing.JMenuItem jMenuItem9;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JProgressBar jProgressBar1;
    private javax.swing.JPopupMenu.Separator jSeparator1;
    // End of variables declaration//GEN-END:variables

    private static class CellR extends JPanel implements ListCellRenderer {

        public CellR() {
            this.add(new JLabel(" ") {
                @Override
                public Dimension getSize() {
                    return new Dimension(0, 50);
                }
            });
        }

        @Override
        public Component getListCellRendererComponent(JList list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
            this.setBackground((Color) value);
            return this;
        }
    }

    public class TextEditor extends JFrame {

        private Level level;
        private JTextArea ta;
        private JFrame f;

        public TextEditor(Level l) {
            this.level = l;
            this.setTitle("Text Editor");
            this.setDefaultCloseOperation(DISPOSE_ON_CLOSE);
            this.setSize(300, 400);
            this.ta = new JTextArea();
            this.ta.setFont(new Font("Monospaced", Font.PLAIN, 18));
            this.add(new JScrollPane(this.ta));
            this.addWindowListener(new WindowAdapter() {
                public void windowClosing(WindowEvent e) {
                    hide();
                }
            });
        }

        public void show(JFrame f) {
            this.f = f;
            f.setEnabled(false);
            this.setVisible(true);
            this.setSize(300, 400);
            this.setLocation(
                    f.getX() + (f.getWidth() - this.getWidth()) / 2,
                    f.getY() + (f.getHeight() - this.getHeight()) / 2
            );
            this.ta.setText("");
            this.level.commands.forEach((c) -> {
                this.ta.append(c + "\n");
            });
        }

        @Override
        public void hide() {
            this.f.setEnabled(true);
            this.level.commands.clear();
            String[] lines = this.ta.getText().split("\n");
            for (String l : lines) {
                if (l.length() > 0) {
                    this.level.commands.add(l);
                }
            }
        }
    }

}
