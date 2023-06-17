
export function transformCSVToJSON<T extends Record<string, any>>(csv: string): T[] {
  const lines = csv.trim().split('\n');
  const keys = lines.shift()?.split(',') || [];

  return lines.map((line) => {
    const values = line.split(',');
    const obj: any = {} as T;
    keys.forEach((key, i) => {
      const value = values[i];
      obj[key] = /^-?\d*\.?\d+$/.test(value) ? parseFloat(value) : value;
    });
    return obj;
  });
}

export function transformToCSV(list: Record<string, any>[]) {
  const header = Object.keys(list[0]).join(',') + '\n';
  const rows = list.map((item) => {
    const values = Object.values(item).map((value) => {
      if (typeof value === 'number') {
        return value;
      } else if (typeof value === 'string') {
        return value;
      } else if (value instanceof Date ) {
        return value.toISOString();
      } else {
        return '';
      }
    });
    return values.join(',') + '\n';
  }).join('');

  return header + rows;
}

export function downloadCSV<T extends object>(dataList: T[], filename: string) {
  const csvData = transformToCSV(dataList);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
