import { Test, TestingModule } from '@nestjs/testing';
import { MasterAssignmentsController } from './master-assignments.controller';
import { MasterAssignmentsService } from './master-assignments.service';

describe('MasterAssignmentsController', () => {
  let controller: MasterAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MasterAssignmentsController],
      providers: [MasterAssignmentsService],
    }).compile();

    controller = module.get<MasterAssignmentsController>(MasterAssignmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
