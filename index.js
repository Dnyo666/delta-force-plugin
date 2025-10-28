import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import DataManager from './utils/Data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = __dirname;
const appsDir = path.join(pluginRoot, 'apps');

let ret = [];

logger.info(logger.yellow("- 正在载入 DELTA-FORCE-PLUGIN"));

// 初始化 global.segment（如果不存在）
if (!global.segment) {
  try {
    // 尝试从 icqq 导入
    const icqq = await import("icqq");
    global.segment = icqq.segment;
    logger.info("[DELTA-FORCE-PLUGIN] 已从 icqq 加载 segment");
  } catch (err) {
    try {
      // 尝试从 oicq 导入
      const oicq = await import("oicq");
      global.segment = oicq.segment;
      logger.info("[DELTA-FORCE-PLUGIN] 已从 oicq 加载 segment");
    } catch (err2) {
      logger.debug("[DELTA-FORCE-PLUGIN] 无法加载 segment，可能已由其他插件加载");
    }
  }
}

// 初始化 global.core（如果不存在）
if (!global.core) {
  try {
    // 尝试从 icqq 导入
    const icqq = await import("icqq");
    global.core = icqq.core;
    logger.info("[DELTA-FORCE-PLUGIN] 已从 icqq 加载 core，音乐卡片功能已启用");
  } catch (err) {
    try {
      // 尝试从 oicq 导入
      const oicq = await import("oicq");
      global.core = oicq.core;
      logger.info("[DELTA-FORCE-PLUGIN] 已从 oicq 加载 core，音乐卡片功能已启用");
    } catch (err2) {
      logger.warn("[DELTA-FORCE-PLUGIN] 无法加载 core，音乐卡片功能将不可用（将使用语音备用方案）");
    }
  }
}

// 强制等待数据缓存初始化
await DataManager.init();

let files = [];
try {
  files = fs.readdirSync(appsDir).filter((file) => file.endsWith('.js'));
} catch (e) {
  logger.error(`[DELTA-FORCE-PLUGIN]插件加载失败，未找到 apps 目录：${appsDir}`);
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
    logger.error(`[DELTA-FORCE-PLUGIN]载入插件错误：${logger.red(name)}`);
    logger.error(ret[i].reason);
    continue;
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
}

logger.info(logger.green("- DELTA-FORCE-PLUGIN 载入成功"));
logger.info(logger.magenta(`- 欢迎加入三角洲行动插件交流群 932459332`));

export { apps };