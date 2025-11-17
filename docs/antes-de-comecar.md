# Antes de Começar

Antes de integrar os Anymal Widgets em seu website, é importante entender alguns conceitos e configurações fundamentais.

---

## Direcionamento Dinâmico

Alguns widgets, como `games`, podem abrir dinamicamente outros widgets como `game`, `standings`, `player`, e outros.
Esta interação é habilitada usando os atributos `data-target-*`.

Esses atributos permitem que você defina **onde** o widget aberto deve ser renderizado:

- `modal` → renderiza o widget dentro de um modal
- Seletor CSS (`#id` ou `.class`) → injeta o widget em um elemento HTML específico na página

### Opções de Direcionamento Disponíveis

**Para widgets de esportes gerais (Futebol, Basquete, etc.):**

- `data-target-game` - Abre detalhes da partida
- `data-target-standings` - Abre a classificação
- `data-target-team` - Abre perfil do time
- `data-target-player` - Abre perfil do jogador
- `data-target-league` - Abre calendário da liga

**Específico para Formula 1:**

- `data-target-race` - Abre detalhes da corrida
- `data-target-ranking` - Abre ranking
- `data-target-driver` - Abre perfil do piloto

**Específico para MMA:**

- `data-target-fight` - Abre detalhes da luta
- `data-target-fighter` - Abre perfil do lutador

### Exemplo 1: Direcionar para um container por ID

```html
<anymal-widget data-type="games"></anymal-widget>

<div id="detalhes"></div>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-target-game="#detalhes"
></anymal-widget>
```

### Exemplo 2: Direcionar para um modal

```html
<anymal-widget data-type="games"></anymal-widget>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-target-game="modal"
></anymal-widget>
```

---

## Idiomas

O atributo `data-lang` permite que você alterne facilmente o idioma da interface de todos os widgets.

### Idiomas Disponíveis:

- `en` (Inglês)
- `fr` (Francês)
- `es` (Espanhol)
- `it` (Italiano)

### Exemplo de Uso:

```html
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-lang="en"
></anymal-widget>
```

![Exemplo de Idiomas](../assets/lang.png)

### Traduções Personalizadas

Para controle completo sobre o texto, você pode carregar seu próprio arquivo de tradução usando `data-custom-lang`.
Este arquivo deve ser um objeto JSON válido seguindo a estrutura de chaves interna.

Você pode baixar o arquivo de tradução de exemplo [aqui](http://widgets.anymal.xyz/en.json).

**Permite que você:**

- Sobrescreva labels específicos
- Traduza termos faltantes
- Adapte a terminologia ao seu público

**Exemplo de formato JSON:**

```json
{
  "all": "Todos",
  "live": "Ao Vivo",
  "finished": "Finalizados",
  "scheduled": "Agendados",
  "favorites": "Favoritos"
}
```

> **Nota:** Você pode usar `data-lang` e `data-custom-lang` **juntos**.
> Se uma chave estiver definida em ambos, o **arquivo personalizado terá prioridade**.

### Exemplo com Tradução Personalizada:

```html
<anymal-widget data-type="games" data-target-game="modal"></anymal-widget>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-lang="en"
  data-custom-lang="https://seudominio.com/lang/ptbr.json"
></anymal-widget>
```


---

## Temas Predefinidos

Quatro temas integrados estão disponíveis por padrão. Você pode defini-los usando o atributo `data-theme` em qualquer widget.

### Temas Disponíveis:

- `white` (padrão)
- `grey`
- `dark`
- `blue`

Cada tema ajusta cores de fundo, cores de texto, estilos de botões, bordas e muito mais.

### Exemplos Visuais:

**White (Branco)**
![Tema White](../assets/white.png)

**Grey (Cinza)**
![Tema Grey](../assets/grey.png)

**Dark (Escuro)**
![Tema Dark](../assets/dark.png)

**Blue (Azul)**
![Tema Blue](../assets/blue.png)

### Exemplo de Uso:

```html
<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-theme="dark"
></anymal-widget>
```

---

## Tema Personalizado

Você pode sobrescrever os estilos padrão criando seu próprio tema CSS usando o atributo `data-theme` e declarações de variáveis personalizadas.

### Exemplo de Tema Personalizado:

```css
anymal-widget[data-theme='MeuTema'] {
  /* Cores principais */
  --primary-color: #18cfc0;
  --success-color: #2ecc58;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  --light-color: #898989;

  /* Cores de times */
  --home-color: var(--primary-color);
  --away-color: #ffc107;

  /* Cores de texto */
  --text-color: #333;
  --text-color-info: #333;

  /* Cor de fundo */
  --background-color: #fff;

  /* Tamanhos de fonte */
  --primary-font-size: 0.72rem;
  --secondary-font-size: 0.75rem;
  --button-font-size: 0.8rem;
  --title-font-size: 0.9rem;

  /* Transformações de texto */
  --header-text-transform: uppercase;
  --button-text-transform: uppercase;
  --title-text-transform: uppercase;

  /* Bordas e dimensões */
  --border: 1px solid #95959530;
  --game-height: 2.3rem;
  --league-height: 2.35rem;

  /* Tamanhos de elementos */
  --score-size: 2.25rem;
  --flag-size: 22px;
  --teams-logo-size: 18px;
  --teams-logo-size-xl: 5rem;

  /* Efeito hover */
  --hover: rgba(200, 200, 200, 0.15);
}
```

### Usando o Tema Personalizado:

```html
<anymal-widget data-type="games"></anymal-widget>

<div id="game-container"></div>

<anymal-widget
  data-type="config"
  data-key="Anymal"
  data-sport="football"
  data-theme="MeuTema"
></anymal-widget>
```

### Variáveis CSS Disponíveis:

As variáveis acima são apenas alguns exemplos. Você pode personalizar:

- **Cores**: primárias, secundárias, de sucesso, aviso, perigo
- **Tipografia**: tamanhos de fonte, transformações de texto
- **Layout**: alturas, larguras, espaçamentos
- **Elementos visuais**: bordas, sombras, efeitos hover
- **Logos e ícones**: tamanhos personalizados

---

## Próximos Passos

Agora que você conhece as configurações básicas, está pronto para:

- [Configurar seu primeiro widget](./configuracao.md)
- [Explorar widgets comuns](./widgets-comuns.md)
- [Ver widgets dedicados](./widgets-dedicados.md)
