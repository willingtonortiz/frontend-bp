import { ProductItem } from '../models/product';

export class ProductMother {
  static random(): ProductItem {
    const id = crypto.randomUUID().substring(0, 5);
    const now = new Date();
    const nextYear = new Date(
      now.getFullYear() + 1,
      now.getMonth(),
      now.getDate(),
    );
    return {
      id,
      name: `Product ${id}`,
      description: `Description ${id}`,
      dateRevision: now.toISOString(),
      dateRelease: nextYear.toISOString(),
      logo: crypto.randomUUID(),
    };
  }

  static randomList(length: number): ProductItem[] {
    return Array.from({ length }, () => this.random());
  }
}
