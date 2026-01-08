# Anymal Widgets - TypeScript Source Code

Multi-sport widgets library rebuilt from compiled JavaScript to TypeScript.

## Features

- **17 Web Components** for modular widget construction
- **Multi-Sport Support**: Football, Basketball, Baseball, F1, MMA, Handball, Volleyball, Rugby, Hockey, AFL
- **Multiple Widget Types**: Games, Standings, Teams, Players, Drivers, Leagues
- **Customizable Themes**: Anymal, Dark, Grey, Blue + custom themes via CSS variables
- **i18n Support**: Portuguese (PT-BR) included, custom languages supported
- **TypeScript**: Fully typed for better DX
- **Vite Build System**: Fast development and optimized production builds

## Project Structure

```
widget/
├── src/
│   ├── components/          # 17 Web Components
│   │   ├── AnymalWidget.ts       # Main widget component
│   │   ├── GamesComponent.ts     # Games list
│   │   ├── GameDetail.ts         # Game details
│   │   ├── GameItem.ts           # Individual game card
│   │   ├── GameList.ts           # Games wrapper
│   │   ├── StandingComponent.ts  # League standings
│   │   ├── LeaguesComponent.ts   # Leagues list
│   │   ├── TeamDetail.ts         # Team details
│   │   ├── PlayerDetail.ts       # Player details
│   │   ├── DriverDetail.ts       # F1 driver details
│   │   ├── DatePicker.ts         # Date selection
│   │   ├── SearchFilter.ts       # Search/filter
│   │   ├── ModalComponent.ts     # Modal dialogs
│   │   ├── SelectComponent.ts    # Custom select
│   │   ├── NavTab.ts             # Tab navigation
│   │   ├── FavoriteStar.ts       # Favorites toggle
│   │   └── ChartStatistics.ts    # Charts/stats
│   ├── config/
│   │   └── endpoints.ts         # API endpoints configuration
│   ├── styles/
│   │   ├── base.css             # Base styles & themes
│   │   └── theme.css            # Custom Anymal theme
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── helpers.ts           # Utility functions
│   │   └── i18n.ts              # Internationalization
│   ├── i18n/
│   │   └── ptbr.json            # Portuguese translations
│   └── main.ts                  # Entry point
├── dist/                        # Build output
├── index.html                   # Development test page
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development

### Install Dependencies

```bash
cd widget
npm install
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 to see the widget in action.

### Build for Production

```bash
# Build sem source maps (produção)
npm run build

# Build com source maps (debug)
npm run build:debug
```

Output will be in `dist/widget.js`

**Builds:**
- `npm run build` → Gera apenas `widget.js` (~41KB) - **console.log removido**
- `npm run build:debug` → Gera `widget.js` + `widget.js.map` (~104KB total) - **mantém console.log**

### Type Checking

```bash
npm run type-check
```

## Usage

### Basic Usage

```html
<anymal-widget
  data-sport="football"
  data-type="games"
  data-league="39"
  data-date="2024-12-04"
  data-theme="anymal">
</anymal-widget>

<script type="module" src="/dist/widget.js"></script>
```

### Supported Sports

- `football` - Soccer/Football
- `basketball` - Basketball
- `baseball` - Baseball
- `f1` - Formula 1
- `mma` - Mixed Martial Arts
- `handball` - Handball
- `volleyball` - Volleyball
- `rugby` - Rugby
- `hockey` - Hockey
- `afl` - Australian Football

### Widget Types

- `games` - List of games/matches
- `game` - Single game detail
- `standings` - League standings table
- `leagues` - List of leagues
- `team` - Team details
- `player` - Player details
- `driver` - F1 driver details (F1 only)
- `fighter` - MMA fighter details (MMA only)
- `fights` - List of fights (MMA only)
- `races` - List of races (F1 only)
- `h2h` - Head-to-head comparison

### Themes

- `anymal` (default) - Anymal green theme
- `dark` - Dark theme
- `grey` - Grey theme
- `blue` - Blue theme
- Custom - Define your own via CSS variables

### Configuration

Global configuration widget:

```html
<anymal-widget data-type="config"
  data-key="your-api-key"
  data-lang="pt"
  data-show-logos="true"
  data-show-toolbar="true"
  data-refresh="30">
</anymal-widget>
```

### Custom Themes

Override CSS variables:

```html
<style>
  anymal-widget[data-theme="custom"] {
    --primary-color: #your-color;
    --background-color: #your-bg;
    --text-color: #your-text;
  }
</style>

<anymal-widget data-theme="custom" ...></anymal-widget>
```

### Custom Languages

```html
<anymal-widget
  data-custom-lang="/path/to/custom-lang.json"
  ...>
</anymal-widget>
```

## API Integration

The widget uses default API endpoints configured in `src/config/endpoints.ts`:

```typescript
// Default endpoints
football: 'https://api.anymal.xyz/'
basketball: 'https://basketball.api.anymal.xyz/'
baseball: 'https://baseball.api.anymal.xyz/'
handball: 'https://handball.api.anymal.xyz/'
volleyball: 'https://volleyball.api.anymal.xyz/'
hockey: 'https://hockey.api.anymal.xyz/'
rugby: 'https://rugby.api.anymal.xyz/'
afl: 'https://afl.api.anymal.xyz/'
mma: 'https://mma.api.anymal.xyz/'
f1: 'https://formula-1.api.anymal.xyz/'
```

### Custom API URLs

You can override default endpoints via configuration widget:

```html
<anymal-widget data-type="config"
  data-url-football="https://your-api.com/football"
  data-url-basketball="https://your-api.com/basketball"
  ...>
</anymal-widget>
```

## Components Documentation

### AnymalWidget (Main Component)

The root widget component that manages configuration and routing.

**Attributes:**
- `data-sport`: Sport type (required)
- `data-type`: Widget type (required)
- `data-theme`: Theme name
- `data-league`: League ID
- `data-date`: Date (YYYY-MM-DD)
- `data-game-id`: Specific game ID
- `data-team-id`: Specific team ID
- `data-player-id`: Specific player ID
- Many more...

### GamesComponent

Displays list of games with filters and date navigation.

### GameDetail

Shows detailed information about a single game.

### StandingComponent

Displays league standings table.

## Next Steps

1. **API Integration**: Connect to actual sports API endpoints
2. **Enhance Components**: Add more detailed game statistics, lineups, events
3. **Testing**: Add unit tests and e2e tests
4. **Performance**: Optimize rendering and data fetching
5. **Accessibility**: Improve ARIA labels and keyboard navigation

## Original Source

This project was reverse-engineered from a compiled widget.js file (618KB, 14,097 lines) to create maintainable TypeScript source code.

## License

MIT
