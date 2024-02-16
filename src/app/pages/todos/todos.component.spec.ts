import {ComponentFixture, TestBed, tick, fakeAsync, flush} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TodosComponent } from './todos.component';
import { TODOS } from '../../interfaces/todos.interface';
import { OfflineEventsService } from '../../services/offline-events.service';
import { NotificationService } from '../../services/notification.service';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import {NotificationComponent} from "../../components/notification/notification.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let routerSpy: any;
  let offlineEventsServiceSpy: jasmine.SpyObj<OfflineEventsService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  const todosMock: TODOS[] = [
    { name: 'Task 1', status: '0' },
    { name: 'Task 2', status: '1' },
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    offlineEventsServiceSpy = jasmine.createSpyObj('OfflineEventsService', ['addToStack', 'getStack', 'clearStack', 'deleteStack']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'warning', 'error', 'notification']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, TodosComponent, NotificationComponent, HttpClientTestingModule, HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 'testuser' } } } },
        { provide: Router, useValue: routerSpy },
        { provide: OfflineEventsService, useValue: offlineEventsServiceSpy },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos for the given user on init', () => {
    localStorage.setItem('todolist', JSON.stringify([{ username: 'testuser', todos: todosMock }]));
    component.ngOnInit();

    // console.log('tt', component.todos, component.username);
    expect(component.todos).toEqual(todosMock);
  });
  it('should navigate to search page on goBack()', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should add a new todo item', fakeAsync(() => {
    const newTodo = 'New Task';
    component.newtodo = newTodo;
    component.networkStatus = true; // Assuming online status
    const addTodoItemSpy = spyOn(component, 'addTodoItem').and.callThrough();
    // @ts-ignore
    // const resetStoredItemsSpy: string = spyOn(component, 'resetStoredItems').and.callThrough();
    component.addTodoItem();
    expect(addTodoItemSpy).toHaveBeenCalled();
    expect(offlineEventsServiceSpy.addToStack).not.toHaveBeenCalled();
    // expect(resetStoredItemsSpy).toHaveBeenCalled();
    expect(component.newtodo).toEqual('New Task');
    expect(component.todos.length).toEqual(1);
    expect(component.todos[component.todos.length-1].name).toEqual(newTodo);
    flush();
  }));
  it('should delete a todo item', fakeAsync(() => {
    const todoItem = todosMock[0];
    const confirmSpy = spyOn(window, 'confirm').and.returnValue(true);
    component.todos = todosMock;
    component.networkStatus = true; // Assuming online status
    const deleteItemSpy = spyOn(component, 'deleteTodoItem').and.callThrough();
    // @ts-ignore
    // const resetStoredItemsSpy = spyOn(component, 'resetStoredItems').and.callThrough();
    component.deleteTodoItem(todoItem);
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete a todo item?');
    expect(deleteItemSpy).toHaveBeenCalledWith(todoItem);
    expect(offlineEventsServiceSpy.addToStack).not.toHaveBeenCalled();
    // expect(resetStoredItemsSpy).toHaveBeenCalled();
    expect(component.todos.length).toEqual(2);
    expect(component.todos[component.todos.length - 1].name).toEqual('Task 2');
  }));

});
