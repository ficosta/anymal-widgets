# Anymal Widgets - Documentação

Documentação completa dos **Anymal Widgets v3.1** - Exiba dados esportivos dinâmicos em seu website.

## 🚀 Início Rápido

### Visualizar Localmente

1. **Instalar dependências:**

```bash
pip install -r requirements.txt
```

2. **Iniciar servidor de desenvolvimento:**

```bash
mkdocs serve
```

3. **Acessar:** http://127.0.0.1:8000

### Build da Documentação

```bash
mkdocs build
```

O site estático será gerado na pasta `site/`.

## 📦 Deploy Automático

O deploy para GitHub Pages é feito **automaticamente** via GitHub Actions quando você faz push para `main` ou `master`.

### Configurar GitHub Pages

1. Vá em **Settings** > **Pages** no seu repositório
2. Em **Source**, selecione **Deploy from a branch**
3. Selecione a branch **gh-pages** e pasta **/ (root)**
4. Clique em **Save**

Após o primeiro push, o GitHub Actions irá construir e fazer deploy automaticamente!

## 🔧 Estrutura do Projeto

```
.
├── docs/                    # Arquivos Markdown da documentação
│   ├── index.md            # Página inicial
│   ├── introducao.md       # Introdução
│   ├── antes-de-comecar.md # Antes de começar
│   ├── configuracao.md     # Configuração
│   ├── widgets-comuns.md   # Widgets comuns
│   ├── widgets-dedicados.md # Widgets dedicados
│   ├── stylesheets/        # CSS customizado
│   ├── javascripts/        # JavaScript customizado
│   └── assets/             # Imagens e outros assets
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions workflow
├── mkdocs.yml              # Configuração do MkDocs
├── requirements.txt        # Dependências Python
├── .gitignore             # Arquivos ignorados pelo Git
└── README.md              # Este arquivo
```

## 📝 Comandos Úteis

### Desenvolvimento

| Comando | Descrição |
|---------|-----------|
| `mkdocs serve` | Inicia servidor de desenvolvimento com hot reload |
| `mkdocs serve -a 0.0.0.0:8000` | Servidor acessível na rede local |
| `mkdocs build` | Gera o site estático |
| `mkdocs build --clean` | Limpa e gera o site |

### Deploy

| Comando | Descrição |
|---------|-----------|
| `mkdocs gh-deploy` | Deploy manual para GitHub Pages |
| `mkdocs gh-deploy --force` | Deploy forçado (sobrescreve) |

## 🎨 Personalização

### Alterar Tema

Edite `mkdocs.yml`:

```yaml
theme:
  palette:
    - scheme: default
      primary: indigo    # Mude aqui a cor primária
      accent: indigo     # Mude aqui a cor de destaque
```

Cores disponíveis: `red`, `pink`, `purple`, `deep purple`, `indigo`, `blue`, `light blue`, `cyan`, `teal`, `green`, `light green`, `lime`, `yellow`, `amber`, `orange`, `deep orange`

### Adicionar Página

1. Crie um arquivo `.md` em `docs/`
2. Adicione ao `nav` em `mkdocs.yml`:

```yaml
nav:
  - Início: index.md
  - Sua Nova Página: nova-pagina.md
```

### CSS/JS Customizado

- **CSS:** Edite `docs/stylesheets/extra.css`
- **JavaScript:** Edite `docs/javascripts/extra.js`

## 📚 Recursos

- [MkDocs](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [GitHub Pages](https://pages.github.com/)

## 🔗 Links Úteis

- **Documentação Online:** https://seu-usuario.github.io/anymal-widgets/
- **Repositório:** https://github.com/seu-usuario/anymal-widgets

---

**Versão:** 3.1.0
**Última Atualização:** 2025
