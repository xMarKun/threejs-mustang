import * as THREE from 'three';

import Experience from '../Experience';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physics = this.experience.world.physics;
    this.actualChassis = this.experience.world.mustang.actualChassis;

    this.setSunLight();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.camera.left = -25;
    this.sunLight.shadow.camera.bottom = -25;
    this.sunLight.shadow.camera.right = 25;
    this.sunLight.shadow.camera.top = 25;

    // 影の位置を調整するためのヘルパーを表示
    // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
    // this.scene.add(helper);

    this.sunLight.position.set(1.5, 7, 3); //影の位置を調整
    this.scene.add(this.sunLight);

    this.ambientLight = new THREE.AmbientLight('#ffffff', 1);
    this.scene.add(this.ambientLight);
  }

  resize() {}

  update() {}
}
