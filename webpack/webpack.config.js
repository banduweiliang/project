const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

//配置插件
const plugins = [
    // 删除构建目录
    new CleanWebpackPlugin(['build/assets/']),
    // 处理css, 从html中剥离出来
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash:6].css'
    }),
    // 处理html，并自动引用output的文件
    new HtmlWebpackPlugin({
        //目标文件
        filename: '../index.html',
        //模版文件
        template: './src/index.html',
        //对文件进行压缩
        minify: {
            //压缩代码
            minimize: true,
            //移除注释
            removeComments: true,
            //去掉空格
            collapseWhitespace: true,
            //压缩行内css
            minifyCSS: true,
            //压缩行内js
            minifyJS: false
        }
    }),
    // 处理vue
    new VueLoaderPlugin()
];

module.exports = {
    //构建模式，development or production
    mode: process.env.NODE_ENV || 'development',
    //输入配置
    entry: {
        index: ['babel-polyfill','./src/js/index.js'],
        vendors: ['jquery']
    },
    //输出配置
    output: {
        filename: '[name].[hash:6].js',
        path: path.resolve(__dirname, 'build/assets/'),
        publicPath: 'assets/'
    },
    //是否生成source map以及如何生成
    devtool: 'eval-source-map',
    // devtool: 'none',
    devServer: {
        //serve加载的目录
        contentBase: './build', 
        port: 9000,
        //打开浏览器
        open: true,
        //启用gzip压缩文件
        compress: true,
        //强制页面访问index.html
        historyApiFallback: true,
        //实时刷新
        inline: true,
        //支持模块热更新
        hot: true
    },
    //模块操作
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,  //正则判断文件类型
                exclude: /node_modules/,    //排除这个文件夹不处理
                use: 'babel-loader'     //使用加载器  
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader']
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader,'css-loader','sass-loader']
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[name].[hash:6].[ext]',
                        limit: 1024
                    }
                }]
            },
            {
                test: /\.(eot|ttf|svg|woff)$/,
                use: ['url-loader']
            }
        ]
    },
    plugins,
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                }
            }
        }
    }
};