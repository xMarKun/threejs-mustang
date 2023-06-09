import Experience from '../Experience';

export default class Controls {
  constructor() {
    this.experience = new Experience();

    this.setActions();
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      this.setTouch();
    } else {
      this.setKeyboard();
    }
  }

  setActions() {
    this.actions = {};
    this.actions.forward = false;
    this.actions.right = false;
    this.actions.backward = false;
    this.actions.left = false;
    this.actions.brake = false;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.actions.forward = false;
        this.actions.right = false;
        this.actions.backward = false;
        this.actions.left = false;
        this.actions.brake = false;
      }
    });
  }

  setKeyboard() {
    this.keyboard = {};
    this.keyboard.events = {};

    this.keyboard.events.keydown = (event) => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          this.actions.forward = true;
          break;

        case 's':
        case 'ArrowDown':
          this.actions.backward = true;
          break;

        case 'a':
        case 'ArrowLeft':
          this.actions.left = true;
          break;

        case 'd':
        case 'ArrowRight':
          this.actions.right = true;
          break;

        case 'b':
          this.actions.brake = true;
          break;
      }
    };

    this.keyboard.events.keyup = (event) => {
      switch (event.key) {
        case 'w':
        case 'ArrowUp':
          this.actions.forward = false;
          break;

        case 's':
        case 'ArrowDown':
          this.actions.backward = false;
          break;

        case 'a':
        case 'ArrowLeft':
          this.actions.left = false;
          break;

        case 'd':
        case 'ArrowRight':
          this.actions.right = false;
          break;

        case 'b':
          this.actions.brake = false;
          break;
      }
    };

    document.addEventListener('keydown', this.keyboard.events.keydown);
    document.addEventListener('keyup', this.keyboard.events.keyup);
  }

  setTouch() {
    this.touch = {};
    this.touch.events = {};
    this.touch.events.touchstart = {};
    this.touch.events.touchend = {};

    this.touch.elms = {};
    this.touch.elms.forward = document.getElementById('ctrl-forward');
    this.touch.elms.backward = document.getElementById('ctrl-backward');
    this.touch.elms.left = document.getElementById('ctrl-left');
    this.touch.elms.right = document.getElementById('ctrl-right');
    this.touch.elms.brake = document.getElementById('ctrl-brake');
    this.touch.elms.ctrl = document.getElementById('ctrl');

    this.touch.elms.ctrl.style.display = 'block';

    this.touch.events.touchstart.ctrl = (event) => {
      event.preventDefault();
    };
    this.touch.events.touchstart.forward = () => {
      this.actions.forward = true;
    };
    this.touch.events.touchstart.backward = () => {
      this.actions.backward = true;
    };
    this.touch.events.touchstart.left = () => {
      this.actions.left = true;
    };
    this.touch.events.touchstart.right = () => {
      this.actions.right = true;
    };
    this.touch.events.touchstart.brake = () => {
      this.actions.brake = true;
    };

    this.touch.events.touchend.forward = () => {
      this.actions.forward = false;
    };
    this.touch.events.touchend.backward = () => {
      this.actions.backward = false;
    };
    this.touch.events.touchend.left = () => {
      this.actions.left = false;
    };
    this.touch.events.touchend.right = () => {
      this.actions.right = false;
    };
    this.touch.events.touchend.brake = () => {
      this.actions.brake = false;
    };

    this.touch.elms.ctrl.addEventListener('touchstart', this.touch.events.touchstart.ctrl);
    this.touch.elms.forward.addEventListener('touchstart', this.touch.events.touchstart.forward);
    this.touch.elms.backward.addEventListener('touchstart', this.touch.events.touchstart.backward);
    this.touch.elms.left.addEventListener('touchstart', this.touch.events.touchstart.left);
    this.touch.elms.right.addEventListener('touchstart', this.touch.events.touchstart.right);
    this.touch.elms.brake.addEventListener('touchstart', this.touch.events.touchstart.brake);

    this.touch.elms.forward.addEventListener('touchend', this.touch.events.touchend.forward);
    this.touch.elms.backward.addEventListener('touchend', this.touch.events.touchend.backward);
    this.touch.elms.left.addEventListener('touchend', this.touch.events.touchend.left);
    this.touch.elms.right.addEventListener('touchend', this.touch.events.touchend.right);
    this.touch.elms.brake.addEventListener('touchend', this.touch.events.touchend.brake);
  }

  resize() {}

  update() {}
}
