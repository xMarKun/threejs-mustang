import Experience from '../Experience';

export default class Sounds {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.setSettings();
  }

  setSettings() {
    this.sounds = {};
    this.sounds.items = {};

    // filter resources
    const itemKeys = Object.keys(this.resources.items);
    const filteredItemKeys = itemKeys.filter((key) => this.resources.items[key] instanceof Audio);
    filteredItemKeys.forEach((key) => {
      this.sounds.items[key] = this.resources.items[key];
    });
  }

  play(name) {
    const sound = this.sounds.items[name];
    sound.play();
  }

  resize() {}

  update() {}
}
