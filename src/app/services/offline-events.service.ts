import { Injectable } from '@angular/core';

interface EventParams {
  username: string;
  todoName?: string;
  status?: string;
}
export interface OEvent {
  url?: string;
  type: string;
  params?: EventParams;
}

@Injectable({
  providedIn: 'root',
})
export class OfflineEventsService {
  constructor() {}

  addToStack(event: OEvent): void {
    // @ts-ignore
    let events: OEvent[] =
      JSON.parse(localStorage.getItem('offlineEvents')) || [];
    events.push(event);
    localStorage.setItem('offlineEvents', JSON.stringify(events));
  }
  getStack(): OEvent[] {
    // @ts-ignore
    return JSON.parse(localStorage.getItem('offlineEvents')) || [];
  }

  clearStack(): void {
    localStorage.removeItem('offlineEvents');
  }

  deleteStack(item: OEvent) {
    let localEventsData = this.getStack();
    if (localEventsData.length === 0) {
      return;
    }
    localEventsData = localEventsData.filter(
      (litem) =>
        litem.type !== item.type &&
        litem.params?.username !== item.params?.username &&
        litem.params?.todoName !== item.params?.todoName,
    );
    localStorage.setItem('offlineEvents', JSON.stringify(localEventsData));
  }
}
