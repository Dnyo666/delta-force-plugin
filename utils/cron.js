/**
 * 规范化 cron 表达式，使其成为六位的 cron 表达式
 * @param {string} cronExpression - 要规范化的 cron 表达式
 * @returns {string} - 规范化后的六位 cron 表达式
 * @throws {Error} - 如果 cron 表达式无效
 */
export function normalizeCronExpression (cronExpression) {
  const cronParts = cronExpression.split(' ')

  if (cronParts.length === 5) {
    cronParts.unshift('*')
  } else if (cronParts.length === 7) {
    cronParts.shift()
  } else if (cronParts.length !== 6) {
    throw new Error('无效的 cron 表达式，必须是五位、六位或七位')
  }

  return cronParts.join(' ')
}