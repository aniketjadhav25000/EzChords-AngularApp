// home.component.ts
import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BOLLYWOOD_SONGS } from '../../shared/models/songs.data'; // Import BOLLYWOOD_SONGS
import { Song } from '../../shared/models/song.model'; // Import Song interface

// IMPORTANT: Declare particlesJS to inform TypeScript about its existence
declare var particlesJS: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {


  
  features = [
    {
      icon: '識',
      text: 'Structured learning path from basics to advanced techniques',
      color: 'text-blue-400',
    },
    {
      icon: '而',
      text: 'Interactive audio previews with adjustable tempo',
      color: 'text-purple-400',
    },
    {
      icon: '導',
      text: 'Mobile-friendly interface for practice anywhere',
      color: 'text-green-400',
    },
    {
      icon: '櫨',
      text: 'Daily challenges and warm-up routines',
      color: 'text-orange-400',
    },
    {
      icon: '叱',
      text: 'Curated collection of popular Bollywood songs',
      color: 'text-pink-400',
    },
    {
      icon: '噫',
      text: 'Free forever with no login required',
      color: 'text-amber-400',
    },
  ];

  testimonials = [
    {
      name: 'Riya Patel',
      role: 'College Student',
      message:
        'I never thought I could play guitar, but EzChords made it so simple! I played my first song in just 3 days.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kavita', // Example random avatar URL for Riya
    },
    {
      name: 'Arjun Sharma',
      role: 'Software Engineer',
      message:
        'The Bollywood song collection is amazing. The simplified chords make it so easy to follow along.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rahul', // Example random avatar URL for Arjun
    },
    {
      name: 'Priya Desai',
      role: 'Music Teacher',
      message:
        'I recommend EzChords to all my students. The visual chord diagrams are the best I\'ve seen.',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya', // Example random avatar URL for Priya
    },
  ];

  // Helper function to convert difficulty string to a number (1-5 scale)
  private getDifficultyNumeric(difficulty?: string): number {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 1;
      case 'intermediate':
        return 3;
      case 'advanced':
        return 5;
      default:
        return 0; // Or handle as appropriate
    }
  }

  // Populate popularSongs from BOLLYWOOD_SONGS, limiting to the first 4
  popularSongs = BOLLYWOOD_SONGS.slice(0, 4).map((song) => ({
    id: song.id, // Add ID for navigation
    title: song.title,
    artist: song.artist || 'Unknown Artist', // Provide a fallback if artist is undefined
    difficulty: this.getDifficultyNumeric(song.difficulty),
    image:
      song.imageUrl || 'https://placehold.co/300x200/cccccc/000000?text=No+Image', // Provide a fallback image
  }));

  constructor(private renderer: Renderer2, private router: Router) {}

  ngAfterViewInit() {
    // Re-initialize particles.js here after the view has been rendered
    // This ensures the '#particles-js' element is available in the DOM.
    if (particlesJS) {
      // Check if particlesJS is loaded
      particlesJS('particles-js', {
        particles: {
          number: {
            value: 120, // More particles for a denser star field
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#ffffff', // White particles
          },
          shape: {
            type: 'circle', // Particles are circles
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: false,
            },
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
            },
          },
          line_linked: {
            enable: false, // No lines between particles
          },
          move: {
            enable: true,
            speed: 1, // Slower movement for a calm effect
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'bubble', // Particles grow on hover
            },
            onclick: {
              enable: true,
              mode: 'push', // New particles are pushed on click
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
        // Add a very dark background color to the canvas itself for a deeper space look
        canvas: {
          backgroundColor: '#0a0a2a',
        },
      });
    } else {
      console.error('particles.js library not loaded.');
    }
    this.initializeAnimations();
  }

  handleGetStarted() {
    this.router.navigate(['/beginner-lessons']); // Changed path
  }

  handleLearning() {
    this.router.navigate(['/learning-path']); // Changed path
  }

  handleExploreChords() {
    this.router.navigate(['/chord-library']); // Changed path
  }

  handleFeatureClick(feature: string) {
    switch (feature) {
      case 'lessons':
        this.router.navigate(['/lessons']);
        break;
      case 'chords':
        this.router.navigate(['/chords']);
        break;
      case 'bollywood':
        this.router.navigate(['/songs']);
        break;
    }
  }

  handleBollywoodSongs() {
    this.router.navigate(['/bollywood-songs']); // Changed path
  }

  handleExploreFeatures() {
    const element = document.getElementById('features-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleSongSelect(song: any) {
    // Redirect to the song detail page using the song's ID
    this.router.navigate(['/bollywood-songs', song.id]);
  }

  handleTestimonialClick(event: Event) {
    const el = event.currentTarget as HTMLElement;
    this.renderer.addClass(el, 'transform');
    this.renderer.addClass(el, 'scale-110');
    this.renderer.setStyle(el, 'z-index', '10');
    setTimeout(() => {
      this.renderer.removeClass(el, 'transform');
      this.renderer.removeClass(el, 'scale-110');
      this.renderer.removeStyle(el, 'z-index');
    }, 350);
  }

  animateListItem(event: Event) {
    const el = event.currentTarget as HTMLElement;
    const icon = el.querySelector('.interactive-icon') as HTMLElement;
    this.renderer.addClass(icon, 'animate-spin');
    this.renderer.addClass(icon, 'text-amber-400');
    setTimeout(() => {
      this.renderer.removeClass(icon, 'animate-spin');
      this.renderer.removeClass(icon, 'text-amber-400');
    }, 600);
  }

  initializeAnimations() {
    this.initializeScrollAnimations();
  }

  initializeScrollAnimations() {
    // Select all elements that should animate on scroll
    const scrollAnimateElements = document.querySelectorAll('.scroll-animate');

    // Create a new IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the element is intersecting (visible in the viewport)
          if (entry.isIntersecting) {
            // Add the animation class
            this.renderer.addClass(entry.target, 'animate-fade-in-up-scroll');
          } else {
            // Optionally, remove the class when out of view to reset the animation
            // this.renderer.removeClass(entry.target, 'animate-fade-in-up-scroll');
          }
        });
      },
      {
        // Configure the observer options
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    // Observe each element
    scrollAnimateElements.forEach((el) => {
      observer.observe(el);
    });
  }
}