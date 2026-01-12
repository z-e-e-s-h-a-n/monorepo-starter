import { LoggerService } from "@modules/logger/logger.service";
import type { Request, Response } from "express";
import {
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
  type ArgumentsHost,
} from "@nestjs/common";
import { InjectLogger } from "@decorators/logger.decorator";
import { Prisma } from "@generated/prisma";
import { ZodError } from "zod";
import { ZodValidationException } from "nestjs-zod";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  @InjectLogger()
  private readonly logger!: LoggerService;

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let data: any = null;
    let action: string | undefined;

    // ---------- Prisma errors ----------
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case "P2002":
          status = HttpStatus.CONFLICT;
          message = "Duplicate resource detected";
          break;
        case "P2003":
          status = HttpStatus.BAD_REQUEST;
          message = "Invalid reference or relation not found";
          break;
        case "P2025":
          status = HttpStatus.NOT_FOUND;
          message = "Resource not found";
          break;
        case "P2016":
          status = HttpStatus.BAD_REQUEST;
          message = "Invalid query";
          break;
        default:
          message = "Database error";
      }
    }

    // ---------- Zod validation errors ----------
    else if (
      exception instanceof ZodValidationException ||
      exception instanceof ZodError
    ) {
      status = HttpStatus.BAD_REQUEST;

      const zodError = (
        exception instanceof ZodValidationException
          ? exception.getZodError()
          : exception
      ) as ZodError;

      data = zodError.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      message = "Validation failed";
    }

    // ---------- NestJS HttpException ----------
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === "object" && response !== null) {
        const resObj = response as any;

        if (Array.isArray(resObj.message)) {
          message = resObj.message.join(", ");
        } else if (typeof resObj.message === "string") {
          message = resObj.message;
        } else {
          message = "Request failed";
        }

        action = resObj.action;
        data = resObj.data ?? null;
      } else {
        message = exception.message;
      }
    }

    // ---------- Other runtime errors ----------
    else if (exception instanceof Error) {
      message = exception.message || message;
    }

    // ---------- Logging ----------
    this.logger.error("❌ Exception caught", {
      message: exception.message,
      stack: exception.stack,
      status,
      path: req.url,
      method: req.method,
    });

    // ---------- Response ----------
    res.status(status).json({
      status,
      success: false,
      message,
      data,
      action,
    });
  }
}
