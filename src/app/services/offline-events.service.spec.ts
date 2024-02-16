import { TestBed } from '@angular/core/testing';
import { OfflineEventsService, OEvent } from './offline-events.service';

describe('OfflineEventsService', () => {
  let service: OfflineEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add event to stack', () => {
    const event: OEvent = {
      type: 'add',
      params: { username: 'user1', todoName: 'task1', status: 'pending' }
    };

    service.addToStack(event);

    const stack = service.getStack();
    expect(stack.length).toBe(1);
    expect(stack[0]).toEqual(event);
  });

  it('should get empty stack', () => {
    const stack = service.getStack();
    expect(stack.length).toBe(0);
  });

  it('should clear stack', () => {
    service.addToStack({
      type: 'add',
      params: { username: 'user1', todoName: 'task1', status: 'pending' }
    });

    service.clearStack();
    const stack = service.getStack();
    expect(stack.length).toBe(0);
  });

  it('should delete specific event from stack', () => {
    const event1: OEvent = {
      type: 'add',
      params: { username: 'user1', todoName: 'task1', status: 'pending' }
    };
    const event2: OEvent = {
      type: 'delete',
      params: { username: 'user1', todoName: 'task1', status: 'pending' }
    };
    const event3: OEvent = {
      type: 'update',
      params: { username: 'user2', todoName: 'task2', status: 'completed' }
    };

    service.addToStack(event1);
    service.addToStack(event2);
    service.addToStack(event3);

    service.deleteStack(event2);

    const stack = service.getStack();
    expect(stack.length).toBe(2);
    expect(stack).not.toContain(event2);
  });

  it('should not delete event if stack is empty', () => {
    const event: OEvent = {
      type: 'add',
      params: { username: 'user1', todoName: 'task1', status: 'pending' }
    };

    service.deleteStack(event);

    const stack = service.getStack();
    expect(stack.length).toBe(0);
  });

  it('should not delete event if event not found in stack', () => {
    service.addToStack({
      type: 'add',
      params: { username: 'user1', todoName: 'task1', status: 'pending' }
    });

    const event: OEvent = {
      type: 'add',
      params: { username: 'user2', todoName: 'task2', status: 'pending' }
    };

    service.deleteStack(event);

    const stack = service.getStack();
    expect(stack.length).toBe(1);
  });
});
