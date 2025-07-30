import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isOpen = false;
  isLoggedIn = false;
  userName = 'EzUser';
  isUserMenuOpen = false;
  searchInput = '';


  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Beginner Lessons', path: '/beginner-lessons' },
    { label: 'Chord Library', path: '/chord-library' },
    { label: 'Bollywood Songs', path: '/bollywood-songs' },
    { label: 'Contact', path: '/contact' }
  ];

  ngOnInit() {
    // this.auth.isLoggedIn$.subscribe((status: boolean) => {
    //   this.isLoggedIn = status;
    //   this.userName = this.auth.getUserName();
    // });
  }

  

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.closeUserMenu();
  }

  closeMenu() {
    this.isOpen = false;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) this.closeMenu();
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }


  onSearch() {
    const trimmedQuery = this.searchInput.trim();
    if (trimmedQuery) {
      console.log('Search:', trimmedQuery);
    }
  }
}
