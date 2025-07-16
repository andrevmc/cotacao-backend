const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

// const API_KEY = 'P0LJMHCPQOA48XMS';
const API_KEY = 'FW3N83MKIF85S5MM';
const BASE_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full';

async function fetchTimeSeries(ativo) {
  const url = `${BASE_URL}&symbol=${ativo}.SA&apikey=${API_KEY}`;
  const resp = await axios.get(url);
  console.log(`🔍 Retorno bruto de ${ativo}:`, resp.data);
  const data = resp.data;
  
  if (data.Note) {
    throw new Error(`API limit hit: ${data.Note}`);
  }
  if (data['Error Message']) {
    throw new Error(`Símbolo inválido: ${ativo}`);
  }

  const series = data['Time Series (Daily)'];
  if (!series || typeof series !== 'object') {
    throw new Error(`Dados não encontrados para ${ativo}`);
  }
  return series;
}

async function getQuotes(ativos, dataInicio, dataFim) {
  const result = {};

  for (let ativo of ativos) {
    const key = `${ativo}-${dataInicio}-${dataFim}`;
    if (cache.has(key)) {
      result[ativo] = cache.get(key);
      continue;
    }

    try {
      const series = await fetchTimeSeries(ativo);
      const filtered = Object.entries(series)
        .filter(([date]) => date >= dataInicio && date <= dataFim)
        .map(([date, info]) => ({
          date,
          close: parseFloat(info['4. close'])
        }))
        .reverse();

      cache.set(key, filtered);
      result[ativo] = filtered;
    } catch (err) {
      console.error(`Erro em ${ativo}:`, err.message);
      result[ativo] = { error: err.message };
    }
  }

  return result;
}

module.exports = { getQuotes };
