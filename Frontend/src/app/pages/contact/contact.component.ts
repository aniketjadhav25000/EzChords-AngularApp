// src/app/pages/contact/contact.component.ts
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms'; // <-- Import FormsModule here
import { CommonModule } from '@angular/common'; // <-- Also important for standalone components for *ngIf, *ngFor
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

// IMPORTANT: Declare particlesJS to inform TypeScript about its existence
declare var particlesJS: any;

@Component({
  selector: 'app-contact',
  standalone: true, // <--- Keep this line as it's how your component is set up
  imports: [ // <--- ADD THIS IMPORTS ARRAY FOR STANDALONE COMPONENTS
    CommonModule, // Provides NgIf, NgFor, etc.
    FormsModule   // <--- THIS IS WHERE FormsModule NEEDS TO BE FOR STANDALONE COMPONENTS
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {
  // Form properties
  name: string = '';
  email: string = '';
  message: string = '';
  sending: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';

  @ViewChild('contactForm') contactForm!: NgForm; // Access the form for validation state

  constructor() { }

  ngOnInit(): void {
    // You can perform other initialization here if needed
  }

  ngAfterViewInit(): void {
    // Initialize particles.js here after the view has been rendered
    // This ensures the '#particles-js' element is available in the DOM.
    if (particlesJS) { // Check if particlesJS is loaded
      particlesJS('particles-js', {
        particles: {
          number: {
            value: 120, // More particles for a denser star field
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ffffff' // White stars
          },
          shape: {
            type: 'circle', // Circular particles
            stroke: {
              width: 0,
              color: '#000000'
            },
            polygon: {
              nb_sides: 5
            }
          },
          opacity: {
            value: 0.7, // Base opacity
            random: true, // Random initial opacity
            anim: {
              enable: true,
              speed: 0.5, // Slower twinkling
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 2.5, // Slightly larger particles
            random: true, // Random sizes for variety
            anim: {
              enable: false, // No size animation
              speed: 40,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: false, // No lines between particles for a cleaner star look
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 0.7, // Very slow, subtle drift
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out', // Particles move out of bounds and reappear
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: false, // Disable interaction on hover
              mode: 'grab'
            },
            onclick: {
              enable: false, // Disable interaction on click
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        retina_detect: true,
        // Add a very dark background color to the canvas itself for a deeper space look
        canvas: {
            backgroundColor: '#0a0a2a'
        }
      });
    } else {
        console.error('particles.js library not loaded.');
    }
  }

sendEmail(): void {
  if (this.contactForm.form.valid) {
    this.sending = true;
    this.successMsg = '';
    this.errorMsg = '';

    const userMessageParams = {
      from_name: this.name,
      from_email: this.email,
      message: this.message
    };

    const thankYouParams = {
      to_name: this.name,
      to_email: this.email,
      message: this.message
    };

    // 1. Send message to admin
    emailjs
      .send(
        'service_qi3vlwv',
        'template_ggtxgfn', // Admin receives message
        userMessageParams,
        'pu6flC4R_MymSYKsa'
      )
      .then(() => {
        // 2. Send thank-you email to user
        return emailjs.send(
          'service_qi3vlwv',
          'template_63bp1qb', // User receives thank-you
          thankYouParams,
          'pu6flC4R_MymSYKsa'
        );
      })
      .then(() => {
        this.successMsg = 'Your message has been sent and a thank-you email was sent to you!';
        this.contactForm.resetForm();
        this.sending = false;
      })
      .catch((error) => {
        console.error('FAILED...', error);
        this.errorMsg = 'Failed to send message. Please try again later.';
        this.sending = false;
      });
  } else {
    this.errorMsg = 'Please fill out all required fields correctly.';
  }
}




}