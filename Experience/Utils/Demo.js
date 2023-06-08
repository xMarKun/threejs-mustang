import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class Demo {
  bodyToMesh(body) {
    if (!(body instanceof CANNON.Body)) {
      throw new Error('The argument passed to addVisual() is not a body');
    }

    const material = new THREE.MeshLambertMaterial({ color: 0xdddddd });

    const group = new THREE.Group();

    group.position.copy(body.position);
    group.quaternion.copy(body.quaternion);

    const meshes = body.shapes.map((shape) => {
      const geometry = this.shapeToGeometry(shape);

      return new THREE.Mesh(geometry, material);
    });

    meshes.forEach((mesh, i) => {
      const offset = body.shapeOffsets[i];
      const orientation = body.shapeOrientations[i];
      mesh.position.copy(offset);
      mesh.quaternion.copy(orientation);

      group.add(mesh);
    });

    group.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });

    return group;
  }

  shapeToGeometry(shape, { flatShading = true } = {}) {
    switch (shape.type) {
      case CANNON.Shape.types.SPHERE: {
        return new THREE.SphereGeometry(shape.radius, 8, 8);
      }

      case CANNON.Shape.types.PARTICLE: {
        return new THREE.SphereGeometry(0.1, 8, 8);
      }

      case CANNON.Shape.types.PLANE: {
        return new THREE.PlaneGeometry(500, 500, 4, 4);
      }

      case CANNON.Shape.types.BOX: {
        return new THREE.BoxGeometry(
          shape.halfExtents.x * 2,
          shape.halfExtents.y * 2,
          shape.halfExtents.z * 2
        );
      }

      case CANNON.Shape.types.CYLINDER: {
        return new THREE.CylinderGeometry(
          shape.radiusTop,
          shape.radiusBottom,
          shape.height,
          shape.numSegments
        );
      }

      case CANNON.Shape.types.CONVEXPOLYHEDRON: {
        const geometry = new THREE.Geometry();

        // Add vertices
        for (let i = 0; i < shape.vertices.length; i++) {
          const vertex = shape.vertices[i];
          geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
        }

        // Add faces
        for (let i = 0; i < shape.faces.length; i++) {
          const face = shape.faces[i];

          const a = face[0];
          for (let j = 1; j < face.length - 1; j++) {
            const b = face[j];
            const c = face[j + 1];
            geometry.faces.push(new THREE.Face3(a, b, c));
          }
        }

        geometry.computeBoundingSphere();

        if (flatShading) {
          geometry.computeFaceNormals();
        } else {
          geometry.computeVertexNormals();
        }

        return geometry;
      }

      case CANNON.Shape.types.HEIGHTFIELD: {
        const geometry = new THREE.Geometry();

        const v0 = new CANNON.Vec3();
        const v1 = new CANNON.Vec3();
        const v2 = new CANNON.Vec3();
        for (let xi = 0; xi < shape.data.length - 1; xi++) {
          for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
            for (let k = 0; k < 2; k++) {
              shape.getConvexTrianglePillar(xi, yi, k === 0);
              v0.copy(shape.pillarConvex.vertices[0]);
              v1.copy(shape.pillarConvex.vertices[1]);
              v2.copy(shape.pillarConvex.vertices[2]);
              v0.vadd(shape.pillarOffset, v0);
              v1.vadd(shape.pillarOffset, v1);
              v2.vadd(shape.pillarOffset, v2);
              geometry.vertices.push(
                new THREE.Vector3(v0.x, v0.y, v0.z),
                new THREE.Vector3(v1.x, v1.y, v1.z),
                new THREE.Vector3(v2.x, v2.y, v2.z)
              );
              const i = geometry.vertices.length - 3;
              geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
            }
          }
        }

        geometry.computeBoundingSphere();

        if (flatShading) {
          geometry.computeFaceNormals();
        } else {
          geometry.computeVertexNormals();
        }

        return geometry;
      }

      case CANNON.Shape.types.TRIMESH: {
        const geometry = new THREE.Geometry();

        const v0 = new CANNON.Vec3();
        const v1 = new CANNON.Vec3();
        const v2 = new CANNON.Vec3();
        for (let i = 0; i < shape.indices.length / 3; i++) {
          shape.getTriangleVertices(i, v0, v1, v2);
          geometry.vertices.push(
            new THREE.Vector3(v0.x, v0.y, v0.z),
            new THREE.Vector3(v1.x, v1.y, v1.z),
            new THREE.Vector3(v2.x, v2.y, v2.z)
          );
          const j = geometry.vertices.length - 3;
          geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
        }

        geometry.computeBoundingSphere();

        if (flatShading) {
          geometry.computeFaceNormals();
        } else {
          geometry.computeVertexNormals();
        }

        return geometry;
      }

      default: {
        throw new Error(`Shape not recognized: "${shape.type}"`);
      }
    }
  }
}
