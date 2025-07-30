import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-user-data',
  standalone: true,
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserDataComponent {
  content: string = '';
  message: string = '';

  constructor(private userDataService: UserDataService) {}

  save() {
    this.userDataService.saveData(this.content).subscribe({
      next: () => this.message = 'Saved successfully!',
      error: () => this.message = 'Failed to save data.'
    });
  }

  ngOnInit() {
    this.userDataService.getData().subscribe({
      next: (res: any) => this.content = res.content,
      error: () => this.message = 'Failed to load data.'
    });
  }
}
