import Experience from '../Experience';
import Mustang from './Mustang';
import Floor from './Floor';
import Environment from './Environment';
import Controls from './Controls';
import Physics from './Physics';
import Rocks from './Rocks';
import Slope from './Slope';
import Sounds from './Sounds';

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      this.sounds = new Sounds();
      this.physics = new Physics();
      this.rocks = new Rocks();
      this.slope = new Slope();
      this.floor = new Floor();
      this.mustang = new Mustang();
      this.environment = new Environment();
      this.controls = new Controls();
    });
  }

  resize() {}

  update() {
    this.physics && this.physics.update();
    this.rocks && this.rocks.update();
    this.slope && this.slope.update();
    this.mustang && this.mustang.update();
    this.environment && this.environment.update();
  }
}
