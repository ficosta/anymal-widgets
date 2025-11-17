# Widgets Comuns

Os widgets comuns funcionam com a maioria dos esportes suportados e permitem exibir informações sobre ligas, jogos, classificações, times e jogadores.

---

## Leagues (Ligas)

Os widgets de Ligas oferecem uma maneira intuitiva de navegar pelas competições esportivas e acompanhar sua evolução.

### Widget: Leagues (Lista de Ligas)

Lista todas as ligas para o esporte selecionado, agrupadas por país, com a opção de favoritar países para acesso rápido.

**Esportes Suportados:** `Football`, `Baseball`, `Basketball`, `Handball`, `Hockey`, `NFL`, `Rugby`, `Volleyball`

![Exemplo do widget Leagues](../assets/leagues.png)

#### Parâmetros:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `data-type` | string | ✅ | Deve ser `leagues` |
| `data-target-league` | string | ❌ | Habilita e define onde exibir os jogos da liga. Pode ser `modal` ou um seletor CSS (ex: `#detalhes`, `.container`) |

#### Exemplos:

**Exemplo Básico:**
```html
<anymal-widget
  data-type="leagues"
></anymal-widget>
```

**Exemplo com Target:**
```html
<anymal-widget data-type="leagues"></anymal-widget>

<div id="league-container"></div>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-target-league="#league-container"
></anymal-widget>
```

---

### Widget: League (Calendário da Liga)

Exibe o calendário completo de uma competição, dividido em jogos de hoje, jogos concluídos e próximos jogos.

**Esportes Suportados:** `Football`, `AFL`, `Baseball`, `Basketball`, `Handball`, `Hockey`, `NBA`, `NFL`, `Rugby`, `Volleyball`

![Exemplo do widget League](../assets/league.png)

#### Parâmetros:

| Parâmetro | Tipo | Obrigatório | Padrão | Valores | Descrição |
|-----------|------|-------------|--------|---------|-----------|
| `data-type` | string | ✅ | - | - | Deve ser `league` |
| `data-league` | integer | ✅ | - | - | ID da liga |
| `data-season` | string | ❌ | última temporada | YYYY | Define qual temporada exibir |
| `data-tab` | string | ❌ | primeira aba com dados | `"today"`, `"results"`, `"games"`, `"standings"` | Define a aba a selecionar quando o widget abre |
| `data-standings` | boolean | ❌ | `false` | `true`, `false` | Habilita classificação quando o valor é `true` |
| `data-target-game` | string | ❌ | - | - | Habilita e define onde exibir detalhes do jogo. Pode ser `modal` ou seletor CSS |
| `data-refresh` | string/integer | ❌ | - | ≥15 | Intervalo de atualização automática em segundos, ou `true` para usar valor padrão |

#### Exemplos:

**Configuração Mínima:**
```html
<anymal-widget
  data-type="league"
  data-league="39"
></anymal-widget>
```

**Com Classificação Habilitada:**
```html
<anymal-widget
  data-type="league"
  data-league="39"
  data-standings="true"
></anymal-widget>
```

**Com Aba de Resultados Selecionada:**
```html
<anymal-widget
  data-type="league"
  data-league="39"
  data-tab="results"
></anymal-widget>
```

**Com Atualização Automática:**
```html
<anymal-widget
  data-type="league"
  data-league="39"
  data-refresh="20"
></anymal-widget>
```

---

## Games (Jogos)

Com os widgets de Jogos, os usuários podem acompanhar partidas em tempo real e acessar informações detalhadas.

### Widget: Games (Lista de Jogos)

Exibe a lista de jogos agrupados por competição de acordo com os parâmetros utilizados. As partidas são atualizadas automaticamente de acordo com a frequência selecionada em `data-refresh`.

**Esportes Suportados:** `Football`, `AFL`, `Baseball`, `Basketball`, `Handball`, `Hockey`, `NBA`, `NFL`, `Rugby`, `Volleyball`

![Exemplo do widget Games](../assets/games.png)

#### Parâmetros:

| Parâmetro | Tipo | Obrigatório | Padrão | Valores | Descrição |
|-----------|------|-------------|--------|---------|-----------|
| `data-type` | string | ✅ | - | - | Deve ser `games` |
| `data-date` | string | ❌ | hoje | YYYY-MM-DD | Filtrar jogos por data |
| `data-league` | integer | ❌ | - | - | Filtrar jogos por ID(s) da liga, usando um ou mais valores separados por traços |
| `data-country` | string | ❌ | - | - | Filtrar jogos por país |
| `data-refresh` | string/integer | ❌ | - | ≥15 | Intervalo de atualização automática em segundos |
| `data-show-toolbar` | boolean | ❌ | `false` | `true`, `false` | Exibir barra de ferramentas superior |
| `data-tab` | string | ❌ | primeira com dados | `"all"`, `"live"`, `"finished"`, `"scheduled"` | Aba a selecionar quando o widget abre |
| `data-games-style` | integer | ❌ | `1` | `1`, `2` | Define se os jogos são exibidos em uma ou duas linhas |
| `data-target-game` | string | ❌ | - | - | Define onde exibir detalhes do jogo (`modal` ou seletor CSS) |
| `data-target-standings` | string | ❌ | - | - | Define onde exibir classificação (`modal` ou seletor CSS) |

