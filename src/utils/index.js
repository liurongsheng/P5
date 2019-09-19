export function timesFormat(timestamp) {
  function zeroize(num) {
    return (String(num).length === 1 ? '0' : '') + num
  }

  const curTimestamp = parseInt(new Date().getTime() / 1000) // 当前时间戳
  const timestampDiff = curTimestamp - timestamp // 参数时间戳与当前时间戳相差秒数

  const curDate = new Date(curTimestamp * 1000) // 当前时间日期对象
  const tmDate = new Date(timestamp * 1000) // 参数时间戳转换成的日期对象

  const Y = tmDate.getFullYear()
  const m = tmDate.getMonth() + 1
  const d = tmDate.getDate()
  const H = tmDate.getHours()
  const i = tmDate.getMinutes()
  const s = tmDate.getSeconds()
  if (timestampDiff < 60) { // 一分钟以内
    return '刚刚'
  } else if (timestampDiff < 3600) { // 一小时前之内
    return Math.floor(timestampDiff / 60) + '分钟前'
  } else if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
    return Math.floor(timestampDiff / 60 / 60) + '小时前'
  } else {
    return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i) + ':' + zeroize(s)
  }
}
