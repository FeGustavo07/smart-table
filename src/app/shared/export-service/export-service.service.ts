import {Injectable} from '@angular/core';
//import * as jsPDF from 'jspdf';
//import 'jspdf-autotable';
//import {UserOptions} from 'jspdf-autotable';


// interface IjsPDFWithPlugin extends jsPDF {
//   autoTable: (option: UserOptions) => jsPDF;
// }

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() {
  }


  convertToCsv(rowList: any[], headerList: string[]) {
    let str = '';
    let row = '';

    row += headerList.join(', '); // generates header row
    str += row + '\r\n';

    for (let i = 0; i < rowList.length; i++) {
      let line = (i + 1).toString();

      for (const index in headerList) {
        if (index) {
          const header = headerList[index];
          line += ', ' + rowList[i][header]; // generates rows line by line for the excel
        }
      }

      str += line + '\r\n';
    }

    return str;
  }

}