#### Exemplos:

**Mínimo:**
```html
<anymal-widget
  data-type="games"
></anymal-widget>
```

**Com Parâmetro de Data:**
```html
<anymal-widget
  data-type="games"
  data-date="2024-12-25"
></anymal-widget>
```

**Com Parâmetro de Liga:**
```html
<anymal-widget
  data-type="games"
  data-league="39-253"
></anymal-widget>
```

**Com Parâmetro de País:**
```html
<anymal-widget
  data-type="games"
  data-country="England"
></anymal-widget>
```

**Com Atualização a Cada 15 Segundos:**
```html
<anymal-widget
  data-type="games"
  data-refresh="15"
></anymal-widget>
```

**Layout Compacto (Uma Linha):**
```html
<anymal-widget
  data-type="games"
  data-games-style="2"
></anymal-widget>
```

**Com Aba "Ao Vivo" Selecionada:**
```html
<anymal-widget
  data-type="games"
  data-tab="live"
></anymal-widget>
```

**Sem Barra de Ferramentas:**
```html
<anymal-widget
  data-type="games"
  data-show-toolbar="false"
></anymal-widget>
```

---

### Widget: Game (Detalhes do Jogo)

Exibe detalhes completos de um jogo. Exceto para futebol, você precisará habilitar as abas deste widget usando parâmetros.

**Esportes Suportados:** `Football`, `AFL`, `Baseball`, `Basketball`, `Handball`, `Hockey`, `NBA`, `NFL`, `Rugby`, `Volleyball`

![Exemplo do widget Game](../assets/game.png)

#### Parâmetros:

| Parâmetro | Tipo | Obrigatório | Padrão | Valores | Descrição |
|-----------|------|-------------|--------|---------|-----------|
| `data-type` | string | ✅ | - | - | Deve ser `game` |
| `data-game-id` | integer | ✅ | - | - | ID do jogo |
| `data-refresh` | string/integer | ❌ | - | ≥15 | Intervalo de atualização automática em segundos |
| `data-game-tab` | string | ❌ | primeira com dados | `"events"`, `"statistics"`, `"lineups"`, `"players"`, `"scores"`, `"rosters"` | Aba a selecionar quando o widget abre |
| `data-team-statistics` | boolean | ❌ | `false` | `true`, `false` | Habilita estatísticas de times (somente `Basketball`, `NBA`, `AFL`, `NFL`) |
| `data-player-statistics` | boolean | ❌ | `false` | `true`, `false` | Habilita estatísticas de jogadores (somente `Basketball`, `AFL`, `NFL`) |
| `data-events` | boolean | ❌ | `false` | `true`, `false` | Habilita eventos (somente `Hockey`, `AFL`, `NFL`) |
| `data-quarters` | boolean | ❌ | `false` | `true`, `false` | Habilita pontuação por quartos (somente `AFL`) |
| `data-target-team` | string | ❌ | - | - | Define onde exibir detalhes do time (`modal` ou seletor CSS) |
| `data-target-player` | string | ❌ | - | - | Define onde exibir detalhes do jogador (`modal` ou seletor CSS) |

#### Exemplos:

**Mínimo:**
```html
<anymal-widget
  data-type="game"
  data-game-id="1234"
></anymal-widget>
```

**Com Atualização a Cada 20 Segundos:**
```html
<anymal-widget
  data-type="game"
  data-game-id="1234"
  data-refresh="20"
></anymal-widget>
```

**Com Estatísticas de Times (Basketball/NBA):**
```html
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="basketball"
></anymal-widget>

<anymal-widget
  data-type="game"
  data-game-id="1234"
  data-team-statistics="true"
></anymal-widget>
```

**Com Estatísticas de Jogadores:**
```html
<anymal-widget
  data-type="game"
  data-game-id="1234"
  data-player-statistics="true"
></anymal-widget>
```

---

### Widget: H2H (Head to Head / Confronto Direto)

O widget H2H destaca o histórico de confrontos entre dois times para comparação rápida e fácil.

**Esportes Suportados:** `Football`, `AFL`, `Baseball`, `Basketball`, `Handball`, `Hockey`, `NBA`, `NFL`, `Rugby`, `Volleyball`

