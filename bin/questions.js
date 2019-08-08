'use strict';

module.exports = {
  // type: {
  //   type: 'string',
  //   description: 'boilerplate type',
  // },
  name: {
    desc: 'project name',
    default: 'bt',
  },
  node: {
    type: 'rawlist',
    desc: '请选择一种node版本:',
    choices:['8.16.0','10.16.1'],
    default: '8.16.0',
  },
  description: {
    desc: 'project description',
    default: 'bt-egg app boilerplate',
  },
  author: {
    desc: 'project author',
    default: 'btclass',
  },
  keys: {
    desc: 'cookie security keys',
    default: Date.now() + '_' + random(100, 10000),
  }
};

function random(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}