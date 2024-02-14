import { TestBed } from '@angular/core/testing';

import { ParticipantePagoService } from './participante-pago.service';

describe('ParticipantePagoService', () => {
  let service: ParticipantePagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantePagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
