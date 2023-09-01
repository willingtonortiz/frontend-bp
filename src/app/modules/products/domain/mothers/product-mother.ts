import { ProductItem } from '../models/product';

export class ProductMother {
  static random(): ProductItem {
    const id = crypto.randomUUID();
    return {
      id,
      name: `Product ${id}`,
      description: `Description ${id}`,
      dateRevision: new Date().toISOString(),
      dateRelease: new Date().toISOString(),
      logo: crypto.randomUUID(),
    };
  }

  static randomList(length: number): ProductItem[] {
    return Array.from({ length }, () => this.random());
  }
}
