function Produto(id, descricao, preco) {
    this.id = id;
    this.descricao = descricao;
    this.preco = preco;

    this.getDescricao = function () {
        return this.descricao;
    };

    this.getPreco = function () {
        return this.preco;
    };

    this.getId = function () {
        return this.id;
    };
}

/* Item no carrinho */
function Item(produto, quantidade) {
    this.produto = produto;
    this.quantidade = quantidade;
    this.calcularTotalItem = function () {
        return this.produto.getPreco() * this.quantidade;
    };
}

function Carrinho() {
    this.itens = [];
    this.adicionar = function (item) {
        // Verifica se o item já existe no carrinho
        let encontrado = false;
        for (let i = 0; i < this.itens.length; i++) {
            if (this.itens[i].produto.getId() === item.produto.getId()) {
                this.itens[i].quantidade += item.quantidade;
                encontrado = true;
                break;
            }
        }
        // Se não encontrado, adiciona como novo item
        if (!encontrado) {
            this.itens.push(item);
        }
        atualizarResumo(this);
    };
    this.getValorTotal = function () {
        let total = 0.0;
        for (let i = 0; i < this.itens.length; i++) {
            total += this.itens[i].calcularTotalItem();
        }
        return total;
    };
}

function criarProdutos() {
    let produtos = [];
    produtos.push(new Produto(1, "Bola", 50.12));
    produtos.push(new Produto(2, "Chuteira", 200.0));
    produtos.push(new Produto(3, "Meia", 16.60));
    produtos.push(new Produto(4, "Caneleira", 50.00));
    return produtos;
}

let produtos = criarProdutos();
let carrinho = new Carrinho();

function adicionarAoCesto(idProduto, qtd) {
    let regexpId = /produto(\d+)/;
    let tokens = regexpId.exec(idProduto);
    let id = parseInt(tokens[1]);

    for (let i = 0; i < produtos.length; i++) {
        let produto = produtos[i];
        if (produto.getId() === id) {
            for (let i = 0; i < qtd; i++) {
                carrinho.adicionar(new Item(produto, 1));
            }
            return;
        }
    }
    alert("Produto não identificado");
}

function desenharProdutos(produtos) {
    let tabela = document.querySelector("#produtos");
    for (let i = 0; i < produtos.length; i++) {
        let produto = produtos[i];
        let linha = document.createElement("tr");

        let celulaDescricao = document.createElement("td");
        let textoDescricao = document.createTextNode(produto.descricao);
        celulaDescricao.appendChild(textoDescricao);
        linha.appendChild(celulaDescricao);

        let celulaPreco = document.createElement("td");
        let textoPreco = document.createTextNode("R$" + produto.preco.toFixed(2));
        celulaPreco.appendChild(textoPreco);
        linha.appendChild(celulaPreco);

        /* Input de Quantidade */
        let celulaQuantidade = document.createElement("td");
        let input = document.createElement("input");
        input.setAttribute("id", "qtd" + produto.getId());
        input.setAttribute("type", "number");
        input.setAttribute("min", "0");
        input.setAttribute("value", "0");
        celulaQuantidade.appendChild(input);
        linha.appendChild(celulaQuantidade);

        /* Botão Adicionar */
        let celulaAdicionar = document.createElement("td");
        let botao = document.createElement("button");
        let textoBotao = document.createTextNode("Adicionar");
        botao.setAttribute("id", "produto" + produto.getId());
        botao.appendChild(textoBotao);

        // Define a função onclick para adicionar o item ao carrinho e zerar a quantidade
        botao.onclick = (function (produtoId) {
            return function () {
                let qtdInput = document.getElementById("qtd" + produtoId);
                let quantidade = parseInt(qtdInput.value) || 0;
                if (quantidade > 0) {
                    adicionarAoCesto(this.id, quantidade);
                    qtdInput.value = "0"; // Zera o valor do input após adicionar
                } else {
                    alert("Por favor, insira uma quantidade válida.");
                }
            };
        })(produto.getId());

        celulaAdicionar.appendChild(botao);
        linha.appendChild(celulaAdicionar);

        tabela.appendChild(linha);
    }
}

function atualizarResumo(carrinho) {
    
    let resumo = document.querySelector("#resumo");
    resumo.innerHTML = ""; // Limpa o conteúdo atual
    let title = document.createElement("h2");
    title.textContent = "Resumo da Compra";
    resumo.appendChild(title);
    for (let i = 0; i < carrinho.itens.length; i++) {
        let item = carrinho.itens[i];
        let divItem = document.createElement("div");
        divItem.textContent = item.produto.getDescricao() + " - Quantidade: " + item.quantidade;
        resumo.appendChild(divItem);
    }
    let total = document.createElement("div");
    total.setAttribute("id", "total");
    total.textContent = "Total: R$ " + carrinho.getValorTotal().toFixed(2);
    resumo.appendChild(total);
}

desenharProdutos(produtos);
