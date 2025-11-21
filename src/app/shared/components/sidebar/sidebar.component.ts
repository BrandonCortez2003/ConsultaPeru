import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HistorialConsultaService } from '../../../services/historial-consulta.service';
import { ApiDniService } from '../../../services/api-dni.service';
import { HistorialItem } from '../../../interfaces/historial-item.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
 searchHistory: HistorialItem[] = [];
  searchQuery: string = '';

  constructor(private historialService: HistorialConsultaService, private apiDniService: ApiDniService) {}


  

  ngOnInit(): void {

    this.historialService.historyUpdated.subscribe((history: HistorialItem[]) => {
      this.searchHistory = history;
    });

    this.searchHistory = this.historialService.getSearchHistory();
  }

  manejarHistorialClick(item: any) {
  this.searchQuery = item.dni;       // Esto llena el input del DNI
  //this.historialService.selectFromHistory(item); 
}

  limpiarHistorial() {
    this.historialService.clearSearchHistory();
  }

  exportarHistorialTxt() {
  this.historialService.exportarHistorialTxt();
}
 exportarHistorialExcel() {
  this.historialService.exportarHistorialExcel();
}
 exportarHistorialWord() {
  this.historialService.exportWord();
}
}