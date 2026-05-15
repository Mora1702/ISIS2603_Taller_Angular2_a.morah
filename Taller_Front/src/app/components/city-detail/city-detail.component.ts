import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherDetail } from '../../models/weather.model';
import { City } from '../../models/city.model';
import { WeatherRecord } from '../../models/weather-record.model';
import { WeatherService } from '../../services/weather.service';
import { WeatherRecordService } from '../../services/weather-record.service';

/*
 * Implementar:
 * HU-03 — Detalle de Ciudad con Clima (Ver TALLER.md Parte B)
 * HU-04 — Historial de Registros de Clima (Ver TALLER.md Parte D)
 */

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-detail.component.html'
})
export class CityDetailComponent implements OnChanges {
  private weatherService = inject(WeatherService);
  private weatherRecordService = inject(WeatherRecordService);

  @Input() city!: City;
  weatherDetail: WeatherDetail | null = null;
  loading: boolean = false;
  weatherRecords: WeatherRecord[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city'] && this.city) {
      this.weatherRecordService.getRecords(this.city.id)
        .subscribe(records => this.weatherRecords = records);

      this.loading = true;
      this.weatherDetail = null;
      this.weatherService.getWeather(this.city.name)
        .subscribe({
          next: weather => {
            this.weatherDetail = weather;
            this.loading = false;
          },
          error: () => {
            this.weatherDetail = null;
            this.loading = false;
          }
        });
    }
  }

  saveWeather(): void {
   this.weatherService.getWeather(this.city.name)
    .subscribe(weather => {
      const record = {
        tempC: weather.temp_c,
        condition: weather.condition,
        humidity: weather.humidity
      };
      this.weatherRecordService.saveRecord(this.city.id, record)
        .subscribe(() => {
          this.weatherRecordService.getRecords(this.city.id)
            .subscribe(records => this.weatherRecords = records);
        });
    });
  }
}