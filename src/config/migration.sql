-- =============================================
-- Script para criar as tabelas no PostgreSQL
-- Execute este script antes de iniciar a API
-- =============================================

-- Cria o banco de dados (execute separadamente se necessário)
-- CREATE DATABASE pedidos_db;

-- Tabela principal de pedidos
CREATE TABLE IF NOT EXISTS "Order" (
  "orderId"      VARCHAR(100) PRIMARY KEY,   -- número único do pedido
  "value"        NUMERIC(10, 2) NOT NULL,    -- valor total do pedido
  "creationDate" TIMESTAMP NOT NULL          -- data de criação
);

-- Tabela de itens do pedido (relacionada com Order)
CREATE TABLE IF NOT EXISTS "Items" (
  id          SERIAL PRIMARY KEY,             -- id interno
  "orderId"   VARCHAR(100) NOT NULL REFERENCES "Order"("orderId") ON DELETE CASCADE,
  "productId" INTEGER NOT NULL,              -- id do produto
  quantity    INTEGER NOT NULL,              -- quantidade
  price       NUMERIC(10, 2) NOT NULL        -- preço unitário
);

-- Índice para buscar itens por pedido mais rápido
CREATE INDEX IF NOT EXISTS idx_items_orderid ON "Items"("orderId");
