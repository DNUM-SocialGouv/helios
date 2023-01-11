import { Injectable } from "@nestjs/common";
import { Cat } from "src/domain/Cat";
import { CatLoader } from "src/domain/CatLoader";

@Injectable()
export class InMemoryCatLoader implements CatLoader {
  protected catsInMemory: Cat[] = [
    {
      color: "grey",
      name: "coco",
      age: 3,
      breed: "persian",
    },
  ];

  getAllCats(): Promise<Cat[]> {
    return Promise.resolve(this.catsInMemory);
  }
}
