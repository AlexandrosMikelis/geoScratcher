import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country-status-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-status-modal.component.html',
  styleUrl: './country-status-modal.component.scss'
})
export class CountryStatusModalComponent {
  @Input() country: Country | null = null;
  @Output() statusSelected = new EventEmitter<{ country: Country, status: string }>();
  @Output() closeModal = new EventEmitter<void>();

  selectStatus(status: string): void {
    if (this.country) {
      this.statusSelected.emit({ country: this.country, status });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}