#### Parâmetros:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `data-type` | string | ✅ | Deve ser `h2h` |
| `data-home` | integer | ✅ | ID do time mandante |
| `data-away` | integer | ✅ | ID do time visitante |

#### Exemplo:

```html
<anymal-widget
  data-type="h2h"
  data-home="33"
  data-away="34"
></anymal-widget>
```

---

## Standings (Classificação)

O widget Standings fornece uma visão rápida e completa das tabelas de classificação para qualquer temporada.

### Widget: Standings

Exibe a tabela de classificação de uma liga, facilitando o acompanhamento das posições e desempenho dos times.

**Esportes Suportados:** `Football`, `AFL`, `Baseball`, `Basketball`, `Handball`, `Hockey`, `NBA`, `NFL`, `Rugby`, `Volleyball`

#### Parâmetros:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `data-type` | string | ✅ | Deve ser `standings` |
| `data-league` | integer | ✅ | ID da liga |
| `data-season` | string | ❌ | Define qual temporada exibir (formato: YYYY). Usa a última temporada por padrão |

#### Exemplos:

**Exemplo Básico:**
```html
<anymal-widget
  data-type="standings"
  data-league="39"
></anymal-widget>
```

**Com Temporada Específica:**
```html
<anymal-widget
  data-type="standings"
  data-league="39"
  data-season="2023"
></anymal-widget>
```

---

## Teams (Times)

O widget Team permite que os usuários mergulhem em informações abrangentes sobre times, incluindo estatísticas, detalhes do elenco e dados do estádio.

### Widget: Team

Exibe perfil completo de um time com estatísticas, jogadores e informações do estádio.

**Esportes Suportados:** `Football`, `AFL`, `Baseball`, `Basketball`, `Handball`, `Hockey`, `NBA`, `NFL`, `Rugby`, `Volleyball`

#### Parâmetros:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `data-type` | string | ✅ | Deve ser `team` |
| `data-team` | integer | ✅ | ID do time |
| `data-league` | integer | ❌ | ID da liga (para exibir estatísticas específicas da liga) |
| `data-season` | string | ❌ | Temporada (formato: YYYY) |

#### Exemplos:

**Exemplo Básico:**
```html
<anymal-widget
  data-type="team"
  data-team="33"
></anymal-widget>
```

**Com Liga e Temporada:**
```html
<anymal-widget
  data-type="team"
  data-team="33"
  data-league="39"
  data-season="2024"
></anymal-widget>
```

---

## Players (Jogadores)

Com o widget Player, os usuários podem explorar informações detalhadas sobre um jogador, desde perfil pessoal e estatísticas de desempenho até lesões e troféus.

### Widget: Player

Exibe perfil completo de um jogador com estatísticas, histórico e informações pessoais.

**Esportes Suportados:** `Football`, `AFL`, `NBA`, `NFL`

#### Parâmetros:

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `data-type` | string | ✅ | Deve ser `player` |
| `data-player` | integer | ✅ | ID do jogador |
| `data-season` | string | ❌ | Temporada (formato: YYYY) |

#### Exemplos:

**Exemplo Básico:**
```html
<anymal-widget
  data-type="player"
  data-player="276"
></anymal-widget>
```

**Com Temporada Específica:**
```html
<anymal-widget
  data-type="player"
  data-player="276"
  data-season="2024"
></anymal-widget>
```

---

## Exemplo Completo

Aqui está um exemplo completo integrando vários widgets:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Esportivo - Anymal Widgets</title>

  <!-- Script dos Anymal Widgets -->
  <script type="module" src="http://widgets.anymal.xyz/widget.js"></script>
</head>
<body>
  <h1>Premier League 2024</h1>

  <!-- Widget de Jogos -->
  <h2>Jogos de Hoje</h2>
  <anymal-widget
    data-type="games"
    data-league="39"
    data-refresh="30"
  ></anymal-widget>

  <!-- Widget de Classificação -->
  <h2>Classificação</h2>
  <anymal-widget
    data-type="standings"
    data-league="39"
    data-season="2024"
  ></anymal-widget>

  <!-- Container para detalhes -->
  <div id="detalhes"></div>

  <!-- Widget de Configuração -->
  <anymal-widget
    data-type="config"
    data-key="Anymal"
    data-sport="football"
    data-custom-lang="./ptbr.json"
    data-theme="anymal"
    data-show-logos="true"
    data-target-game="#detalhes"
    data-target-team="modal"
    data-target-player="modal"
  ></anymal-widget>
</body>
</html>
```

---

## Próximos Passos

- [Widgets Dedicados](./widgets-dedicados.md) - Formula 1 e MMA
- [Personalização Avançada](./antes-de-comecar.md#tema-personalizado)
- [Otimização de Performance](./introducao.md#cache-de-dados)
