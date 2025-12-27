import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import DataManager from './utils/Data.js';
import { getWebSocketService } from './utils/WebSocketService.js';
import Config from './components/Config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = __dirname;
const appsDir = path.join(pluginRoot, 'apps');

let ret = [];

logger.info(logger.yellow("- 正在载入 DELTA-FORCE-PLUGIN"));

// 强制等待数据缓存初始化
DataManager.init();

// 递归读取所有 .js 文件
function getAllJsFiles(dir, baseDir = dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllJsFiles(filePath, baseDir, fileList);
    } else if (file.endsWith('.js')) {
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
      fileList.push(relativePath);
    }
  });
  return fileList;
}

let files = [];
try {
  files = getAllJsFiles(appsDir);
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
  // 从路径中提取文件名（不含目录和扩展名）
  let name = path.basename(files[i], '.js');
  if (ret[i].status !== 'fulfilled') {
    logger.error(`[DELTA-FORCE-PLUGIN]载入插件错误：${logger.red(name)}`);
    logger.error(ret[i].reason);
    continue;
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]];
}

logger.info(logger.green("- DELTA-FORCE-PLUGIN 载入成功"));
logger.info(logger.magenta(`- 欢迎加入三角洲行动插件交流群 932459332`));

// 初始化 WebSocket 服务
const wsConfig = Config.getConfig()?.delta_force?.websocket || {};
if (wsConfig.auto_connect) {
  logger.info('[DELTA-FORCE-PLUGIN] WebSocket 自动连接已启用');
  const wsService = getWebSocketService();
  await wsService.init({
    autoConnect: true
  });
} else {
  logger.info('[DELTA-FORCE-PLUGIN] WebSocket 自动连接未启用');
  // 即使不自动连接，也要初始化服务以便后续手动连接
  const wsService = getWebSocketService();
  await wsService.init({
    autoConnect: false
  });
}

export { apps };