// src/app/services/three-background.service.ts
import { Injectable, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Injectable({
  providedIn: 'root'
})
export class ThreeBackgroundService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private objects: THREE.Object3D[] = [];
  private clock = new THREE.Clock();

  constructor() { }

  init(container: ElementRef): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0c18);
    this.scene.fog = new THREE.FogExp2(0x0c0c18, 0.001);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 30;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.nativeElement.appendChild(this.renderer.domElement);

    // Controls (optional)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;

    // Add lights
    this.addLights();

    // Add 3D objects
    this.addGuitarModel();
    this.addFloatingNotes();
    this.addParticles();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation loop
    this.animate();
  }

  private addLights(): void {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4d76cf, 1, 100);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xcf4d4d, 1, 100);
    pointLight2.position.set(-10, -10, -10);
    this.scene.add(pointLight2);
  }

  private addGuitarModel(): void {
    // Simple guitar geometry (replace with actual model if available)
    const bodyGeometry = new THREE.SphereGeometry(5, 32, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x3d3d5c,
      shininess: 100 
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1.5, 0.5, 0.2);
    this.scene.add(body);
    this.objects.push(body);

    // Neck
    const neckGeometry = new THREE.BoxGeometry(1, 10, 1);
    const neckMaterial = new THREE.MeshPhongMaterial({ color: 0x18181b });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 5;
    this.scene.add(neck);
    this.objects.push(neck);
  }

  private addFloatingNotes(): void {
    const notes = [];
    const noteGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const colors = [0xfbbf24, 0x38bdf8, 0xa5b4fc]; // amber, blue, indigo

    for (let i = 0; i < 15; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        emissive: 0x111111,
        specular: 0xffffff,
        shininess: 30,
        transparent: true,
        opacity: 0.8
      });

      const note = new THREE.Mesh(noteGeometry, material);
      
      // Random position
      note.position.x = (Math.random() - 0.5) * 50;
      note.position.y = (Math.random() - 0.5) * 30;
      note.position.z = (Math.random() - 0.5) * 50;
      
      // Random scale
      const scale = Math.random() * 0.5 + 0.5;
      note.scale.set(scale, scale, scale);
      
      // Store original position for animation
      (note as any).originalY = note.position.y;
      (note as any).speed = Math.random() * 0.2 + 0.1;
      
      this.scene.add(note);
      notes.push(note);
    }

    this.objects = [...this.objects, ...notes];
  }

  private addParticles(): void {
    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
      
      // Color particles with a gradient
      if (i % 3 === 0) { // R
        colorArray[i] = Math.random() * 0.2 + 0.8; // 0.8-1.0
      } else if (i % 3 === 1) { // G
        colorArray[i] = Math.random() * 0.3 + 0.7; // 0.7-1.0
      } else { // B
        colorArray[i] = Math.random() * 0.5 + 0.5; // 0.5-1.0
      }
    }
    
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );
    
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colorArray, 3)
    );
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    
    this.scene.add(particlesMesh);
    this.objects.push(particlesMesh);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Animate floating notes
    this.objects.forEach(obj => {
      if (obj instanceof THREE.Mesh && obj.geometry.type === 'SphereGeometry') {
        // Float up and down
        obj.position.y = (obj as any).originalY + Math.sin(Date.now() * 0.001 * (obj as any).speed) * 2;
        
        // Rotate slowly
        obj.rotation.x += delta * 0.2;
        obj.rotation.y += delta * 0.3;
      }
    });

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}