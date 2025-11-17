# Introdução aos Anymal Widgets

## Visão Geral

Os **Anymal Widgets** permitem que você exiba facilmente **dados esportivos dinâmicos** em seu website.

Eles são projetados para serem:

- **Ultra-modulares**: cada componente é autônomo
- **Personalizáveis**: idioma, tema, conteúdo e comportamento
- **Fáceis de integrar**: não requer framework, apenas uma simples tag HTML é suficiente

Os widgets utilizam requisições da sua conta Anymal Widgets e funcionam com **todos os planos**, incluindo o plano gratuito.

---

## Segurança

Nossos widgets utilizam a API-KEY da sua conta, que deve ser especificada no atributo `data-key` da configuração do seu widget.

Ao usar esses widgets, é importante estar ciente de que sua API-KEY ficará visível para os usuários do seu site. É possível se proteger disso entrando em contato para configurar permissões de domínios ou IPs.

Dessa forma, ninguém mais poderá usar sua API-KEY em seu lugar.

---

## Depuração

Se o widget não exibir as informações solicitadas, é possível definir a tag `data-show-errors` como **true** para exibir mensagens de erro diretamente no widget e no console.

Isso pode ser devido a várias coisas como _(lista não exaustiva)_:

- Você atingiu seu número diário de requisições
- As tags estão preenchidas incorretamente
- Sua API-KEY está incorreta

### Exemplo de uso:

```html
<anymal-widget
  data-type="games"
  data-league="39"
  data-show-errors="true"
></anymal-widget>
```

---

## Todos os Widgets Disponíveis

Abaixo está a lista de todos os widgets disponíveis:

- `games` → lista de partidas
- `game` → detalhes de uma partida
- `team` → perfil do time
- `player` → perfil do jogador
- `standings` → tabela de classificação
- `league` → calendário da competição
- `leagues` → lista de todas as ligas
- `h2h` → histórico de confrontos diretos
- `races`, `race`, `driver` → Formula 1
- `fights`, `fight`, `fighter` → MMA

> Cada widget se adapta automaticamente com base no esporte selecionado.

### Exemplo de Widget de Jogos:

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
  data-theme="anymal"
></anymal-widget>
```

---

## Próximos Passos

- [Configuração Inicial](./configuracao.md) - Como começar
- [Antes de Começar](./antes-de-comecar.md) - Configurações importantes
- [Widgets Comuns](./widgets-comuns.md) - Explore todos os widgets disponíveis
