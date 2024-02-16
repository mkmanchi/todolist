import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodosService } from './todos.service';
import { TODOList, TODOS } from '../interfaces/todos.interface';

describe('TodosService', () => {
  let service: TodosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService]
    });
    service = TestBed.inject(TodosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get usernames with search value', () => {
    const searchValue = 'example';
    const mockData: TODOList[] = [{ username: 'example', todos: [] }];

    service.getUsernames(searchValue).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`/api/mytodos?user=${searchValue}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should add todo item to username', () => {
    const username = 'example';
    const todoObj: TODOS = { name: 'Example task', status: 'pending' };
    const mockData: TODOList[] = [{ username: 'example', todos: [todoObj] }];

    service.addTodoItemToUsername(username, todoObj).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`/api/mytodos/${username}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockData);
  });

  it('should delete todo item to username', () => {
    const username = 'example';
    const todoObj: TODOS = { name: 'Example task', status: 'pending' };
    const mockData: TODOList[] = [{ username: 'example', todos: [] }];

    service.deleteTodoItem(username, todoObj.name).subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`/api/mytodos/${username}/${todoObj.name}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockData);
  });
  it('should patch status for a todo item to username', () => {
    const username = 'example';
    const todoObj: TODOS = { name: 'Example task', status: '0' };
    const mockData: TODOList[] = [{ username: 'example', todos: [{name: 'Example task', status: '1' }]}];

    service.updateTodoStatByUsername(username, todoObj.name, '1').subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`/api/mytodos/${username}/${todoObj.name}/status`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockData);
  });
});
