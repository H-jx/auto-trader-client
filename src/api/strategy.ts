
import { KLineDTO, MarkData } from '@/interface/common';
import { transformCSVToJSON } from '@/utils/json';
import request, { checkResult } from '@/utils/request';


export function analyserResultQuery(symbol: string, start: number, end: number, period?: string) {
  return checkResult(request<{marks: string; history: string}>({
    url: '/strategy/analyser',
    params: {
      symbol,
      start,
      end,
      period
    },
  })).then((data) => {
    return {
      marks: transformCSVToJSON<MarkData>(data.marks),
      history: transformCSVToJSON<KLineDTO>(data.history),
    }
  });
}

export function touristAnalyserResultQuery(symbol: string, start: number, end: number, mode: string, period?: string) {
  return checkResult(request<{marks: string; history: string}>({
    url: '/strategy/analyser/tourist',
    params: {
      symbol,
      start,
      end,
      mode,
      period,
    },
  })).then((data) => {
    return {
      marks: transformCSVToJSON<MarkData>(data.marks),
      history: transformCSVToJSON<KLineDTO>(data.history),
    }
  });
}

export function getStrategyFunction() {
  return checkResult(request<string>({
    url: '/strategy/function',
  }));
}

export function updateStrategyFunction(code: string) {
  return checkResult(request({
    url: '/strategy/function',
    method: 'POST',
    data: {
      functionStr: code,
    },
  }));
}