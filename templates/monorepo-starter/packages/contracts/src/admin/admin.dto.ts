import { createZodDto } from "nestjs-zod";
import { userQuerySchema } from "./admin.schema";

export class UserQueryDto extends createZodDto(userQuerySchema) {}
