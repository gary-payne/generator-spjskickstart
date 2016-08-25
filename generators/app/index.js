'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = yeoman.Base.extend({

  prompting: function () {	  
    this.log(yosay('Welcome to the neat ' + chalk.red('generator-spjskickstart') + ' generator!'));
    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Whats the project name?',
        default: this.appname
      },
      {
        type: 'input',
        name: 'serverRelativeSiteUrl',
        message: 'Server-relative path of the site into which the files will be loaded'
      },
      {
        type: 'input',
        name: 'libraryName',
        message: 'Name of the library into which the files will be loaded'
      }
    ];
    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  createFolders: function () {
    mkdirp("dist");
    mkdirp("dist/css");
    mkdirp("dist/html");
    mkdirp("dist/js");
    mkdirp("dist/libs");
    mkdirp("src");
    mkdirp("src/app");
  },

  //Copy configuration files
  config: function () {
    const safeName = _s.classify(this.props.name);
    const templateProps = {
        name: this.props.name,
        libraryName: this.props.libraryName,
        safeName: safeName,
        serverRelativeLibraryUrl: this.props.serverRelativeSiteUrl + "/" + this.props.libraryName
    };

    this.fs.copy(this.templatePath("babelrc"), this.destinationPath(".babelrc"));
    this.fs.copy(this.templatePath("eslintrc"), this.destinationPath(".eslintrc"));
    this.fs.copyTpl(this.templatePath("_gulpfile.babel.js"), this.destinationPath("gulpfile.babel.js"), templateProps);
    this.fs.copyTpl(this.templatePath("_gulpfile.config.js"), this.destinationPath("gulpfile.config.js"), templateProps);
    this.fs.copyTpl(this.templatePath("_package.json"), this.destinationPath("package.json"), templateProps);
  },

  //Copy application files
  app: function() {
    const safeName = _s.classify(this.props.name);
    const templateProps = {
        safeName: safeName,
        serverRelativeLibraryUrl: this.props.serverRelativeSiteUrl + "/" + this.props.libraryName
    };
  
    this.fs.copyTpl(this.templatePath("src/app/_app.js"), this.destinationPath("src/app/app.js"), templateProps);
    this.fs.copyTpl(this.templatePath("src/app/_spjs.js"), this.destinationPath("src/app/" + safeName + ".js"), templateProps);
    this.fs.copyTpl(this.templatePath("dist/html/_spjs.html"), this.destinationPath("dist/html/" + safeName + ".html"), templateProps);	  
  },

	install: function () {
    this.installDependencies();
  }
});
