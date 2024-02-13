import dotenv from "dotenv";

class _EnvManager {
  private port: number;
  private orderBookTreshold: number;
  constructor() {
    dotenv.config();
    this.port = Number(process.env.APP_PORT || 3000);
    this.orderBookTreshold = Number(process.env.ORDER_BOOK_TRESHOLD || 5);
  }

  getAppPort(): number {
    return this.port;
  }

  getOrderBookTreshold(): number {
    return this.orderBookTreshold;
  }
}

export const EnvManager = new _EnvManager();
