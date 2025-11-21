import { EventEmitter, Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
//import { saveAs } from 'file-saver';
//import { Document, Packer, Paragraph, TextRun } from "docx";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } 
  from "docx";

import { saveAs } from "file-saver";

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

  // Convertir los datos a una hoja
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(historial);

  // Crear el libro
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Historial': worksheet },
    SheetNames: ['Historial']
  };

  // Generar el archivo XLSX
  const excelBuffer: any = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  // Guardar archivo
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, 'historial_consultas.xlsx');
}

exportWord(): void {
  const historial = this.getSearchHistory();

  if (!historial || historial.length === 0) {
    alert("No hay historial para exportar");
    return;
  }

  // Crear filas de la tabla (primero encabezados)
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph("DNI")] }),
        new TableCell({ children: [new Paragraph("Nombre")] }),
        new TableCell({ children: [new Paragraph("Fecha")] }),
      ],
    }),
    ...historial.map((item: any) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(item.dni)] }),
          new TableCell({ children: [new Paragraph(item.nombre)] }),
          new TableCell({ children: [new Paragraph(item.fecha)] }),
        ],
      })
    ),
  ];

  // Documento Word
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Historial de Consultas",
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph(" "), // espacio
          new Table({
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  // Exportar a archivo .docx
  Packer.toBlob(doc).then((blob: Blob) => {
    saveAs(blob, "historial_consultas.docx");
  });
}

}