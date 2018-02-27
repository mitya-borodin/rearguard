import * as webpack from "webpack";
import {isDevelopment} from "../target.config";

export const file = (): webpack.Rule => ({
  loader: "file-loader",
  query: {
    name: isDevelopment ? "[path][name].[ext]?[hash:8]" : "[hash:32].[ext]",
  },
  test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
});
