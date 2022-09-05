import { EmployeeService } from './shared/employee-service.service';
import { ExportService } from './shared/export-service/export-service.service';
import { IEmployee } from './employee-meta-data';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'smart';

  readonly STORAGE_KEY = 'EMPLOYEE_TABLE';

  public columnList = [
    {field: 'nome', label: 'Nome', visible: true},
    
  ];


  public dataSource = new BehaviorSubject<IEmployee[]>([])

  public search = ''

  public status = 'All'

  public itemsCount = 0;

  public itemsPerPage = 5;

  public currentPage = 1;

  private errorMessages = validations;

  public form!: FormGroup;

  public list: any[] = [];

  ExcelData: any
  

  constructor(
    private fb: FormBuilder,
    private exportService: ExportService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem(this.STORAGE_KEY)) {
      const preferences = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');

      this.columnList = this.columnList.map((column) => {
        const preference = preferences.find((data: { field: string; }) => data.field === column.field);

        if (preference) {
          column.visible = preference.visible;
        }

        return column;
      });
    }

    this.getEmployees()
  }

  ReadExcel(event:any) {
    let file = event.target.files[0]

    let fileReader = new FileReader()
    fileReader.readAsBinaryString(file)

    fileReader.onload = (e)=>{
      let workBook = XLSX.read(fileReader.result,{type:'binary'})
      let sheetNames = workBook.SheetNames
      this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      console.log(this.ExcelData)
    
    }
  }

  get displayedColumns() {
    return this.columnList
      .filter(column => column.visible)
      .map(column => column.field)
  }

  criar(empregado: {nome: string}) {
    this.employeeService.adicionar(empregado).subscribe((res) => {
      console.log(res)
    })
  }

  getEmployees(): void {
    this.employeeService.obterTodos().subscribe(res => this.dataSource.next(res))
    this.formInit(this.list)
  }

  persistColumnPreference(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.columnList));
  }

  formInit(employeeList: IEmployee[]): void {
    this.form = this.fb.group({
      employeeList: this.fb.array(employeeList.map((employee: IEmployee) => {
        return this.fb.group({
          id: [employee.id],
          name: [employee.nome || '',
            Validators.compose([
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(32)
            ])
          ]
        })
      }))
    })
  }

  getHeaderList() {
    return this.columnList
      .filter(column => column.field !== 'action')
      .map(column => column.field);
  }

  getRowList() {
    return this.dataSource.value.map((employee: IEmployee) => {
      return {
        nome: employee.nome
      };
    });
  }

  downloadAsExcel(): void {
    const rowList = this.getRowList();
    const headerList = this.getHeaderList();

    const csvData = this.exportService.convertToCsv(rowList, headerList);

    const csvBlob = new Blob([csvData], {type: 'text/csv'});
    const objectUrl = URL.createObjectURL(csvBlob);
    const link: any = document.createElement('a');

    link.download = 'employee_list.csv';
    link.href = objectUrl;
    link.click();
  }

}

  // getError(index: number, property: string, validations: string[]) {
  //     // @ts-ignore: Object is possibly 'null'.
  //   const control = this.form.get('employeeList').get(index.toString()).get(property);

  //   if (!control || !control.dirty || !control.errors) {
  //     return false;
  //   }

  //   for (const validation of validations) {
  //     if (control.errors[validation]) {
  //       return Object.keys(this).errorMessages[property][validation];
  //     }
  //   }

  //   return false;
  // }

export const validations = {
  status: {
    required: 'Please provide status'
  },
  name: {
    required: 'Please provide name',
    minlength: 'Min length should be 5',
    maxlength: 'Max length should be 32'
  },
  salary: {
    required: 'Please provide salary',
    min: 'Salary can\'t be less than 0'
  },
  email: {
    required: 'Please provide email',
    pattern: 'Please provide valid email'
  }
};
