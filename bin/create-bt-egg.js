#!/usr/bin/env node

const https = require('https');
const NODEURL = require('url');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const isTextOrBinary = require('istextorbinary');
const glob = require('globby');
const yargs = require('yargs');
const questions = require('./questions');

require('colors');

const BT_EGG_PATH = 'https://registry-node.aliyun.com/org/1987849122053494/registry/btclass/@bt%2fbt-egg/latest';
const BT_EGG_PATH_OPTIONS = NODEURL.parse(BT_EGG_PATH);
const TEST_KEY_REGEXP = /#### test 环境公、私钥[\s\S]*?private_key.pem[\s\S]*?```([\s\S]*?)```/;


class Command {

  constructor(options) {
    options = options || {};
    this.name = options.name || 'create-bt-egg';
    this.pkgInfo = options.pkgInfo || require('../package.json');
    this.cwd = options.cwd || process.cwd();
    this.inquirer = inquirer;
    this.fileMapping = {
      '_.gitignore': '.gitignore',
      '_package.json': 'package.json',
      '_.eslintignore': '.eslintignore',
      '_.eslintrc': '.eslintrc',
      '_.autod.conf.js': '.autod.conf.js',
      '_.gitlab-ci.yml': '.gitlab-ci.yml',
      '_.npmrc': '.npmrc',
      '_.dockerignore': '.dockerignore',
      '_.travis.yml': '.travis.yml'
    };
  }

  async run() {
    const argv = this.argv = this.getParser().parse(process.argv.slice(2) || []);
    this.targetDir = await this.getTargetDirectory();

    await this.processFiles(this.targetDir);
    this.printUsage();

  }

  async getTargetDirectory() {
    const dir = '.';
    let targetDir = path.resolve(this.cwd, dir);
    const force = false;
    const validate = dir => {
      // create dir if not exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return true;
      }

      // not a directory
      if (!fs.statSync(dir).isDirectory()) {
        return `${dir} already exists as a file`.red;
      }

      // check if directory empty
      const files = fs.readdirSync(dir).filter(name => name[0] !== '.');
      if (files.length > 0) {
        if (force) {
          this.log(`${dir} already exists and will be override due to --force`.red);
          return true;
        }
        return `${dir} already exists and not empty: ${JSON.stringify(files)}`.red;
      }
      return true;
    };

    // if argv dir is invalid, then ask user
    const isValid = validate(targetDir);
    if (isValid !== true) {
      this.log(isValid);
      // true
      const answer = await this.inquirer.prompt({
        name: 'dir',
        message: 'Please enter target dir: ',
        default: dir || '.',
        filter: dir => path.resolve(this.cwd, dir),
        validate,
      });
      targetDir = answer.dir;
    }
    this.log(`target dir is ${targetDir}`);
    return targetDir;
  }

  async processFiles(targetDir) {

    const src = path.join(__dirname, '..', 'boilerplate');
    const locals = await this.askForVariable();
    if(!locals.name) {
      locals.name = path.basename(this.targetDir);
    }
    const btEggPackageInfo = await this.wget(BT_EGG_PATH_OPTIONS);
    locals.btEggVersion = btEggPackageInfo.version || '2.3.4';
    // console.log('locals', locals);

    const files = glob.sync('**/*', { cwd: src, dot: true });

    files.forEach(file => {
      const from = path.join(src, file);
      const to = path.join(targetDir, this.replaceTemplate(this.fileMapping[file] || file, locals));
      const content = fs.readFileSync(from);
      this.log('write to %s', to);

      // check if content is a text file
      const result = isTextOrBinary.isTextSync(from, content)
        ? this.replaceTemplate(content.toString('utf8'), locals)
        : content;

      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.writeFileSync(to, result);
    });
  }

  async askForVariable() {
    const keys = Object.keys(questions);
    //以后多种模板类型扩展
    if (this.argv.type && this.argv.type==='simple') {
      const result = {};
      keys.forEach(key => {
        result[key] = this.argv[key]||questions[key];
      });
      return result;
    } else {
      return await inquirer.prompt(keys.map(key => {
        const question = questions[key];
        return {
          type: question.type || 'input',
          name: key,
          message: question.description || question.desc,
          default: question.default,
          filter: question.filter,
          choices: question.choices,
        };
      }));
      
    }
  }

  async wget(url) {
    let options = url;
    if (typeof url === 'string') {
      options = NODEURL.parse(url);
    }
    const info = await new Promise((resolve, reject) => {
      const req = https.get(options, function (res) {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        })
      });
      req.on('error', (e) => {
        reject(e);
      });
      req.end();
    });
    return info;
  }

  replaceTemplate(content, scope) {
    return content.toString().replace(/(\\)?{{ *(\w+) *}}/g, (block, skip, key) => {
      if (skip) {
        return block.substring(skip.length);
      }
      return scope.hasOwnProperty(key) ? scope[key] : block;
    });
  }

  printUsage() {
    this.log(`usage:
      - cd ${this.targetDir}
      - npm install
      - npm start / npm run dev / npm test

      Happy carrying brick!
    `);
  }

  /**
   * 获取传入参数
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('init bt-egg project from boilerplate.\nUsage: $0 [dir] --type=simple')
      .options(questions)
      .alias('h', 'help')
      .alias('n', 'name')
      .alias('d', 'description')
      .alias('a', 'author')
      .alias('k', 'keys')
      .alias('t', 'type')
      .version()
      .help();
  }

  log() {
    const args = Array.prototype.slice.call(arguments);
    args[0] = `[${this.name}] `.blue + args[0];
    console.log.apply(console, args);
  }

}

(async function () {
  const c = new Command();
  await c.run();
})();