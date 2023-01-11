import { Inject, Injectable } from "@nestjs/common";
import { Cat } from "src/domain/Cat";
import { CatLoader } from "src/domain/CatLoader";

@Injectable()
export class GetAllCatsUseCase {
  constructor(@Inject("CatLoader") private catLoader: CatLoader) {}

  async execute(): Promise<Cat[]> {
    return this.catLoader.getAllCats();
  }
}
