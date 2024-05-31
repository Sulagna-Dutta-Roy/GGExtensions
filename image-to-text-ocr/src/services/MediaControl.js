class MediaControl {
  constructor() {
    this.muted = [];
  }
  muteElement = elem => {
    if (!elem.muted) {
      elem.muted = true;
      elem.pause();
      this.muted.push(elem);
    }
  };
  mutePage = () => {
    const elems = document.querySelectorAll("video, audio");
    [].forEach.call(elems, elem => {
      this.muteElement(elem);
    });
  };
  unmutePage = () => {
    this.muted.map(elem => {
      elem.muted = false;
      elem.play();
    });
    this.muted = [];
  };
}
const mediaControl = new MediaControl();
export default mediaControl;
