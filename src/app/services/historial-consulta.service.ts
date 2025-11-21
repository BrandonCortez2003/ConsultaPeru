import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistorialConsultaService {
  private searchHistory: any[] = [];
  historyUpdated: EventEmitter<string[]> = new EventEmitter();
  searchQuerySelected: EventEmitter<string> = new EventEmitter(); // Nuevo evento
  constructor() {
    this.loadSearchHistory();
  }

  private loadSearchHistory() {
    if (typeof localStorage !== 'undefined') {
      const history = localStorage.getItem('searchHistory');
      if (history) {
        this.searchHistory = JSON.parse(history);
      }
    }
  }

getSearchHistory(): any[] {
  return this.searchHistory;
}

addToSearchHistory(dni: string, nombreCompleto: string) {
  const item = {
    dni,
    nombre: nombreCompleto,
    fecha: new Date().toLocaleString()
  };

  this.searchHistory.push(item);
  localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  this.historyUpdated.emit(this.searchHistory);
}

  clearSearchHistory() {
    this.searchHistory = [];
    localStorage.removeItem('searchHistory');
    this.historyUpdated.emit(this.searchHistory);
  }

  selectFromHistory(item: any) {
  this.searchQuerySelected.emit(item); // Emitir el OBJETO COMPLETO
}

  exportarHistorialTxt() {
  const historial = this.getSearchHistory(); 

  if (!historial || historial.length === 0) {
    alert("No hay historial para exportar");
    return;
  }

  let contenido = '';

  historial.forEach((item: any) => {
    contenido += `DNI: ${item.dni} - Nombre: ${item.nombre} - Fecha: ${item.fecha}\n`;
  });

  const blob = new Blob([contenido], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'historial_consultas.txt';
  link.click();

  window.URL.revokeObjectURL(url);
}

exportarHistorialExcel() {
  const historial = this.getSearchHistory();

  if (!historial || historial.length === 0) {
    alert("No hay historial para exportar");
    return;
  }

  // Agregamos estilos CSS para que Excel muestre las celdas correctamente
  let tabla = `
    <table border="1" style="border-collapse: collapse;">
      <tr style="font-weight: bold; background: #f0f0f0;">
        <th style="padding: 5px; border: 1px solid #000;">DNI</th>
        <th style="padding: 5px; border: 1px solid #000;">Nombre</th>
        <th style="padding: 5px; border: 1px solid #000;">Fecha</th>
      </tr>
  `;

  historial.forEach((item: any) => {
    tabla += `
      <tr>
        <td style="padding: 5px; border: 1px solid #000;">${item.dni}</td>
        <td style="padding: 5px; border: 1px solid #000;">${item.nombre}</td>
        <td style="padding: 5px; border: 1px solid #000;">${item.fecha}</td>
      </tr>
    `;
  });

  tabla += `</table>`;

  const blob = new Blob([tabla], { type: "application/vnd.ms-excel" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "historial_consultas.xls";
  link.click();

  window.URL.revokeObjectURL(url);
}
}