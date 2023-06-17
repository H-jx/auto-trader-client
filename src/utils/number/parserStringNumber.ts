/**
 * 解析字符数字,拆解数字正负、绝对值、单位。 0判定为正数
 * @param value
 * @example
 * parserStringNumber('-10.1%') => {isPositive: false, number: -10.1, abs: 10.1, unit: '%'}
 */
const parserStringNumber = function (value: number | string) {
    if (value === null || value === undefined) {
        return {
            isNumber: false,
        };
    }
    value = value.toString();
    // 匹配数字
    const matchNumber = value.match(/^-?\d+(\.\d+)?/);
    const isNumber = matchNumber !== null;

    if (!isNumber || matchNumber == null) {
        return {
            isNumber,
        };
    }
    // 数字
    const num = matchNumber ? Number(matchNumber[0]) : 0;
    // 去掉数字就是单位
    const unit = value.replace(matchNumber[0], '');
    const isPositive = num >= 0;
    const abs = Math.abs(num);
    return {
        isPositive,
        isNumber,
        number: num,
        abs,
        unit,
    };
};
export default parserStringNumber;
