

export const getTSPlugins = () => {
  if (!isIsomorphic) {
    return [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        inject: 'head',
      }),
    ];
  }

  return [];
};
