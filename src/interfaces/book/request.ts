export interface UpdateIsOutOfStockRequest {
  quantity: number;
  isOutOfStock?: boolean;
}

export interface UpdateBookQuantityRequest {
  operation: UPDATE_QUANTITY_OPERATION;
  quantity: number;
}

export interface UpsertBookRequest {
  authorId: number;
  description: string;
  title: string;
  price: number;
  isOutOfStock?: boolean;
  quantity: number;
  author?: {
    name: string;
  };
}

export enum UPDATE_QUANTITY_OPERATION {
  INCREMENT = "increment",
  DECREMENT = "decrement",
}
