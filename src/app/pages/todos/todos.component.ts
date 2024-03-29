import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TODOList, TODOS } from '../../interfaces/todos.interface';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from '../../components/input-text/input-text.component';
import { fromEvent, map, merge, of, Subscription } from 'rxjs';
import { TodosService } from '../../services/todos.service';
import {
  OfflineEventsService,
  OEvent,
} from '../../services/offline-events.service';
import {NotificationService} from "../../services/notification.service";
import {NotificationComponent} from "../../components/notification/notification.component";

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [NgForOf, NgIf, FormsModule, InputTextComponent, NotificationComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  username: string = '';
  todos: TODOS[] = [];
  errors: string[] = [];
  newtodo: string = '';
  showAddBlock: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodosService,
    private offlineEventsService: OfflineEventsService,
    private notifyService: NotificationService
  ) {}

  ngOnInit() {
    this.checkNetworkStatus();
    this.username = this.route.snapshot.params['id'];
    let storedTodolist = localStorage.getItem('todolist');
    // console.log('ll', storedTodolist, this.username);
    if (storedTodolist){
      let storedJsonObj = JSON.parse(storedTodolist);
      // console.log('mm', storedJsonObj);
      this.todos = storedJsonObj.find(
        (item: TODOList) => {
          // console.log(item.username.toLowerCase(), this.username);
          return item.username.toLowerCase() === this.username
        },
      )?.todos;
      // console.log('pp', this.todos);
    }
    else{
      this.goBack();
    }
  }
  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline'),
    )
      .pipe(map(() => navigator.onLine))
      .subscribe((status) => {
        this.networkStatus = status;
        if(status){
          this.saveStoredData();
          this.notifyService.success("Network status: Online");
        }
        else
          this.notifyService.error('Network status: Offline');
      });
  }
  saveStoredData() {
    console.log('saving');
    let offlineEvents: OEvent[] = this.offlineEventsService.getStack();
    if(offlineEvents !== undefined)
      this.triggerOfflineEvents(offlineEvents);
  }
  triggerOfflineEvents(offlineEvents: OEvent[]) {
    if (offlineEvents.length === 0) {
      this.notifyService.error('No pending events to execute');
      return;
    }
    offlineEvents.map((item: OEvent) => {
      switch (item.type) {
        case 'delete':
          // @ts-ignore
          this.todoService.deleteTodoItem(item.params.username, item.params?.todoName)
            .subscribe((data) => {
              this.notifyService.success(
                'deleted an item for user '+
                item.params?.username + '- todo: ' + item.params?.todoName
              );
              this.offlineEventsService.deleteStack(item);
            });
          break;
        case 'post':
          // @ts-ignore
          this.todoService.addTodoItemToUsername(item.params?.username, {
              name: item.params?.todoName,
              status: item.params?.status,
            })
            .subscribe((data) => {
              this.notifyService.success(
                'added an item for user '+
                item.params?.username+
                '- todo: '+
                item.params?.todoName
              );
              this.offlineEventsService.deleteStack(item);
            });
          break;
        case 'patch':
          // @ts-ignore
          this.todoService.updateTodoStatByUsername(item.params?.username,
              item.params?.todoName,
              item.params?.status,
            )
            .subscribe((data) => {
              this.notifyService.success(
                'patched an item for user '+
                item.params?.username+
                '- todo: '+
                item.params?.todoName+
                ' wth status: '+
                item.params?.status
              );
              this.offlineEventsService.deleteStack(item);
            });
      }
    });
  }
  goBack() {
    localStorage.removeItem('todolist');
    this.router.navigate(['/search']);
  }
  addTodoItemEnter(ev: KeyboardEvent) {
    if (ev.code === 'Enter') {
      this.addTodoItem();
    }
  }
  addTodoItem() {
    if (this.newtodo.length > 0) {
      this.todos = [
        ...this.todos,
        {
          name: this.newtodo,
          status: '0',
        },
      ];
      if (!this.networkStatus) {
        this.offlineEventsService.addToStack({
          params: {
            username: this.username,
            todoName: this.newtodo,
            status: '0',
          },
          type: 'post',
        });
        this.newtodo = '';
        this.resetStoredItems();
      } else {
        this.todoService
          .addTodoItemToUsername(this.username, {
            name: this.newtodo,
            status: '0',
          })
          .subscribe((data) => {
            this.newtodo = '';
            this.resetStoredItems();
          });
      }
    }
  }

  private resetStoredItems() {
    let storedTodolist = localStorage.getItem('todolist');
    if (storedTodolist) {
      storedTodolist = JSON.parse(storedTodolist).map((item: TODOList) => {
        if (item.username.toLowerCase() === this.username) {
          item.todos = this.todos;
        }
        return item;
      });
      localStorage.setItem('todolist', JSON.stringify(storedTodolist));
    }
  }

  changeStatus(todoItem: TODOS) {
    todoItem.status = todoItem.status === '1' ? '0' : '1';
    if (!this.networkStatus) {
      this.offlineEventsService.addToStack({
        params: {
          username: this.username,
          todoName: todoItem.name,
          status: todoItem.status,
        },
        type: 'patch',
      });
    } else {
      this.todoService
        .updateTodoStatByUsername(this.username, todoItem.name, todoItem.status)
        .subscribe((data) => {
          // updated
        });
    }
    this.resetStoredItems();
  }

  deleteTodoItem(todoItem: TODOS) {
    const deleteConfirmStat: boolean = confirm(
      'Are you sure you want to delete a todo item?',
    );

    if (!deleteConfirmStat) {
      return; // Exit early if deletion is not confirmed
    }

    const deleteItem = () => {
      this.todos = this.todos.filter((item) => item.name !== todoItem.name);
      this.resetStoredItems();
    };

    if (!this.networkStatus) {
      this.offlineEventsService.addToStack({
        params: {
          username: this.username,
          todoName: todoItem.name,
        },
        type: 'delete',
      });
      deleteItem();
    } else {
      this.todoService
        .deleteTodoItem(this.username, todoItem.name)
        .subscribe(() => {
          deleteItem();
        });
    }
  }
}
