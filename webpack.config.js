/**
 * Created by Administrator on 2017/3/13.
 */
var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    html = require('html-withimg-loader'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    autoprefixer = require('autoprefixer'),
    px2rem = require('postcss-px2rem');

var DEVELOPMENT = process.env.NODE_ENV === 'development';
var PRODUCTION = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV)
console.log(typeof(process.env.NODE_ENV))
console.log(process.env.NODE_ENV === 'production')
console.log(PRODUCTION)
var entry = PRODUCTION ?
    ['./src/js/main.js',
        './src/js/flexible.js',
        './src/style/main.less',
    ] : [
        './src/js/main.js',
        './src/js/flexible.js',
        './src/style/main.less',
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8081'
    ];
var plugins = PRODUCTION ? [
    // 压缩 js配置
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: true,
            drop_console: true
        }
    })
] : [
    //热更新 的配置
    new webpack.HotModuleReplacementPlugin(),
];
/*???*/
plugins.push(
    new webpack.DefinePlugin({
        DEVELOPMENT: JSON.stringify(DEVELOPMENT),
        PRODUCTION: JSON.stringify(PRODUCTION)
    }),
    //loaders 的配置
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        options: {
            context: __dirname,
            postcss() {
                return [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    }),
                    px2rem({
                        remUnit: 64
                    })
                ];
            }
        }
    }),
    //html 的配置
    new HtmlWebpackPlugin({
        template: 'html-withimg-loader!' + path.resolve("src/index.html"),
        filename: "index.html",
        inject: "body"
    }),
    // css 的配置
    new ExtractTextPlugin({
        filename: "css/main.css"
            /*disable: false,
            allChunks: true*/
    })
);

module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, 'dist'),
        /*publicPath: '/dist/',*/
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            /*{
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: "pre",
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },*/
            {
                test: /\.(js|vue)$/,
                loader: 'babel-loader',
                options: {
                    "presets": [
                        "es2015"
                    ],
                    "plugins": [
                        "transform-runtime"
                    ]
                },
                exclude: /node_modules/
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.css$/,
                use: [{
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    },
                    "postcss-loader"
                ]


            },
            /*//不单独打包css
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ]
            },*/
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                            "css-loader",
                            "postcss-loader",
                            "less-loader"
                        ]
                        //publicPath: "/dist"
                })
            }, {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: "images/[hash:8].[name].[ext]!image-webpack"
                        }
                    }

                ]
            }
        ]
    },
    resolve: {
        alias: {
            vue: path.join(__dirname, '/node_modules/vue/dist/vue'),
            'vue$': 'vue/dist/vue.js'
        }
    },

    plugins: plugins
};