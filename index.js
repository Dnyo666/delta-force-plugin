import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Init from './model/init.js';

if (!global.segment) {
  global.segment = (await import("oicq")).segment;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = __dirname;
const appsDir = path.join(pluginRoot, 'apps');

let ret = [];

logger.info(logger.yellow("- 正在载入 DELTA-FORCE-PLUGIN"));

let files = [];
try {
  files = fs.readdirSync(appsDir).filter((file) => file.endsWith('.js'));
} catch (e) {
  logger.error(`插件加载失败，未找到 apps 目录：${appsDir}`);
  throw e;
}

files.forEach((file) => {
  ret.push(import(`./apps/${file}`));
});

ret = await Promise.allSettled(ret);

let apps = {};

for (let i in files) {
  let name = files[i].replace('.js', '');
  if (ret[i].status !== 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`);
    logger.error(ret[i].reason);
    continue;
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
}

logger.info(logger.green("- DELTA-FORCE-PLUGIN 载入成功"));
logger.info(logger.magenta(`- 欢迎加入三角洲行动插件交流群`));

export { apps };