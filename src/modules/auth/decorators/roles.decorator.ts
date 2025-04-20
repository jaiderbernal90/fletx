import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const RequireRoles = (...roles: string[]) => {
  return (target: any, key?: string, descriptor?: any) => {
    if (descriptor) {
      const existingRoles = Reflect.getMetadata(ROLES_KEY, descriptor.value) || [];
      const updatedRoles = [...existingRoles, ...roles];
      SetMetadata(ROLES_KEY, updatedRoles)(target, key, descriptor);
      return descriptor;
    }

    const existingRoles = Reflect.getMetadata(ROLES_KEY, target) || [];
    const updatedRoles = [...existingRoles, ...roles];
    SetMetadata(ROLES_KEY, updatedRoles)(target);
    return target;
  };
};
