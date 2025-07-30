// three-dmodel.component.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // ✅ with .js extension

@Component({
  selector: 'app-three-d-model',
  standalone: true, // ✅ Make it standalone
  template: `<div #canvasContainer class="w-full h-full"></div>`,
  styles: []
})
export class ThreeDModelComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasRef!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId!: number;

  ngAfterViewInit(): void {
    this.initScene();
    this.loadModel();
    this.animate();
  }

  initScene() {
    const width = this.canvasRef.nativeElement.clientWidth;
    const height = this.canvasRef.nativeElement.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.5, 4);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    this.scene.add(light);
  }

  loadModel() {
    const loader = new GLTFLoader();
    loader.load('assets/models/guitar.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(2, 2, 2);
      model.rotation.y = Math.PI;
      this.scene.add(model);
    });
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }
}
