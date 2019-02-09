#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const command = require('commander');
const settings = require('./package.json');
const { sb2md } = require('./lib/sb2md');

let stdin = '';

command
  .version(settings.version)
  .description(settings.description)
  .usage('\n\tsb2mb [file] \n\tcat hoge.md | sb2mb')
  .arguments('[file]')
  .action(async (file) => {
    if (file) {
      const result = sb2md(fs.readFileSync(path.resolve(file), 'utf8'));
      console.log(result);
    } else {
      command.help();
    }
  });

if (process.stdin.isTTY) {
  command.parse(process.argv)
} else {
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      stdin += chunk;
    }
  })
  process.stdin.on('end', async () => {
    console.log(sb2md(stdin));
  })
}
