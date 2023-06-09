import Experience from '../Experience';

export default class Mustang {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.chassis = this.resources.items.mustangChassis;
    this.wheel = this.resources.items.mustangWheel;
    this.actualChassis = this.chassis.scene;
    this.actualWheel = this.wheel.scene;
    this.sounds = this.experience.world.sounds;
    this.physics = this.experience.world.physics;

    this.setModel();
    this.setKlaxon();
  }

  setModel() {
    this.actualChassis.traverse((child) => {
      child.castShadow = true;
    });
    this.actualWheel.traverse((child) => {
      child.castShadow = true;
    });

    this.scene.add(this.actualChassis);
    this.scene.add(this.actualWheel);
  }

  setKlaxon() {
    this.klaxon = {};
    this.klaxon.waitDuration = 800;
    this.klaxon.can = true;

    this.klaxon.jump = () => {
      if (this.klaxon.can) {
        this.klaxon.can = false;
        window.setTimeout(() => {
          this.klaxon.can = true;
        }, this.klaxon.waitDuration);

        this.physics.car.jump();
        this.sounds.play('klaxon');
      }
    };

    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      const klaxonElm = document.getElementById('ctrl-klaxon');
      klaxonElm.addEventListener('touchstart', () => {
        this.klaxon.jump();
      });
    } else {
      window.addEventListener('keydown', (event) => {
        event.key === ' ' && this.klaxon.jump();
      });
    }
  }

  resize() {}

  update() {
    this.actualChassis.position.copy(this.physics.car.chassis.body.position);
    this.actualChassis.position.y = this.physics.car.chassis.body.position.y - this.physics.car.options.chassisHeight / 1.3;
    this.actualChassis.quaternion.copy(this.physics.car.chassis.body.quaternion);
    this.actualWheel.children.forEach((child, i) => {
      child.position.copy(this.physics.car.wheels.bodies[i].position);
      child.quaternion.copy(this.physics.car.wheels.bodies[i].quaternion);
    });
  }
}
