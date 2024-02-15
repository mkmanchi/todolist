import { TestBed } from '@angular/core/testing';

import { OfflineEventsService } from './offline-events.service';

describe('OfflineEventsService', () => {
  let service: OfflineEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
