import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Roles } from "@decorators/roles.decorator";
import { AdminService } from "./admin.service";
import { SignUpDto } from "@workspace/contracts/auth";
import { UserQueryDto } from "@workspace/contracts/admin";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles("admin")
  @Post("customers")
  createCustomer(@Body() dto: SignUpDto) {
    return this.adminService.createCustomer(dto);
  }

  @Roles("admin")
  @Get("users")
  findAllUsers(@Query() query: UserQueryDto) {
    return this.adminService.findAllUsers(query);
  }
}
