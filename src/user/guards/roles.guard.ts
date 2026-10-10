import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { role_metadata_key } from "../decorator/roles.decorator.js";
import { User, UserRole } from "../models/user.model.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(role_metadata_key,
            [
                context.getClass(),
                context.getHandler()
            ]
        )

        if (!requiredRoles || requiredRoles.length === 0) {
            return true
        }

        const { user }: { user: User } = context.switchToHttp().getRequest()

        if (!user) {
            throw new ForbiddenException("Unauthorized to access this route.")
        }

        const hasRole = requiredRoles.some(role => role === user.role)

        if (!hasRole) {
            throw new ForbiddenException("Permission denied")
        }

        return true
    }
}