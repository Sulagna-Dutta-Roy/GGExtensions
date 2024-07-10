/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package SpaceCraft.Object.Spaceship;

import java.awt.Point;
import java.io.Serializable;

/**
 *
 * @author Krcma
 */
public class MoveControler implements Serializable {

    public float xAC, yAC;
    private final Spaceship SS;

    public MoveControler(Spaceship ss) {
        this.xAC = 0.0f;
        this.yAC = 0.0f;
        this.SS = ss;
    }

    public void refresh(Point goTo) {
        float x_ = goTo.x - this.SS.getPosition().x;
        float y_ = goTo.y - this.SS.getPosition().y;
        float mx = 5.5f - (this.SS.getTotalMass() / (20f + this.SS.getNumberOfEngines() * 5));
        mx = mx < 0.8f ? 0.8f : mx;
        mx = this.SS.getNumberOfEngines() == 0 ? 0f : mx;
        float maxX = Math.abs(x_) <= 150 ? (Math.abs(x_) / 150) * mx : mx;
        float maxY = Math.abs(y_) <= 150 ? (Math.abs(y_) / 150) * mx : mx;
        if (maxX > maxY) {
            maxY *= Math.abs(y_ / x_);
        } else if (maxX < maxY) {
            maxX *= Math.abs(x_ / y_);
        }
        float fsu = 0.03f * ((45 + this.SS.getNumberOfEngines() * 5) / this.SS.getTotalMass());
        float fsd = 0.7f * ((45 + this.SS.getNumberOfEngines() * 5) / this.SS.getTotalMass());
        fsu = fsu < 0.01f ? 0.01f : fsu;
        fsd = fsd < 0.03f ? 0.03f : fsd;
        fsu = fsu > 0.6f ? 0.6f : fsu;
        fsd = fsd > 0.14f ? 0.14f : fsd;
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
    }

}
