import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { CreateWorkspaceUseCase } from 'src/application/use-cases/workspaces/create-workspace-use-case';
import { CreateWorkspaceController } from 'src/presentation/controllers/create-workspace-controller';
import { GetUserWorkspacesController } from 'src/presentation/controllers/get-user-workspaces-controller';
import { GetUserWorkspacesUseCase } from 'src/application/use-cases/workspaces/get-user-workspaces-use-case';
import { UpdateWorkspaceController } from 'src/presentation/controllers/update-workspace-controller';
import { UpdateWorkspaceUseCase } from 'src/application/use-cases/workspaces/update-workspace-use-case';
import { AddWorkspaceMemberController } from 'src/presentation/controllers/add-workspace-member-controller';
import { AddWorkspaceMemberUseCase } from 'src/application/use-cases/workspaces/add-workspace-member-use-case';
import { IsMemberRoleValidator } from 'src/application/core/dtos/custom-validators/is-member-role';
import { RemoveWorkspaceMemberController } from 'src/presentation/controllers/remove-workspace-member-controller';
import { RemoveWorkspaceMemberUseCase } from 'src/application/use-cases/workspaces/remove-workspace-member-use-case';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    CreateWorkspaceController,
    GetUserWorkspacesController,
    UpdateWorkspaceController,
    AddWorkspaceMemberController,
    RemoveWorkspaceMemberController,
  ],
  providers: [
    CreateWorkspaceUseCase,
    GetUserWorkspacesUseCase,
    UpdateWorkspaceUseCase,
    AddWorkspaceMemberUseCase,
    IsMemberRoleValidator,
    RemoveWorkspaceMemberUseCase,
  ],
})
export class WorkspaceModule {}
