# Ligas Disponíveis

Esta página lista todas as ligas brasileiras disponíveis nos Anymal Widgets.

---

## Como Usar os IDs das Ligas

Cada liga possui um **ID único** que você pode usar nos widgets. Por exemplo:

```html
<!-- Widget de jogos da Serie A (ID: 71) -->
<anymal-widget data-type="games" data-league="71"></anymal-widget>

<!-- Widget de classificação do Paulista (ID: 475) -->
<anymal-widget data-type="standings" data-league="475"></anymal-widget>

<!-- Widget de configuração -->
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
></anymal-widget>
```

---

## Explorador Interativo de Ligas

Use o explorador abaixo para encontrar o ID da liga que você precisa:

<iframe src="../ligas.html" style="width: 100%; min-height: 800px; border: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>

---

## Ligas Principais

Aqui estão algumas das ligas mais populares:

| Liga | ID | Tipo | Temporada Atual |
|------|-----|------|-----------------|
| **Serie A** | 71 | Liga | 2025 |
| **Serie B** | 72 | Liga | 2025 |
| **Serie C** | 75 | Liga | 2025 |
| **Serie D** | 76 | Liga | 2025 |
| **Copa do Brasil** | 73 | Copa | 2025 |
| **Paulista - A1** | 475 | Liga | 2025 |
| **Carioca - 1** | 624 | Liga | 2025 |
| **Mineiro - 1** | 629 | Liga | 2025 |
| **Gaúcho - 1** | 477 | Liga | 2025 |
| **Copa do Nordeste** | 612 | Copa | 2025 |

---

## Exemplos de Uso

### Exemplo 1: Jogos da Serie A

```html
<anymal-widget data-type="games" data-league="71" data-season="2025"></anymal-widget>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-theme="dark"
></anymal-widget>
```

### Exemplo 2: Classificação do Paulista

```html
<anymal-widget data-type="standings" data-league="475"></anymal-widget>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
></anymal-widget>
```

### Exemplo 3: Múltiplas Ligas

```html
<h2>Serie A</h2>
<anymal-widget data-type="games" data-league="71"></anymal-widget>

<h2>Copa do Brasil</h2>
<anymal-widget data-type="games" data-league="73"></anymal-widget>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
></anymal-widget>
```

---

## Filtrar por Múltiplas Ligas

Você pode exibir jogos de várias ligas ao mesmo tempo separando os IDs com traço:

```html
<!-- Jogos de Serie A (71) e Serie B (72) -->
<anymal-widget data-type="games" data-league="71-72"></anymal-widget>

<!-- Jogos de Paulista (475), Carioca (624) e Mineiro (629) -->
<anymal-widget data-type="games" data-league="475-624-629"></anymal-widget>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
></anymal-widget>
```

---

## Próximos Passos

- [Widgets Comuns](./widgets-comuns.md) - Aprenda a usar os widgets de ligas, jogos e classificação
- [Configuração](./configuracao.md) - Configure seus widgets
- [Exemplos](./widgets-comuns.md#exemplo-completo) - Veja exemplos completos
