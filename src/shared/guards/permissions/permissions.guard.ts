import { PERMISSIONS_KEY } from '@/modules/auth/decorators/permissions.decorator';
import { ITokenPayload } from '@/modules/users/interfaces/user.interface';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const user: ITokenPayload = request.user;

      this.logger.debug(`Checking permissions for user: ${user?.id}`);

      if (!user || !user.role) {
        this.logger.warn('User or user role not found in request');
        return false;
      }

      const requiredPermissions =
        this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]) || [];

      this.logger.debug(`Required permissions: ${requiredPermissions.join(', ')}`);

      if (requiredPermissions.length === 0) {
        this.logger.debug('No specific permissions required, access granted based on role');
        return true;
      }

      const userPermissions = user.role.permissions || [];

      if (userPermissions.length === 0) {
        this.logger.warn('User has no permissions');
        return false;
      }

      const permissionNames = userPermissions.map(permission => permission.name);

      const hasRequiredPermissions = requiredPermissions.some(permission => permissionNames.includes(permission));

      if (!hasRequiredPermissions) {
        this.logger.warn(`User lacks required permissions: [${requiredPermissions.join(', ')}]`);
        return false;
      }

      this.logger.debug('Access granted - user has required role and permissions');
      return true;
    } catch (error) {
      if (!(error instanceof ForbiddenException) && !(error instanceof UnauthorizedException)) {
        this.logger.error(`Error checking permissions: ${error.message}`, error.stack);
        throw new ForbiddenException('You do not have permission to access this resource.');
      }

      throw error;
    }
  }
}
