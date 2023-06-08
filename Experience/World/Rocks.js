import * as THREE from 'three';

import Experience from '../Experience';

export default class Rocks {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physics = this.experience.world.physics;

    this.setModel();
  }

  setModel() {
    this.rocks = {};

    // options
    this.rocks.options = {};
    this.rocks.options.width = this.physics.rocks.options.width;
    this.rocks.options.height = this.physics.rocks.options.height;
    this.rocks.options.depth = this.physics.rocks.options.depth;
    this.rocks.options.count = this.physics.rocks.options.count;

    // geometry
    this.rocks.geometry = new THREE.BoxGeometry(
      this.rocks.options.width,
      this.rocks.options.height,
      this.rocks.options.depth
    );

    // material
    this.rocks.material = new THREE.MeshLambertMaterial({ color: 0xdddddd });

    // create mesh
    this.rocks.group = new THREE.Group();
    for (let i = 0; i < this.rocks.options.count; i++) {
      const mesh = new THREE.Mesh(this.rocks.geometry, this.rocks.material);
      mesh.castShadow = true;
      this.rocks.group.add(mesh);
    }
    this.scene.add(this.rocks.group);
  }

  resize() {}

  update() {
    this.rocks.group.children.forEach((child, index) => {
      child.position.copy(this.physics.rocks.bodies[index].position);
      child.quaternion.copy(this.physics.rocks.bodies[index].quaternion);
    });
  }
}
