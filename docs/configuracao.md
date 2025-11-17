# Configuração

Este guia mostra como configurar os Anymal Widgets em seu website.

---

## Inserir o Script

Para executar nossos widgets, você deve incluir este arquivo JavaScript na sua página HTML.

Este script é necessário para carregar os componentes web usados por todos os widgets _(games, player, standings, etc.)_.

```html
<script type="module" src="http://widgets.anymal.xyz/widget.js"></script>
```

---

## Inserir o Widget de Configuração

As configurações globais são definidas com um único widget de configuração `data-type="config"`.

Este widget é **obrigatório** para que nossos widgets funcionem e deve estar presente na sua página HTML.

Ele inicializa as configurações gerais _(chave da API, esporte, idioma, tema, etc.)_ para todos os outros widgets na sua página.

### Exemplo Básico:

```html
<anymal-widget data-type="config" data-key="Anymal" data-sport="football"></anymal-widget>
```

> **Importante:** O widget de configuração deve ser incluído apenas uma vez, e todos os outros widgets na página herdarão automaticamente essas configurações, a menos que sejam redefinidas localmente.

Qualquer parâmetro de configuração que você não adicionar ao seu código assumirá automaticamente seu valor padrão.

---

## Parâmetros de Configuração

### Parâmetros Obrigatórios

| Parâmetro   | Tipo   | Descrição                                                           |
| ----------- | ------ | ------------------------------------------------------------------- |
| `data-type` | string | Define a configuração para widgets. Deve ser o valor `config`       |
| `data-key`  | string | (entre em contato para conseguir sua chave) |

### Parâmetros Opcionais

| Parâmetro          | Tipo    | Padrão       | Valores                                                                                                                                     | Descrição                                                                                                                                                                    |
| ------------------ | ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-sport`       | string  | `"football"` | `"afl"`, `"baseball"`, `"basketball"`, `"f1"`, `"football"`, `"handball"`, `"hockey"`, `"mma"`, `"nba"`, `"nfl"`, `"rugby"`, `"volleyball"` | Define o esporte para os widgets. Você pode exibir vários esportes na mesma página definindo o parâmetro `data-sport` diretamente em cada widget.                            |
| `data-lang`        | string  | `"en"`       | `"en"`, `"fr"`, `"es"`, `"it"`                                                                                                              | Define o idioma da interface                                                                                                                                                 |
| `data-custom-lang` | string  | -            | URL                                                                                                                                         | URL de um arquivo JSON de tradução personalizado            |
| `data-theme`       | string  | `"white"`    | `"white"`, `"grey"`, `"dark"`, `"blue"` ou nome personalizado                                                                               | Define o tema visual dos widgets                                                                                                                                             |
| `data-timezone`    | string  | `"utc"`      | Timezone válido                                                                                                                             | Define o fuso horário usado pelos widgets                                                                                                                                    |
| `data-show-logos`  | boolean | `false`      | `true`, `false`                                                                                                                             | Exibe logos nos widgets quando o valor é `true`                                                                                                                              |
| `data-logo-url`    | string  | -            | URL                                                                                                                                         | URL base personalizada para carregar logos |
| `data-show-errors` | boolean | `false`      | `true`, `false`                                                                                                                             | Exibe erros no console quando o valor é `true`                                                                                                                               |
| `data-url-[sport]` | string  | -            | URL                                                                                                                                         | URL personalizada da API para um determinado esporte      |

---

## Exemplos de Configuração

### Exemplo 1: Configuração Básica para Futebol

```html
<anymal-widget data-type="config" data-key="Anymal" data-sport="football"></anymal-widget>
```

### Exemplo 2: Configuração com Tema e Idioma

```html
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-theme="dark"
  data-lang="es"
></anymal-widget>
```

### Exemplo 3: Configuração com Logos e Timezone

```html
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-show-logos="true"
  data-timezone="America/Sao_Paulo"
></anymal-widget>
```

### Exemplo 4: Configuração Completa com Personalização

```html
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-custom-lang="./ptbr.json"
  data-theme="anymal"
  data-show-logos="true"
  data-logo-url="https://sua-cdn.com/logos"
  data-timezone="America/Sao_Paulo"
  data-show-errors="true"
></anymal-widget>
```

### Exemplo 5: Múltiplos Esportes na Mesma Página

```html
<!-- Configuração global padrão -->
<anymal-widget data-type="config" data-key="Anymal" data-sport="football"></anymal-widget>

<!-- Widget de futebol (usa configuração global) -->
<anymal-widget data-type="games" data-league="39"></anymal-widget>

<!-- Widget de basquete (sobrescreve o esporte localmente) -->
<anymal-widget data-type="games" data-sport="basketball" data-league="12"></anymal-widget>

<!-- Widget de Formula 1 (sobrescreve o esporte localmente) -->
<anymal-widget data-type="races" data-sport="f1" data-season="2024"></anymal-widget>
```

---

## URLs Personalizadas por Esporte

Você pode definir URLs personalizadas da API para cada esporte usando o parâmetro `data-url-[sport]`.

Isso é útil para implementar sistemas de cache ou proxy personalizados.

### Exemplo:

```html
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-url-football="https://seu-proxy.com/api/football"
  data-url-basketball="https://seu-proxy.com/api/basketball"
></anymal-widget>
```


---

## Direcionamento de Widgets

Você pode configurar globalmente onde os widgets dinâmicos devem ser abertos usando os parâmetros `data-target-*`.

### Exemplo com Modal:

```html
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-target-game="modal"
  data-target-standings="modal"
  data-target-player="modal"
></anymal-widget>
```

### Exemplo com Container Específico:

```html
<div id="detalhes-container"></div>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-target-game="#detalhes-container"
></anymal-widget>
```

Para mais informações sobre direcionamento dinâmico, consulte [Antes de Começar - Direcionamento Dinâmico](./antes-de-comecar.md#direcionamento-dinâmico).

---

## Exemplo Completo de Página

Aqui está um exemplo completo de uma página HTML com os Anymal Widgets configurados:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Meu Site com Anymal Widgets</title>

    <!-- Script dos Anymal Widgets -->
    <script type="module" src="http://widgets.anymal.xyz/widget.js"></script>

    <!-- Tema personalizado (opcional) -->
    <style>
      anymal-widget[data-theme='meu-tema'] {
        --primary-color: #18cfc0;
        --background-color: #fff;
        --text-color: #333;
      }
    </style>
  </head>
  <body>
    <h1>Jogos de Hoje</h1>

    <!-- Widget de jogos -->
    <anymal-widget data-type="games" data-league="39" data-season="2024"></anymal-widget>

    <!-- Container para detalhes do jogo -->
    <div id="game-details"></div>

    <!-- Widget de configuração (deve ser incluído apenas uma vez) -->
    <anymal-widget
      data-type="config"
      data-key="Anymal"
      data-sport="football"
      data-custom-lang="./ptbr.json"
      data-theme="meu-tema"
      data-show-logos="true"
      data-timezone="America/Sao_Paulo"
      data-target-game="#game-details"
    ></anymal-widget>
  </body>
</html>
```

---

## Próximos Passos

Agora que você configurou os widgets, explore:

- [Widgets Comuns](./widgets-comuns.md) - Ligas, Jogos, Classificação, Times, Jogadores
- [Widgets Dedicados](./widgets-dedicados.md) - Formula 1, MMA
- [Personalização de Temas](./antes-de-comecar.md#tema-personalizado)
- [Otimização de Cache](./introducao.md#cache-de-dados)
