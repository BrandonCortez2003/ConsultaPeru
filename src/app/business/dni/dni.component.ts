import { Component } from '@angular/core';
import { ApiDniService } from '../../services/api-dni.service';
import { CommonModule } from '@angular/common';
//import { AppMaterialModule } from '../../app.material.module';
import { FormsModule } from '@angular/forms';
import { HistorialConsultaService } from '../../services/historial-consulta.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import Swal from 'sweetalert2';

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
  dni = dni.trim(); // Evita errores con espacios

  if (dni === '') return;

  const existe = this.historialService.existeEnHistorial(dni);

if (existe) {
   Swal.fire({
    title: 'DNI YA CONSULTADO',
    text: `El DNI ${dni} ya existe en tu historial.`,
    icon: 'warning',
    confirmButtonText: 'Ok, gracias',
    confirmButtonColor: '#19446dff'
  });

  this.dniData = {
    nombres: existe.nombres ?? '',
    apellido_paterno: existe.apellido_paterno ?? '',
    apellido_materno: existe.apellido_materno ?? '',
    nombre_completo: existe.nombre,
    numero: existe.dni
  };

  return;
}

  // Si NO está → llamar al API
  this.apiDniService.buscarPorDni(dni).subscribe(
    (response) => {
      if (response.success) {
        this.dniData = response.data;

        const nombreCompleto = `${response.data.apellido_paterno} ${response.data.apellido_materno} ${response.data.nombres}`;

        this.historialService.addToSearchHistory(dni, nombreCompleto);
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
