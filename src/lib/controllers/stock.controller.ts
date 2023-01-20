import { Request, Response, NextFunction } from "express";
import { getJsonStream } from "../helpers/filesystem.helper.js";
import logger from "../config/logger.js";
import { builtError } from "../helpers/utility.helper.js";

interface StockData {
  sku: string;
  qty: number;
}

const getStock = (sku: string): Promise<StockData> => {
  return new Promise((resolve, reject) => {
    const stockFilePath: string = process.cwd() + "/src/lib/data/stock.json";
    const stockStream = getJsonStream(stockFilePath);

    const stocks: any = [];
    stockStream.on("data", (stockData) => {
      stocks.push(stockData);
    });

    let skuTransactions: StockData = {
      sku,
      qty: 0,
    };
    stockStream.on("close", () => {
      const filterStock = stocks.filter((stock: any) => stock.sku === sku);
      if (filterStock.length === 0) {
        skuTransactions.qty = 0;
      } else {
        skuTransactions.qty = filterStock.reduce(
          (acc: any, curr: any) => (acc += curr.stock),
          0
        );
      }

      const transactionFilePath: string =
        process.cwd() + "/src/lib/data/transactions.json";
      const transactionStream = getJsonStream(transactionFilePath);

      const transactions: any = [];
      transactionStream.on("data", (transactionStream) => {
        transactions.push(transactionStream);
      });

      transactionStream.on("close", () => {
        const filterTransaction = transactions.filter(
          (transaction: any) => transaction.sku === sku
        );
        const skuStockTransaction = filterTransaction.reduce(
          (acc: any, curr: any) => {
            if (!acc.qty) {
              acc["sku"] = curr["sku"];
              acc["qty"] = curr["qty"];
            } else {
              if (curr.type === "order") {
                acc.qty -= curr.qty;
              } else {
                acc.qty += curr.qty;
              }
            }
            return acc;
          },
          {}
        );
        if (filterStock.length === 0 && filterTransaction.length === 0) {
          logger.info("getStock:: skuTransactions not found");
          return reject("Transactions not found for the given sku");
        }
        skuTransactions.qty = skuTransactions.qty + skuStockTransaction.qty;
        return resolve(skuTransactions);
      });
    });
  });
};

export const getStocksUsingSKUs = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { sku } = req.query as { sku: string };

    if (sku === "" || !sku) {
      return res.status(400).send("Error in input field");
    }
    const data: StockData = await getStock(sku);
    return res.status(200).json(data);
  } catch (error: any) {
    logger.error(
      `getStocksUsingSKUs:: failed to get the stocks using SKUs error => ${error}`
    );
    return builtError(res, 500, error);
  }
};
