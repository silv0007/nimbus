import express from 'express';
import ProdutoModel from '../models/Produto.js';
import conexao from '../conexao.js';
import { DataTypes } from 'sequelize';

const router = express.Router();
const Produto = ProdutoModel(conexao, DataTypes);

// Criar um novo produto
router.post('/', async (req, res) => {
    try {
        const { nome, descricao, preco, estoque, categoria, imagem } = req.body; // Imagem agora é fornecida como URL diretamente.

        if (!nome || !descricao || preco === undefined || estoque === undefined || !categoria || !imagem) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        const newProduct = { nome, descricao, preco, estoque, categoria, imagem };
        const product = await Produto.create(newProduct);
        res.status(201).json(product);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
    }
});

// Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const products = await Produto.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
    }
});

// Atualizar um produto
router.put('/:id_produto', async (req, res) => {
    const { id_produto } = req.params;
    const { nome, descricao, preco, estoque, categoria, imagem } = req.body;

    try {
        const [updated] = await Produto.update(
            { nome, descricao, preco, estoque, categoria, imagem },
            { where: { id_produto } }
        );

        if (updated) {
            const updatedProduct = await Produto.findByPk(id_produto);
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
    }
});

// Deletar um produto
router.delete('/:id_produto', async (req, res) => {
    const { id_produto } = req.params;

    try {
        const deleted = await Produto.destroy({ where: { id_produto } });
        if (deleted) {
            res.status(200).json({ message: 'Produto deletado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
    }
});

export default router;
