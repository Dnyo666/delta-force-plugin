/**
 * 规范化 cron 表达式，使其与 node-schedule 兼容（六位格式）
 * @param {string} cronExpression - 要规范化的 cron 表达式
 * @returns {string} - 规范化后的六位 cron 表达式
 * @throws {Error} - 如果 cron 表达式无效
 */
export function normalizeCronExpression(cronExpression) {
  if (!cronExpression || typeof cronExpression !== 'string') {
    throw new Error('无效的 cron 表达式：输入必须是字符串');
  }

  // 替换 Quartz-style '?' with '*'
  const cron = cronExpression.replace(/\?/g, '*');
  const cronParts = cron.split(' ').filter(p => p.length > 0);

  if (cronParts.length === 5) {
    // 5位标准cron (min hour day month day-of-week), 在前面加'0'作为秒
    cronParts.unshift('0');
  } else if (cronParts.length === 7) {
    // 7位Quartz cron (sec min hour day month day-of-week year), 去掉末尾的年份
    cronParts.pop();
  }

  if (cronParts.length !== 6) {
    throw new Error(`无效的 cron 表达式 "${cronExpression}"，无法转换为六位格式`);
  }

  return cronParts.join(' ');
}