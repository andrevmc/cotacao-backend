const express = require('express');
const router = express.Router();
const { getQuotes } = require('../services/quoteService');

router.post('/', async (req, res) => {
  const { ativos, dataInicio, dataFim } = req.body;
  try {
    const result = await getQuotes(ativos, dataInicio, dataFim);
    res.json(result);
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ error: 'Erro interno ao processar cotações.' });
  }
});

module.exports = router;
