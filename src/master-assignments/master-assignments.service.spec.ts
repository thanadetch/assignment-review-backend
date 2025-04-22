import { Test, TestingModule } from '@nestjs/testing';
import { MasterAssignmentsService } from './master-assignments.service';

describe('MasterAssignmentsService', () => {
  let service: MasterAssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterAssignmentsService],
    }).compile();

    service = module.get<MasterAssignmentsService>(MasterAssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
