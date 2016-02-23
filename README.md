The _brjsify_ command allows you to convert a set of NPM libraries and their dependencies into a set of BRJS libraries. You use it by creating a `package.json` file within your BRJS app where `dependencies` contains the NPM dependencies your app directly depends on, and where `devDependencies` contains _brjsify_ itself.

For example, if your BRJS app depends on [react](https://www.npmjs.com/package/react) and [redux](https://www.npmjs.com/package/redux), you might end up with a `package.json` configuration file like this:

~~~json
"dependencies": {
  "react": "^0.14.3",
  "redux": "^3.0.4"
},
"devDependencies": {
  "brjsify": "^0.0.1"
},
"scripts": {
  "brjsify": "brjsify sdk/libs/javascript"
}
~~~

Given a set-up like this, provided you've first installed with `npm install`, you can export the NPM libraries directly into your `sdk/libs/javascript` directory as follows:

~~~bash
npm run brjsify
~~~
