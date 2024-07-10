/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Engine;

import java.io.IOException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;

import javax.sound.sampled.Clip;
import javax.sound.sampled.FloatControl;
import javax.sound.sampled.LineEvent;
import javax.sound.sampled.LineListener;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.UnsupportedAudioFileException;

/**
 *
 * @author Krcma
 */
public class SoundPlayer {

    private final Clip[] clip;
    private boolean run = false;

    public SoundPlayer(URL sound, int size, boolean looping, float vol) {
        this.clip = new Clip[size];
        size = looping ? 1 : size;
        try {
            for (int i = 0; i < size; i++) {
                AudioInputStream ais = AudioSystem.getAudioInputStream(sound);
                AudioFormat baseFormat = ais.getFormat();
                AudioFormat decodeFormat = new AudioFormat(
                        AudioFormat.Encoding.PCM_SIGNED,
                        baseFormat.getSampleRate(),
                        16,
                        baseFormat.getChannels(),
                        baseFormat.getChannels() * 2,
                        baseFormat.getSampleRate(),
                        false);
                AudioInputStream dais = AudioSystem.getAudioInputStream(decodeFormat, ais);
                this.clip[i] = AudioSystem.getClip();
                this.clip[i].open(dais);
                FloatControl volume = (FloatControl) this.clip[i].getControl(FloatControl.Type.MASTER_GAIN);
                float gain = (float) ((volume.getMaximum() - volume.getMinimum()) * Math.log10(vol * 9f + 1f)
                        + volume.getMinimum());
                gain = Math.min(Math.max(gain, volume.getMinimum()), volume.getMaximum());
                volume.setValue(gain);
                if (looping) {
                    this.clip[0].addLineListener(new LineListener() {
                        @Override
                        public void update(LineEvent event) {
                            if (event.getType() == LineEvent.Type.STOP) {
                                if (run) {
                                    play();
                                }
                            }
                        }
                    });
                }
            }
        } catch (UnsupportedAudioFileException | IOException | LineUnavailableException ex) {
            Logger.getLogger(SoundPlayer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void play() {
        if (this.clip == null) {
            return;
        }
        this.run = true;
        try {
            for (Clip c : this.clip) {
                if (!c.isRunning()) {

                    c.setFramePosition(0);
                    c.start();
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void stop() {
        if (this.clip == null) {
            return;
        }
        this.run = false;
        for (Clip c : this.clip) {
            if (c.isRunning()) {
                c.stop();
            }
        }
    }

    public void close() {
        if (this.clip == null) {
            return;
        }
        stop();
        for (Clip c : this.clip) {
            if (c.isRunning()) {
                c.close();
            }
        }
    }

    public void setVolume(float vol) {
        if (this.clip == null) {
            return;
        }
        for (Clip c : this.clip) {
            FloatControl volume = (FloatControl) c.getControl(FloatControl.Type.MASTER_GAIN);
            // (Vol_max - Vol_min)*Log( x*9+1 ) - Vol_min ; x (0.0f <-> 1.0f)
            float gain = (float) ((volume.getMaximum() - volume.getMinimum()) * Math.log10(vol * 9f + 1f)
                    + volume.getMinimum());
            gain = Math.min(Math.max(gain, volume.getMinimum()), volume.getMaximum());
            // System.out.println("Max vol:" + volume.getMaximum() + " Min vol:" +
            // volume.getMinimum() + " Gain: " + gain + " Vol:" + volume.getValue());
            volume.setValue(gain);
        }
    }

}