const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

//https://api.twelvedata.com/time_series?symbol=PETR4&interval=1day&apikey=7b5cfee9e8f84782ab62ccdc07ca75d2
//https://api.twelvedata.com/time_series?symbol=VALE3&interval=1day&apikey=7b5cfee9e8f84782ab62ccdc07ca75d2
//https://api.twelvedata.com/time_series?symbol=ITUB4&interval=1day&apikey=7b5cfee9e8f84782ab62ccdc07ca75d2
//https://api.twelvedata.com/time_series?symbol=BBDC4&interval=1day&apikey=7b5cfee9e8f84782ab62ccdc07ca75d2
//https://api.twelvedata.com/time_series?symbol=BBAS3&interval=1day&apikey=7b5cfee9e8f84782ab62ccdc07ca75d2

const API_KEY = '7b5cfee9e8f84782ab62ccdc07ca75d2';
const BASE_URL = 'https://api.twelvedata.com/time_series';

async function fetchTimeSeries(ativo, dataInicio, dataFim) {
  const url = `${BASE_URL}?symbol=${ativo}&interval=1day&start_date=${dataInicio}&end_date=${dataFim}&apikey=${API_KEY}`;

  const resp = await axios.get(url);
  console.log(`🔍 Retorno bruto de ${ativo}:`, resp.data);

  const data = resp.data;

  if (data.status === 'error') {
    throw new Error(data.message || `Erro com o ativo ${ativo}`);
  }

  const series = data.values;
  if (!series || !Array.isArray(series)) {
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
      const series = await fetchTimeSeries(ativo, dataInicio, dataFim);

      const filtered = series
        .map(item => ({
          date: item.datetime,
          close: parseFloat(item.close)
        }))
        .reverse(); // opcional, depende da ordem

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
