import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { CreateWorkspaceUseCase } from 'src/application/use-cases/workspaces/create-workspace-use-case';
import { CreateWorkspaceController } from 'src/presentation/controllers/workspace/create-workspace-controller';
import { GetUserWorkspacesController } from 'src/presentation/controllers/workspace/get-user-workspaces-controller';
import { GetUserWorkspacesUseCase } from 'src/application/use-cases/workspaces/get-user-workspaces-use-case';
import { UpdateWorkspaceController } from 'src/presentation/controllers/workspace/update-workspace-controller';
import { UpdateWorkspaceUseCase } from 'src/application/use-cases/workspaces/update-workspace-use-case';
import { AddWorkspaceMemberController } from 'src/presentation/controllers/workspace/add-workspace-member-controller';
import { AddWorkspaceMemberUseCase } from 'src/application/use-cases/workspaces/add-workspace-member-use-case';
import { RemoveWorkspaceMemberController } from 'src/presentation/controllers/workspace/remove-workspace-member-controller';
import { RemoveWorkspaceMemberUseCase } from 'src/application/use-cases/workspaces/remove-workspace-member-use-case';
import { ChangeWorkspaceMemberRoleUseCase } from 'src/application/use-cases/workspaces/change-workspace-member-role-use-case';
import { IsMemberRoleValidator } from 'src/application/core/dtos/workspace/custom-validators/is-member-role';
import { ChangeWorkspaceMemberRoleController } from 'src/presentation/controllers/workspace/change-workspace-member-role-controller';
import { WorkspaceInviteNotification } from 'src/application/services/notification/workspace-invite-notification';
import { SocketModule } from './socket.module';
import { GetWorkspaceBasicInfoController } from 'src/presentation/controllers/workspace/get-workspace-basic-info-controller';
import { GetWorkspaceUseCase } from 'src/application/use-cases/workspaces/get-workspace-use-case';

@Module({
  imports: [PrismaModule, SocketModule, AuthModule],
  controllers: [
    CreateWorkspaceController,
    GetUserWorkspacesController,
    UpdateWorkspaceController,
    AddWorkspaceMemberController,
    RemoveWorkspaceMemberController,
    ChangeWorkspaceMemberRoleController,
    GetWorkspaceBasicInfoController,
  ],
  providers: [
    CreateWorkspaceUseCase,
    GetUserWorkspacesUseCase,
    UpdateWorkspaceUseCase,
    AddWorkspaceMemberUseCase,
    IsMemberRoleValidator,
    RemoveWorkspaceMemberUseCase,
    ChangeWorkspaceMemberRoleUseCase,
    WorkspaceInviteNotification,
    GetWorkspaceUseCase,
  ],
})
export class WorkspaceModule {}
