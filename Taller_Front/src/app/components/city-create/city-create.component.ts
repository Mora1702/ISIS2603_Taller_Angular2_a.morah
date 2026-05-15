import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-city-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './city-create.component.html'
})
export class CityCreateComponent implements OnInit {
  private countryService = inject(CountryService);
  private cityService = inject(CityService);
  @Output() cityCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  cityName: string = '';
  selectedCountryId: number | null = null;
  countries: Country[] = [];

  ngOnInit(): void {
    this.countryService.getCountries()
      .subscribe(countries => this.countries = countries);
  }

  onSave(): void {
    if (!this.cityName.trim() || this.selectedCountryId === null) {
      return;
    }

    const newCity = {
      name: this.cityName.trim()
    };

    this.cityService.createCity(this.selectedCountryId, newCity)
      .subscribe(() => {
        this.cityCreated.emit();
        this.cityName = '';
        this.selectedCountryId = null;
      });
  }

  onCancel(): void {
    this.cancel.emit();
    this.cityName = '';
    this.selectedCountryId = null;
  }
}
