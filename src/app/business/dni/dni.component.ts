import { Component } from '@angular/core';
import { ApiDniService } from '../../services/api-dni.service';
import { CommonModule } from '@angular/common';
//import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { HistorialConsultaService } from '../../services/historial-consulta.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dni',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dni.component.html',
  styleUrl: './dni.component.css'
})
export default class DNIComponent {
  dniData: any = null;
  aia: string = '';

  constructor(private apiDniService: ApiDniService, private historialService: HistorialConsultaService) { 

  this.historialService.searchQuerySelected.subscribe(query => {
    this.aia = query;
    this.buscarPorDni(query); // Realizar búsqueda cuando se selecciona del historial
  });
}

  buscarPorDni(dni: string) {
    if (dni.trim() === '') return;

    this.apiDniService.buscarPorDni(dni).subscribe(
      (response) => {
        console.log(response);
        if (response.success) {
          this.dniData = response.data;
          this.historialService.addToSearchHistory(dni); // Agregar consulta al historial
        } else {
          console.error('Error en la respuesta:', response.message);
        }
      },
      (error) => {
        console.error('Error al buscar información por DNI:', error);
      }
    );
    
  }

}
