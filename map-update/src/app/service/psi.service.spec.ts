import { TestBed } from '@angular/core/testing';

import { PsiService } from './psi.service';

describe('PsiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PsiService = TestBed.get(PsiService);
    expect(service).toBeTruthy();
  });
});
