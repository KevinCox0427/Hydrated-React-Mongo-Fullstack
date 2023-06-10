const { resolve } = require('path');
const { readdirSync, readFileSync, lstatSync } = require('fs');
const TerserPlugin = require("terser-webpack-plugin");

/**
 * We only want to bundle the pages that need to be server-side rendered.
 */
let entryObject = {};
scanDirectory('./pages');

/**
 * A function to recursively check the "pages" directory for any React pages that need bundling.
 * If the file is ".tsx" and contains the function hydrateRoot(), then we add it to "entryObject" as a key value pair.
 * 
 * @param directory The entry point to start scanning.
 */
function scanDirectory(directory) {
  readdirSync(directory).forEach(page => {
    if(page.endsWith('.tsx') && readFileSync(`${directory}/${page}`).includes('hydrateRoot(')) {
      let pageName = page.split('.tsx')[0];
      
      /**
       * If the page's name is already taken, then we'll add an integer to the end until it's unique.
       */
      let index = 1;
      while(Object.keys(entryObject).includes(pageName)) {
        index++;
        pageName = page.split('.tsx')[0] + index;
      }

      entryObject = {...entryObject, 
        [page.split('.tsx')[0]]: `${directory}/${page}`
      }
    } 
    else if(lstatSync(`${directory}/${page}`).isDirectory()) {
      scanDirectory(`${directory}/${page}`);
    }
  });
}

module.exports = {
  entry: entryObject,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: 'ts-loader',
        include: /pages/,
        exclude: /node_modules/
      },
      {
        test: /\.(js|mjs)?$/,
        resolve: { fullySpecified: false },
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      {
        test: /\.(css)$/,
        use: ['style-loader','css-loader'],
        exclude: /node_modules/
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: resolve('./dist/public/js/'),
  },
  mode: 'development',
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin()],
  // }
};