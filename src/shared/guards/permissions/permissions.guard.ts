import { PERMISSIONS_KEY } from '@/modules/auth/decorators/permissions.decorator';
import { ROLES_KEY } from '@/modules/auth/decorators/roles.decorator';
import { ITokenPayload } from '@/modules/users/interfaces/user.interface';
import { IUsersService, USERS_SERVICE_TOKEN } from '@/modules/users/interfaces/users.service.interface';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => USERS_SERVICE_TOKEN)) private readonly userSvc: IUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: ITokenPayload = request.user;

    // if (user?.isSuperAdmin) {
    //   return true;
    // }

    console.log('user', user);

    const handlerRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler()) || [];
    const classRoles = this.reflector.get<string[]>(ROLES_KEY, context.getClass()) || [];
    const requiredRoles = [...new Set([...handlerRoles, ...classRoles])];

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }

    try {
      //   const userRoles = await this.userSvc.findWithRolesByProject(user.userId, projectId);

      //   if (!userRoles || userRoles.length === 0) {
      //     return false;
      //   }

      //   let targetRole = null;
      //   for (const userRole of userRoles) {
      //     if (requiredRoles.includes(userRole.role?.name)) {
      //       targetRole = userRole;
      //       break;
      //     }
      //   }

      //   if (!targetRole || !targetRole.role || !targetRole.role.id) {
      //     return false;
      //   }

      //   if (!requiredPermissions || requiredPermissions.length === 0) {
      //     return true;
      //   }

      //   const roleId = targetRole.role.id;
      //   const userPermissions = await this.userSvc.findWithPermissions(user.userId, roleId, projectId);

      //   if (!userPermissions || userPermissions.length === 0) {
      //     return false;
      //   }

      //   const permissionNames = userPermissions.map(p => p.name);
      //   const hasPermissions = requiredPermissions.some(permission => permissionNames.includes(permission));

      //   if (!hasPermissions) {
      //     return false;
      //   }

      return true;
    } catch (error) {
      if (!(error instanceof ForbiddenException) && !(error instanceof UnauthorizedException)) {
        this.logger.error(`[PermissionsGuard] Error checking permissions: ${error.message}`, error);
        throw new ForbiddenException('You do not have permission to access this resource.');
      }

      throw error;
    }
  }
}
