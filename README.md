# Consulta Tabela FIPE 🚗🏍️🚚

Aplicação web moderna e responsiva para consulta de preços médios de veículos no Brasil, utilizando a Tabela FIPE oficial.

![Status do Projeto](https://img.shields.io/badge/status-concluído-brightgreen)
![Licença](https://img.shields.io/badge/license-MIT-blue)

## 📋 Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de fornecer uma interface limpa, rápida e intuitiva para consultar valores de carros, motos e caminhões. A aplicação consome dados em tempo real através de uma API pública, garantindo que as informações estejam sempre atualizadas conforme a referência mensal da FIPE.

## 🚀 Funcionalidades

- **Consulta Completa**: Preços de Carros, Motos e Caminhões.
- **Busca em Cascata Interativa**:
  1.  Seleção de **Marca**
  2.  Seleção de **Modelo** (filtrado pela marca)
  3.  Seleção de **Ano/Combustível** (filtrado pelo modelo)
- **Resultados Detalhados**: Exibe preço, mês de referência, código FIPE e combustível.
- **Design Responsivo**: Otimizado para funcionar perfeitamente em desktops, tablets e smartphones.
- **Feedback Visual**: Indicadores de carregamento para melhor experiência do usuário.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web padrão (Vanilla), garantindo leveza e facilidade de hospedagem.

-   **HTML5** - Estrutura semântica.
-   **CSS3** - Estilização moderna com variáveis CSS (Custom Properties) e Flexbox/Grid.
-   **JavaScript (ES6+)** - Lógica de consumo da API e manipulação do DOM.
-   **API**: [FIPE API (Parallelum)](https://deividfortuna.github.io/fipe/)

## 📦 Como Usar

### Pré-requisitos

Você só precisa de um navegador web para rodar o projeto. Para servir os arquivos localmente de forma ideal, recomenda-se uma extensão como "Live Server" (VS Code) ou um servidor simples via terminal.

### Instalação e Execução

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/seu-usuario/tabelafipe.git
    cd tabelafipe
    ```

2.  **Execute localmente** (Exemplo com Python ou Node.js)
    *   Com Python:
        ```bash
        python -m http.server 8080
        ```
    *   Com Node.js (npx):
        ```bash
        npx http-server
        ```

3.  **Acesse no navegador**
    Abra `http://localhost:8080` (ou a porta indicada no seu terminal).

## 📂 Estrutura de Arquivos

```
/
├── index.html          # Página principal
├── assets/
│   ├── css/
│   │   └── style.css   # Estilos
│   └── js/
│       └── main.js     # Lógica e integração API
└── README.md           # Documentação
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1.  Faça um Fork do projeto
2.  Crie uma Branch para sua Feature (`git checkout -b feature/MinhaFeature`)
3.  Faça o Commit (`git commit -m 'Adicionando MinhaFeature'`)
4.  Faça o Push (`git push origin feature/MinhaFeature`)
5.  Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido com 💙 por [Walla].
