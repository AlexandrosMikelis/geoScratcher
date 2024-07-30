import { Component, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CommonModule } from '@angular/common';
import { COUNTRIES_DATA } from './countriesData';
import { CountryStatusModalComponent } from '../country-status-modal/country-status-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CountryStatusModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  countries: Country[];

  scale: number = 1;
  initialScale: number = 1;
  xOffset: number = 0;
  yOffset: number = 0;
  originX: number = 0;
  originY: number = 0;

  dragging: boolean = false;
  isDragging: boolean = false; // Flag to track dragging state
  lastX: number = 0;
  lastY: number = 0;
  containerWidth: number = 0;
  containerHeight: number = 0;

  selectedCountry: Country | null = null;
  showModal: boolean = false;

  countryToggled: boolean = false;

  constructor(private elementRef: ElementRef) {
    this.countries = COUNTRIES_DATA;
  }

  ngAfterViewInit(): void {
    this.setInitialView();
  }

  setInitialView(): void {
    const container = this.elementRef.nativeElement.querySelector('.scratch-map');
    const svg = container.querySelector('svg');
    if (!svg) return;

    this.containerWidth = container.offsetWidth + 800;
    this.containerHeight = container.offsetHeight + 300;

    const svgWidth = svg.width.baseVal.value;
    const svgHeight = svg.height.baseVal.value;

    // Calculate maximum zoom-out scale where the entire SVG fits within the container
    const scaleX = this.containerWidth / svgWidth;
    const scaleY = this.containerHeight / svgHeight;
    this.initialScale = Math.min(scaleX, scaleY);

    this.scale = this.initialScale;
    this.xOffset = (this.containerWidth - (svgWidth * this.scale)) / 2 / this.scale;
    this.yOffset = (this.containerHeight - (svgHeight * this.scale)) / 2 / this.scale;
  }

  @HostListener('wheel', ['$event'])
  onWheelScroll(event: WheelEvent): void {
    event.preventDefault();
    const scaleAmount = -event.deltaY * 0.001;
    const newScale = this.scale + scaleAmount;

    // Limiting zoom levels
    if (newScale > this.initialScale) {
      const mouseX = event.clientX - this.xOffset;
      const mouseY = event.clientY - this.yOffset;

      this.xOffset = event.clientX - mouseX * (newScale / this.scale);
      this.yOffset = event.clientY - mouseY * (newScale / this.scale);

      this.scale = newScale;
    } else {
      this.scale = this.initialScale;
      this.xOffset = 300;
      this.yOffset = 0;
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.dragging) {
      this.isDragging = true; // Set dragging state to true
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;

      // Limit dragging within container bounds
      const newXOffset = this.xOffset + dx;
      const newYOffset = this.yOffset + dy;

      // Calculate maximum allowable offsets
      const maxOffsetX = (this.containerWidth - (this.containerWidth / this.scale)) / 2;
      const maxOffsetY = (this.containerHeight - (this.containerHeight / this.scale)) / 2;

      // Apply limits
      this.xOffset = Math.max(-maxOffsetX + 600, Math.min(maxOffsetX, newXOffset));
      this.yOffset = Math.max(-maxOffsetY, Math.min(maxOffsetY, newYOffset));

      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.dragging = false;
    this.isDragging = false; // Reset dragging state to false on mouse up
  }

  onMouseEnter(event: MouseEvent): void {
    // Handle mouse enter event if needed
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    this.dragging = false;
    this.isDragging = false; // Reset dragging state to false on mouse leave
  }

  onCountryMouseEnter(countryId: string): void {
    // Handle mouse enter on a specific country
  }

  onCountryMouseLeave(countryId: string): void {
    // Handle mouse leave on a specific country
  }

  onCountryClick(event: MouseEvent): void {
    if (this.isDragging) {
      event.stopPropagation(); // Prevent click event propagation if dragging
    } else if (event.detail === 2){
      const target = event.target as SVGElement;
      const countryId = target.closest('g')?.id;
      const country = this.countries.find(c => c.id === countryId);
      if (country) {
        // this.toggleCountryVisited(country);
        console.log('Country clicked:', country.title);
      }
    }
  }

  toggleContryStatusModal(country: Country): void {
    if(!this.countryToggled){
      this.selectedCountry = country;
      this.countryToggled = !this.countryToggled
    }
    else{
      this.countryToggled = !this.countryToggled
    }
    // country.visited = !country.visited;
    this.showModal = this.countryToggled;
  }

  calculateTextPositionX(country: Country): number {
    const path = document.getElementById(country.id);
    if (!(path instanceof SVGPathElement)) return 0;

    const bbox = path.getBBox();
    return bbox.x + bbox.width / 2;
  }

  calculateTextPositionY(country: Country): number {
    const path = document.getElementById(country.id);
    if (!(path instanceof SVGPathElement)) return 0;

    const bbox = path.getBBox();
    return bbox.y + bbox.height / 2;
  }

  calculatePathLength(country: Country): any {
    return this.countries.find(obj => obj.id === country.id)?.d.length;
  }

  calculateFontSize(country: Country): number {
    const pathLength = this.calculatePathLength(country);
    return Math.max(4, Math.min(8, pathLength / 5)); // Adjust scaling factor as needed
  }

  onStatusSelected(event: { country: Country, status: string }): void {
    switch (event.status) {
      case 'visited':
        event.country.visited = !event.country.visited;
        if (event.country.visited) {
          event.country.lived = false;
          event.country.future = false;
        }
        break;
      case 'lived':
        event.country.lived = !event.country.lived; // You can add more properties as needed
        if (event.country.lived) {
          event.country.visited = false;
          event.country.future = false;
        }
        break;
      case 'future':
        event.country.future = !event.country.future; // You can add more properties as needed
        if (event.country.future) {
          event.country.visited = false;
          event.country.lived = false;
        }
        break;
    }
    this.countryToggled = !this.countryToggled
    this.showModal = false;
  }

  closeModal(): void {
    this.countryToggled = !this.countryToggled
    this.showModal = false;
  }
}
