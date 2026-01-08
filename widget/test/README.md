# Anymal Widgets - Test Pages

Páginas HTML de teste para demonstração dos widgets compilados.

## Como Usar

1. **Build o projeto primeiro:**
   ```bash
   cd ..
   npm run build
   ```

2. **Abra os arquivos HTML diretamente no navegador** ou use um servidor local:
   ```bash
   # Usando Python
   python -m http.server 8000

   # Usando Node.js (http-server)
   npx http-server -p 8000
   ```

3. **Acesse:** http://localhost:8000/test/

## Arquivos de Teste

- **index.html** - Dashboard com links para todos os widgets
- **games.html** - Lista de jogos com filtros
- **games2.html** - Múltiplas listas de jogos
- **game.html** - Detalhes de uma partida específica
- **standings.html** - Tabela de classificação
- **team.html** - Detalhes de um time
- **player.html** - Detalhes de um jogador
- **h2h.html** - Confronto direto entre times

## Estrutura de Imports

Todos os arquivos importam:
- **Widget compilado:** `../dist/widget.js` (pasta dist)
- **Estilos:** `./theme.css` (mesma pasta test)
- **Traduções:** `../src/i18n/ptbr.json` (pasta src/i18n)

## Configuração

Cada página usa um widget de configuração global:

```html
<anymal-widget
    data-type="config"
    data-key="Anymal"
    data-sport="football"
    data-custom-lang="../src/i18n/ptbr.json"
    data-theme="anymal"
></anymal-widget>
```

## Temas Disponíveis

- `anymal` (padrão - verde)
- `dark` (escuro)
- `grey` (cinza)
- `blue` (azul)

Para mudar o tema, altere `data-theme="anymal"` para o tema desejado.
