import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { debounceTime, Observable, Subject } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import { TODOList } from '../../interfaces/todos.interface';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [FormsModule, InputTextComponent, NgForOf, NgForOf, NgIf],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export class SearchPageComponent implements OnInit, OnDestroy {
  search: string = '';
  searchText: string = 'Search by Username';
  username: string = '';
  errors: string[] | undefined;

  todosList: TODOList[] = [];

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 500;

  constructor(
    private todoService: TodosService,
    private router: Router,
  ) {}
  get todosListLengthStat() {
    return this.todosList.length > 0;
  }

  getUserInfo(data: string) {
    if (data.length > 3) {
      this.searchSubject.next(data);
    }
  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(this.debounceTimeMs))
      .subscribe((searchValue) => {
        this.triggerSearch(searchValue);
      });
  }

  triggerSearch(searchValue: string) {
    this.todoService.getUsernames(searchValue).subscribe((data: TODOList[]) => {
      this.todosList = data;
      localStorage.setItem('todolist', JSON.stringify(data));
    });
  }

  goToNextPage(username: string) {
    this.router.navigate([`/todos/${username.toLowerCase()}`]);
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
