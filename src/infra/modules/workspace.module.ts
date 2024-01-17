import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma/prisma.module';
import { AuthModule } from './auth.module';
import { CreateWorkspaceUseCase } from 'src/application/use-cases/workspaces/create-workspace-use-case';
import { CreateWorkspaceController } from 'src/presentation/controllers/create-workspace-controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CreateWorkspaceController],
  providers: [CreateWorkspaceUseCase],
})
export class WorkspaceModule {}
