import { createReadStream } from "fs";
import JSONStream from "JSONStream";
import logger from "../config/logger.js";

export const getJsonStream = (filePath: string) => {
  try {
    const stream = createReadStream(filePath, { encoding: "utf8" });
    const parser = JSONStream.parse("*");
    return stream.pipe(parser);
  } catch (error) {
    logger.error(
      `getJsonStream:: Failed to create the json stream`,
      JSON.stringify(error)
    );
    throw error;
  }
};
