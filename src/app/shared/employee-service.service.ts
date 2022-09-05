import { IEmployee } from './../employee-meta-data';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient) { }

  obterTodos(){
    return this.httpClient.get<IEmployee[]>(`${API_PATH}empregado`)
  }


  adicionar(empregado: IEmployee){
    return this.httpClient.post<IEmployee>(`${API_PATH}empregado`, empregado)
  }


  delete(empregadoId: number){
    return this.httpClient.delete<void>(`${API_PATH}empregado/${empregadoId}`)
  }
}