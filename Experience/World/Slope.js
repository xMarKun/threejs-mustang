import * as THREE from 'three';

import Experience from '../Experience';

export default class Slope {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physics = this.experience.world.physics;

    this.setModel();
  }

  setModel() {
    this.slope = {};

    // options
    this.slope.options = {};
    this.slope.options.width = this.physics.slope.options.width;
    this.slope.options.height = this.physics.slope.options.height;
    this.slope.options.depth = this.physics.slope.options.depth;

    // geometry
    this.slope.geometry = new THREE.BoxGeometry(this.slope.options.width, this.slope.options.height, this.slope.options.depth);

    // material
    this.slope.material = new THREE.MeshLambertMaterial({ color: 0xdddddd });

    // create mesh
    this.slope.mesh = new THREE.Mesh(this.slope.geometry, this.slope.material);
    this.slope.mesh.castShadow = true;
    this.scene.add(this.slope.mesh);
  }

  resize() {}

  update() {
    this.slope.mesh.position.copy(this.physics.slope.body.position);
    this.slope.mesh.quaternion.copy(this.physics.slope.body.quaternion);
  }
}
