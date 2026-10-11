
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GlobalThrottlerGuard extends ThrottlerGuard {
    protected getTracker(req: Record<string, any>): Promise<string> {
        return Promise.resolve(req.ip);
    }

    protected generateKey(
        context: Parameters<ThrottlerGuard['generateKey']>[0],
        tracker: string,
        throttlerName: string,
    ): string {
        return `${throttlerName}:${tracker}`;
    }
}
