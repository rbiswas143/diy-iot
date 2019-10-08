import path from 'path';

export default {
    entry: './client/index.js',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: __dirname + '/src',
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                        sourceMap: true,
                        importLoaders: 1,
                        localIdentName: "[name]--[local]--[hash:base64:8]"
                    }
                },
                {
                    loader: "postcss-loader",
                    options: {
                        pugins: {
                            'postcss-cssnext': {}
                        },
                    }
                }
            ]
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/public')
    }
};

