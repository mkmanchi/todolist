import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TODOList, TODOS } from '../interfaces/todos.interface';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  constructor(private http: HttpClient) {}

  getUsernames(searchValue: string): Observable<TODOList[]> {
    return this.http.request<TODOList[]>(
      'GET',
      `/api/mytodos?user=${searchValue}`,
    );
  }

  addTodoItemToUsername(
    username: string,
    todoObj: TODOS,
  ): Observable<TODOList[]> {
    return this.http.post<TODOList[]>(`/api/mytodos/${username}`, todoObj);
  }

  deleteTodoItem(username: string, todo: string): Observable<TODOList[]> {
    return this.http.delete<TODOList[]>(`/api/mytodos/${username}/${todo}`);
  }

  updateTodoStatByUsername(
    username: string,
    todo: string,
    status: string,
  ): Observable<TODOList[]> {
    return this.http.patch<TODOList[]>(
      `/api/mytodos/${username}/${todo}/status`,
      {
        status: status,
      },
    );
  }
}
