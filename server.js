const express = require('express');
const cors = require('cors');
const quoteRoutes = require('./routes/quotes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/quotes', quoteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
