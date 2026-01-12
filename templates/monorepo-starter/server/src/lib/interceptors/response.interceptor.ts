import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((res) => {
        if (!res || typeof res !== "object" || res instanceof Response) {
          return res;
        }

        const action = res.action;
        const statusCode = response.statusCode;
        const { data = null, message = "Success", ...meta } = res || {};

        return {
          status: statusCode,
          success: statusCode >= 200 && statusCode < 300,
          message,
          data,
          action,
          ...(Object.keys(meta).length ? { meta } : {}),
        };
      })
    );
  }
}
