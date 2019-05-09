import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as path from 'path'
import * as merge from 'webpack-merge'
import baseCofing from './webpack.config.base'

const publicPath = path.join(__dirname, '/public')

export default merge({
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: './test/index.ts',
  },
  output: {
    path: publicPath,
    filename: '[name].js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    historyApiFallback: true,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['app'],
      filename: 'index.html',
      template: './test/views/index.html',
      hash: true,
    }),
  ],
}, baseCofing)
