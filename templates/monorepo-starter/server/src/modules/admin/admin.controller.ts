import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CUUserDto, UserQueryDto } from "@workspace/contracts/admin";

import { AdminService } from "./admin.service";
import { Roles } from "@/decorators/roles.decorator";
import { BooleanQuery } from "@/decorators/boolean-query.decorator";

@Controller("admin/users")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles("admin")
  @Post()
  createUser(@Body() dto: CUUserDto) {
    return this.adminService.createUser(dto);
  }

  @Roles("admin")
  @Get()
  findAllUsers(@Query() query: UserQueryDto) {
    return this.adminService.findAllUsers(query);
  }

  @Roles("admin")
  @Get(":userId")
  async findUser(@Param("userId") userId: string) {
    return this.adminService.findUser(userId);
  }

  @Roles("admin")
  @Put(":userId")
  async updateUser(@Body() dto: CUUserDto, @Param("userId") userId: string) {
    return this.adminService.updateUser(dto, userId);
  }

  @Roles("admin")
  @Delete(":userId")
  async deleteUser(
    @Param("userId") userId: string,
    @BooleanQuery("force") force: boolean,
  ) {
    return this.adminService.deleteUser(userId, force);
  }

  @Roles("admin")
  @Post(":userId/restore")
  async restoreUser(@Param("userId") userId: string) {
    return this.adminService.restoreUser(userId);
  }
}
