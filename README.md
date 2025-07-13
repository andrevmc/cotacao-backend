# Cotação Backend

Este projeto é o **backend** da aplicação de cotação da B3. Ele utiliza uma consulta a api gratuita https://www.alphavantage.co, que permite um máximo de 25 requests/dia.

## 🚀 Sobre

API desenvolvida com **Node.js** que fornece dados de cotação e é consumida pelo frontend Angular neste repositório:  
➡️ [cotacao-frontend](https://github.com/andrevmc/cotacao-frontend)

## 📦 Tecnologias

- Node.js
- Express
- Axios

## ▶️ Como rodar (no terminal: bash, ...)

1. Clone o repositório:

   git clone https://github.com/andrevmc/cotacao-backend.git

2. Instale as dependências:

   npm install

3. Configure as variáveis de ambiente no .env

4. Inicie a API:

   npm start

   Obs: Certifique-se de que o servidor estará rodando na porta esperada pelo frontend (ex: http://localhost:3000).

