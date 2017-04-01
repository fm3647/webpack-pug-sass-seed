var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var path = require('path');
var webpack = require('webpack')

module.exports = {
  entry: {
    app: './src/app.js',
    subpage: './src/subpage.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: /src/,
        exclude: /node_modules/
      },
      // {
      //   test: /\.js$/,
      //   exclude: /(node_modules|bower_components)/,
      //   include: /src/,
      //   loader: 'babel-loader',
      //   query: {
      //     presets: ['es2015']
      //   }
      // },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap',
            'postcss-loader',
          ]
        })
      },
      {
        test: /\.(sass|scss)$/i,
        use: ExtractTextPlugin.extract({
          use: [
          'css-loader?sourceMap',
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded', //sass 압축 nested，expanded，compact，compressed.
              sourceMap: true,
              sourceMapContents: true
            }
          }
        ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: false
          }
        }],
      },
      {
        test: /\.pug$/,
        use: [
          'html-loader',
          'pug-html-loader?{"pretty":true,"exports":false}'
        ]
      },
      {
        test: /\.(png|jpe?g|svg|gif|webp)$/,
        exclude: /node_modules/,
        use: [
          'url-loader?limit=20000&name=/images/[name].[ext]',
          'image-webpack-loader?'
        ]
      },
      {
        test:/\.(woff2|woff|otf|eot|ttf)\??.*$/,
        exclude: /node_modules/,
        use: ['url-loader?limit=100000&name=/fonts/[name]-[hash:5].[ext]']
        // => DataUrl if "file.ttf" is smaller than 10kb(10000=10kb)
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('css/[name].css').replace('css/js', 'css');
      },
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      title: '경기도메인페이지 - pug',
      hash: true,
      filename: './index.html',
      excludeChunks: ['subpage'],
      template: './src/index.pug' // Load a custom template (ejs by default see the FAQ for details)
    }),
    // 添加多页项目
    new HtmlWebpackPlugin({
      title: 'contact',
      hash: true,
      filename: 'subpage.html',
      template: './src/subpage.html'
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['dist'] }
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
