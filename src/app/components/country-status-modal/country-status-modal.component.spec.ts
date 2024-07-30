import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryStatusModalComponent } from './country-status-modal.component';

describe('CountryStatusModalComponent', () => {
  let component: CountryStatusModalComponent;
  let fixture: ComponentFixture<CountryStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryStatusModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
