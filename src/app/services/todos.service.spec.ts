import { TestBed } from '@angular/core/testing';

import { TodosService } from './todos.service';
import {HttpClientModule} from "@angular/common/http";

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(TodosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
