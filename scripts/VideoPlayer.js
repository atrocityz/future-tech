const rootSelector = '[data-video-player]';

class VideoPlayer {
  selectors = {
    root: rootSelector,
    video: '[data-video-player-video]',
    panel: '[data-video-player-panel]',
    playBtn: '[data-video-player-btn]'
  }

  stateClasses = {
    isActive: 'is-active'
  }

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.videoElement = this.rootElement.querySelector(this.selectors.video);
    this.panelElement = this.rootElement.querySelector(this.selectors.panel);
    this.playBtnElement = this.rootElement.querySelector(this.selectors.playBtn);
    this.bindEvents();
  }

  onPlayBtnClick = () => {
    this.videoElement.play();
    this.videoElement.controls = true;
    this.panelElement.classList.remove(this.stateClasses.isActive);
  }

  onVideoPause = () => {
    this.videoElement.controls = false;
    this.panelElement.classList.add(this.stateClasses.isActive);
  }

  bindEvents() {
    this.playBtnElement.addEventListener('click', this.onPlayBtnClick);
    this.videoElement.addEventListener('pause', this.onVideoPause);
  }
}

class VideoPlayerCollection {
  constructor() {
    this.init();
  };

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new VideoPlayer(element);
    });
  }
}

export default VideoPlayerCollection;