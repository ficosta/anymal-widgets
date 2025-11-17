# Anymal Widgets - Documentação v3.1

Bem-vindo à documentação completa dos **Anymal Widgets** v3.1.0

## Sobre os Anymal Widgets

Os Anymal Widgets permitem que você exiba facilmente **dados esportivos dinâmicos** em seu website.

Eles são projetados para serem:
- **Ultra-modulares**: cada componente é autônomo
- **Personalizáveis**: idioma, tema, conteúdo e comportamento
- **Fáceis de integrar**: não requer framework, apenas uma simples tag HTML

## Índice da Documentação

### 1. [Introdução](./introducao.md)
- Visão Geral
- Segurança
- Cache de Dados
- Depuração
- Logos e Imagens
- Widgets Disponíveis

### 2. [Antes de Começar](./antes-de-comecar.md)
- Direcionamento Dinâmico
- Idiomas
- Temas Predefinidos
- Tema Personalizado

### 3. [Configuração](./configuracao.md)
- Script & Configuração Inicial
- Parâmetros Globais

### 4. [Widgets Comuns](./widgets-comuns.md)
- **Leagues** (Ligas) - Lista de competições e calendário
- **Games** (Jogos) - Lista de partidas e detalhes
- **Standings** (Classificação) - Tabelas de classificação
- **Teams** (Times) - Perfil de times
- **Players** (Jogadores) - Perfil de jogadores
- **Head to Head** (H2H) - Histórico entre times

### 5. [Widgets Dedicados](./widgets-dedicados.md)
- **Formula-1** - Corridas, pilotos e times de F1
- **MMA** - Lutas e lutadores

## Início Rápido

### 1. Inserir o Script

```html
<script src="http://widgets.anymal.xyz/widget.js"></script>
```

### 2. Configurar seu Widget

```html
<anymal-widget
  data-type="games"
  data-league="39"
  data-season="2024"
></anymal-widget>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-custom-lang="./ptbr.json"
  data-theme="anymal"
></anymal-widget>
```

## Esportes Suportados

- ⚽ **Football** (Futebol)
- 🏈 **NFL** (Futebol Americano)
- 🏀 **Basketball** (Basquete)
- 🏀 **NBA**
- 🏉 **Rugby**
- 🏒 **Hockey**
- 🤾 **Handball** (Handebol)
- 🏐 **Volleyball** (Vôlei)
- ⚾ **Baseball**
- 🏉 **AFL** (Australian Football)
- 🏎️ **Formula-1**
- 🥊 **MMA**

## Links Úteis

- [Configuração Inicial](./configuracao.md)
- [Exemplos de Código](./widgets-comuns.md)
- [Personalização de Temas](./antes-de-comecar.md#tema-personalizado)
- [Otimização de Cache](./introducao.md#cache-de-dados)

## Suporte

Para questões sobre a implementação dos widgets, consulte a seção de [Depuração](./introducao.md#depuração) na documentação.

---

**Versão**: 3.1.0
**Última Atualização**: 2025
