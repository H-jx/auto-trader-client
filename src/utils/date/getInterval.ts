import dayjs from 'dayjs';

const H = 60 * 60 * 1000;
const TIME_MAP: Record<string, number> = {
  h: H,
  d: 24 * H,
};
/**
 * 获取一段时间
 * @param {string} time 描述性的时间
 * @example
 * getInterval('7d', 'YYYY/MM/DD') => ['2019/11/10', '2019/11/17']
 */
export default function getInterval(
  timeDesription: string,
  format = 'YYYY/MM/DD H:mm:ss',
) {
  const match = timeDesription.match(/\d+/);
  const time: number = match ? Number(match[0]) : 7;
  let factor = H;
  const symbol = timeDesription.replace(String(time), '');
  if (TIME_MAP[symbol]) {
    factor = TIME_MAP[symbol];
  }
  return [
    dayjs(Date.now() - time * factor).format(format),
    dayjs().format(format),
  ];
}
