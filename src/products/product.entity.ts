interface Specifications {
  name: string;
  description: string;
}

interface Image {
  url: string;
  description: string;
}
export class ProductEntity {
  id: string;
  name: string;
  value: number;
  availableQuantity: number;
  description: string;
  specifications: Specifications[];
  images: Image[];
  category: string;
  createdAt: string;
  updatedAt: string;
}
