import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HistorialConsultaService } from '../../../services/historial-consulta.service';
import { ApiDniService } from '../../../services/api-dni.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  searchHistory: string[] = [];
  searchQuery: string = '';

  constructor(private historialService: HistorialConsultaService, private apiDniService: ApiDniService) {}

  ngOnInit(): void {
    this.historialService.historyUpdated.subscribe((history: string[]) => {
      this.searchHistory = history;
    });
    this.searchHistory = this.historialService.getSearchHistory();
  }

  manejarHistorialClick(query: string) {
    this.searchQuery = query; // Actualizar el campo de búsqueda
    this.historialService.selectFromHistory(query); // Emitir evento para DNIComponent
  }

  limpiarHistorial() {
    this.historialService.clearSearchHistory();
  }
}