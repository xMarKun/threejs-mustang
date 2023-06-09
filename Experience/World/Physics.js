import * as CANNON from 'cannon-es';

import Experience from '../Experience';
import Demo from '../Utils/Demo';

export default class Physics {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.controls = this.experience.world.controls;
    this.demo = new Demo();

    this.setWorld();
    this.setMaterials();
    this.setCar();
    this.setFloor();
    this.setRocks();
    this.setSlope();
  }

  setWorld() {
    this.world = new CANNON.World();
    this.world.gravity = new CANNON.Vec3(0, -9.82, 0);
  }

  setMaterials() {
    this.materials = {};

    // All materials
    this.materials.items = {};
    this.materials.items.floor = new CANNON.Material('floor');
    this.materials.items.wheel = new CANNON.Material('wheel');

    // Contact between materials
    this.materials.contacts = {};

    this.materials.contacts.floorWheel = new CANNON.ContactMaterial(this.materials.items.floor, this.materials.items.wheel, { friction: 0.3, restitution: 0, contactEquationStiffness: 1000 });
    this.world.addContactMaterial(this.materials.contacts.floorWheel);
  }

  setCar() {
    this.car = {};

    // options
    this.car.options = {};
    this.car.options.chassisWidth = 1.34827;
    this.car.options.chassisHeight = 0.748172;
    this.car.options.chassisDepth = 3.3615;
    this.car.options.chassisMass = 130;
    this.car.options.wheelRadius = 0.479;
    this.car.options.wheelFrontOffsetDepth = -0.99;
    this.car.options.wheelBackOffsetDepth = 1.04;
    this.car.options.wheelOffsetWidth = 0.55;
    this.car.options.wheelOffsetHeight = -0.16;
    this.car.options.wheelSuspensionStiffness = 25;
    this.car.options.wheelSuspensionRestLength = 0.3;
    this.car.options.wheelFrictionSlip = 2.5;
    this.car.options.wheelDampingRelaxation = 2.4;
    this.car.options.wheelDampingCompression = 4.5;
    this.car.options.wheelMaxSuspensionForce = 12500;
    this.car.options.wheelRollInfluence = 0.15;
    this.car.options.wheelMaxSuspensionTravel = 0.15;
    this.car.options.wheelCustomSlidingRotationalSpeed = 40;
    this.car.options.maxSteerVal = 0.5;
    this.car.options.maxForce = 500;
    this.car.options.brakeForce = 10;

    // Build the car chassis
    this.car.chassis = {};
    this.car.chassis.shape = new CANNON.Box(new CANNON.Vec3(this.car.options.chassisDepth / 2, this.car.options.chassisHeight / 2, this.car.options.chassisWidth / 2));
    this.car.chassis.body = new CANNON.Body({ mass: this.car.options.chassisMass });
    this.car.chassis.body.addShape(this.car.chassis.shape);
    this.car.chassis.body.position.set(0, 2, 0);

    // Add visual
    // this.car.chassis.mesh = this.demo.bodyToMesh(this.car.chassis.body);
    // this.scene.add(this.car.chassis.mesh);

    // Create the vehicle
    this.car.vehicle = new CANNON.RaycastVehicle({
      chassisBody: this.car.chassis.body,
    });

    // wheels
    this.car.wheels = {};

    this.car.wheels.options = {
      radius: this.car.options.wheelRadius / 2,
      suspensionStiffness: this.car.options.wheelSuspensionStiffness,
      suspensionRestLength: this.car.options.wheelSuspensionRestLength,
      frictionSlip: this.car.options.wheelFrictionSlip,
      dampingRelaxation: this.car.options.wheelDampingRelaxation,
      dampingCompression: this.car.options.wheelDampingCompression,
      maxSuspensionForce: this.car.options.wheelMaxSuspensionForce,
      rollInfluence: this.car.options.wheelRollInfluence,
      maxSuspensionTravel: this.car.options.wheelMaxSuspensionTravel,
      customSlidingRotationalSpeed: this.car.options.wheelCustomSlidingRotationalSpeed,
      useCustomSlidingRotationalSpeed: true,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      axleLocal: new CANNON.Vec3(0, 0, 1),
      chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0), // （ホイールの位置）後でホイール別に変更
    };

    /* Front left */
    this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelFrontOffsetDepth, this.car.options.wheelOffsetHeight, this.car.options.wheelOffsetWidth);
    this.car.vehicle.addWheel(this.car.wheels.options);

    /* Front right */
    this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelFrontOffsetDepth, this.car.options.wheelOffsetHeight, -this.car.options.wheelOffsetWidth);
    this.car.vehicle.addWheel(this.car.wheels.options);

    /* Back left */
    this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelBackOffsetDepth, this.car.options.wheelOffsetHeight, this.car.options.wheelOffsetWidth);
    this.car.vehicle.addWheel(this.car.wheels.options);

    /* Back right */
    this.car.wheels.options.chassisConnectionPointLocal.set(this.car.options.wheelBackOffsetDepth, this.car.options.wheelOffsetHeight, -this.car.options.wheelOffsetWidth);
    this.car.vehicle.addWheel(this.car.wheels.options);

    this.car.vehicle.addToWorld(this.world);

    this.car.wheels.bodies = [];
    // this.car.wheels.meshes = [];

    this.car.vehicle.wheelInfos.forEach((wheel) => {
      const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
      const wheelBody = new CANNON.Body({
        mass: 0,
        material: this.materials.items.wheel,
      });
      wheelBody.type = CANNON.Body.KINEMATIC;
      wheelBody.collisionFilterGroup = 0; // turn off collisions
      const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0);
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion);
      this.car.wheels.bodies.push(wheelBody);
      this.world.addBody(wheelBody);
      // add visual
      // const wheelMesh = this.demo.bodyToMesh(wheelBody);
      // this.car.wheels.meshes.push(wheelMesh);
      // this.scene.add(wheelMesh);
    });

    // Update the wheel bodies
    this.world.addEventListener('postStep', () => {
      for (let i = 0; i < this.car.vehicle.wheelInfos.length; i++) {
        this.car.vehicle.updateWheelTransform(i);
        const transform = this.car.vehicle.wheelInfos[i].worldTransform;
        const wheelBody = this.car.wheels.bodies[i];
        wheelBody.position.copy(transform.position);
        wheelBody.quaternion.copy(transform.quaternion);
      }
    });

    // jump !!!
    this.car.jump = () => {
      this.car.chassis.body.applyLocalImpulse(new CANNON.Vec3(0, 400, 0), new CANNON.Vec3(0, 0, 0));
    };
  }

  setFloor() {
    this.floor = {};

    this.floor.shape = new CANNON.Box(new CANNON.Vec3(100, 0.001, 100));
    this.floor.body = new CANNON.Body({ mass: 0, material: this.materials.items.floor });
    this.floor.body.addShape(this.floor.shape);
    this.world.addBody(this.floor.body);
  }

  setRocks() {
    this.rocks = {};

    // options
    this.rocks.options = {};
    this.rocks.options.width = 3;
    this.rocks.options.height = 1;
    this.rocks.options.depth = 1;
    this.rocks.options.mass = 1;
    this.rocks.options.spacing = 0.5;
    this.rocks.options.count = 12;
    this.rocks.options.rowCount = 4;
    this.rocks.options.offsetX = -5;
    this.rocks.options.offsetZ = -5;
    this.rocks.options.offsetY = 1;

    // shape
    this.rocks.shape = new CANNON.Box(new CANNON.Vec3(this.rocks.options.width / 2, this.rocks.options.height / 2, this.rocks.options.depth / 2));

    // create bodies
    this.rocks.bodies = [];
    // this.rocks.meshes = [];
    for (let i = 0; i < this.rocks.options.count; i++) {
      const body = new CANNON.Body({ mass: this.rocks.options.mass, shape: this.rocks.shape });

      const row = Math.floor(i / this.rocks.options.rowCount); // 行数の計算
      const col = i % this.rocks.options.rowCount; // 列数の計算

      const x = this.rocks.options.offsetX + col * this.rocks.options.width + col * this.rocks.options.spacing; // X 座標の計算
      const y = this.rocks.options.offsetY + row * this.rocks.options.height + row * this.rocks.options.spacing; // Y 座標の計算

      body.position.set(x, y, this.rocks.options.offsetZ);

      this.world.addBody(body);
      this.rocks.bodies.push(body);

      // Add visual
      // const mesh = this.demo.bodyToMesh(body);
      // this.rocks.meshes.push(mesh);
      // this.scene.add(mesh);
    }
  }

  setSlope() {
    this.slope = {};

    // options
    this.slope.options = {};
    this.slope.options.width = 5;
    this.slope.options.height = 3;
    this.slope.options.depth = 10;
    this.slope.options.offsetX = 0;
    this.slope.options.offsetY = -0.8;
    this.slope.options.offsetZ = 8;

    // shape
    this.slope.shape = new CANNON.Box(new CANNON.Vec3(this.slope.options.width / 2, this.slope.options.height / 2, this.slope.options.depth / 2));

    // body
    this.slope.body = new CANNON.Body({ mass: 0, material: this.materials.items.floor });
    this.slope.body.addShape(this.slope.shape);
    this.slope.body.position.set(this.slope.options.offsetX, this.slope.options.offsetY, this.slope.options.offsetZ);
    this.slope.body.quaternion.setFromEuler(Math.PI / 12, -Math.PI / 2, 0);

    this.world.addBody(this.slope.body);

    // this.slope.mesh = this.demo.bodyToMesh(this.slope.body);
    // this.scene.add(this.slope.mesh);
  }

  resize() {}

  update() {
    this.world.fixedStep();

    // car movement
    // forward and backward
    if (this.controls.actions.forward || this.controls.actions.backward) {
      const force = (this.controls.actions.forward ? -1 : 1) * this.car.options.maxForce;
      this.car.vehicle.applyEngineForce(force, 2);
      this.car.vehicle.applyEngineForce(force, 3);
    } else {
      this.car.vehicle.applyEngineForce(0, 2);
      this.car.vehicle.applyEngineForce(0, 3);
    }
    // right and left
    if (this.controls.actions.right || this.controls.actions.left) {
      const force = (this.controls.actions.right ? -1 : 1) * this.car.options.maxSteerVal;
      this.car.vehicle.setSteeringValue(force, 0);
      this.car.vehicle.setSteeringValue(force, 1);
    } else {
      this.car.vehicle.setSteeringValue(0, 0);
      this.car.vehicle.setSteeringValue(0, 1);
    }
    // brake
    if (this.controls.actions.brake) {
      this.car.vehicle.setBrake(this.car.options.brakeForce, 0);
      this.car.vehicle.setBrake(this.car.options.brakeForce, 1);
      this.car.vehicle.setBrake(this.car.options.brakeForce, 2);
      this.car.vehicle.setBrake(this.car.options.brakeForce, 3);
    } else {
      this.car.vehicle.setBrake(0, 0);
      this.car.vehicle.setBrake(0, 1);
      this.car.vehicle.setBrake(0, 2);
      this.car.vehicle.setBrake(0, 3);
    }

    // update rocks mesh position
    // this.rocks.meshes.forEach((mesh, index) => {
    //   mesh.position.copy(this.rocks.bodies[index].position);
    //   mesh.quaternion.copy(this.rocks.bodies[index].quaternion);
    // });

    // update mesh position
    // this.car.chassis.mesh.position.copy(this.car.chassis.body.position);
    // this.car.chassis.mesh.quaternion.copy(this.car.chassis.body.quaternion);
    // this.car.wheels.meshes.forEach((mesh, i) => {
    //   mesh.position.copy(this.car.wheels.bodies[i].position);
    //   mesh.quaternion.copy(this.car.wheels.bodies[i].quaternion);
    // });
  }
}
