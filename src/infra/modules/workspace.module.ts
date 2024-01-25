import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { CreateWorkspaceUseCase } from 'src/application/use-cases/workspaces/create-workspace-use-case';
import { CreateWorkspaceController } from 'src/presentation/controllers/create-workspace-controller';
import { GetUserWorkspacesController } from 'src/presentation/controllers/get-user-workspaces-controller';
import { GetUserWorkspacesUseCase } from 'src/application/use-cases/workspaces/get-user-workspaces-use-case';
import { UpdateWorkspaceController } from 'src/presentation/controllers/update-workspace-controller';
import { UpdateWorkspaceUseCase } from 'src/application/use-cases/workspaces/update-workspace-use-case';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    CreateWorkspaceController,
    GetUserWorkspacesController,
    UpdateWorkspaceController,
  ],
  providers: [
    CreateWorkspaceUseCase,
    GetUserWorkspacesUseCase,
    UpdateWorkspaceUseCase,
  ],
})
export class WorkspaceModule {}
