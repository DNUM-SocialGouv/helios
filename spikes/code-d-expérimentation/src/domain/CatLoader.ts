import { Cat } from './Cat'

export interface CatLoader {
  getAllCats(): Promise<Cat[]>
  // getCatByName(name: string): Promise<Cat>;
  // createCat(cat: Cat): Promise<Cat>;
}
