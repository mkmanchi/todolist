import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SearchPageComponent } from './search-page.component';
import { TodosService } from '../../services/todos.service';

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let todosService: TodosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule, SearchPageComponent],
      providers: [TodosService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call todos service to fetch usernames on triggering search', () => {
    const searchValue = 'test';
    const mockTodosList = [{ username: 'testuser', todos: [] }];
    spyOn(todosService, 'getUsernames').and.returnValue(of(mockTodosList));
    component.triggerSearch(searchValue);
    expect(todosService.getUsernames).toHaveBeenCalledWith(searchValue);
    expect(component.todosList).toEqual(mockTodosList);
  });

  it('should navigate to next page when goToNextPage is called', () => {
    const username = 'testuser';
    spyOn(component.router, 'navigate');
    component.goToNextPage(username);
    expect(component.router.navigate).toHaveBeenCalledWith([`/todos/${username.toLowerCase()}`]);
  });

  it('should unsubscribe from searchSubject on component destroy', () => {
    spyOn(component.searchSubject, 'complete');
    component.ngOnDestroy();
    expect(component.searchSubject.complete).toHaveBeenCalled();
  });
});
