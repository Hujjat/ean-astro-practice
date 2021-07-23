const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: {
        theme: "./src/js/layout/theme.js",
        password: "./src/js/layout/password.js",
        gift_card: "./src/js/layout/gift_card.js"
    },
	output: {
		path: path.resolve(__dirname, 'assets'),
		filename: '[name].js',
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            'vue$': path.resolve('./node_modules/vue/dist/vue.esm.js')
        }
    },
	module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'style-loader', 
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        query: {
                            importLoaders: 1
                        }
                    }, 
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: loader => [
                                require("postcss-preset-env")({
                                    features: {
                                        customProperties: {
                                            warnings: false
                                        }
                                    }
                                })
                            ]
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000
                    }
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [ 
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new VueLoaderPlugin()
    ],
    watchOptions: {
        ignored: [!'src']
    }
};