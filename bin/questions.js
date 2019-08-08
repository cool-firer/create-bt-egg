'use strict';

module.exports = {
  name: {
    desc: 'project name',
    default: 'bt',
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