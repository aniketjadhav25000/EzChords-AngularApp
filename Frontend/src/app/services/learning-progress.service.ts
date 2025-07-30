// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { LearningProgressService } from '../services/learning-progress.service';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent {
//   currentPhase = 1; // Default to phase 1
//   isLoggedIn = false; // Authentication status

//   constructor(
//     private router: Router,
//     private progressService: LearningProgressService
//   ) {
//     // Check user progress if authenticated
//     this.checkUserProgress();
//   }

//   private checkUserProgress() {
//     // In a real app, you would check authentication status and progress
//     const userProgress = this.progressService.getUserProgress();
//     if (userProgress) {
//       this.currentPhase = userProgress.currentPhase;
//       this.isLoggedIn = true;
//     }
//   }

//   startPhase(phaseNumber: number) {
//     if (phaseNumber > this.currentPhase && !this.isLoggedIn) {
//       // Prompt to login/signup if trying to access locked phase
//       this.router.navigate(['/auth'], { 
//         queryParams: { 
//           returnUrl: '/learning-path',
//           phase: phaseNumber 
//         }
//       });
//       return;
//     }

//     // Navigate to learning path with phase parameter
//     this.router.navigate(['/learning-path'], { 
//       queryParams: { phase: phaseNumber },
//       state: { 
//         scrollToPhase: true,
//         animateTransition: true 
//       }
//     });

//     // Track phase access in analytics/service
//     this.trackPhaseAccess(phaseNumber);
//   }

//   startLearning() {
//     // Redirect to user's current phase or first phase
//     const targetPhase = this.isLoggedIn ? this.currentPhase : 1;
    
//     this.router.navigate(['/learning-path'], {
//       queryParams: { phase: targetPhase },
//       state: { highlightCurrentPhase: true }
//     });

//     // Track learning start event
//     this.trackLearningStart();
//   }

//   private trackPhaseAccess(phaseNumber: number) {
//     // Implement analytics tracking
//     console.log(`Phase ${phaseNumber} accessed`);
//     this.progressService.logPhaseAccess(phaseNumber);
//   }

//   private trackLearningStart() {
//     // Implement analytics tracking
//     console.log('Learning journey started');
//     this.progressService.logLearningStart();
//   }
// }