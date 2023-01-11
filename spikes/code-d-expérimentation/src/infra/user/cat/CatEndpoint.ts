import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { GetAllCatsUseCase } from "src/use-case/GetAllCatsUseCase";
import { LoggingInterceptor } from "../../server/common/interceptors/LoggingInterceptor";

@Controller("cats")
@UseInterceptors(LoggingInterceptor)
export class CatEndpoint {
  constructor(private getAllCatsUseCase: GetAllCatsUseCase) {}

  @Get()
  async getAllCats() {
    return this.getAllCatsUseCase.execute();
  }
}
