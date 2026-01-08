/**
 * Anymal Widgets - Main Entry Point
 * Multi-sport widgets library
 */

// Import styles
import './styles/base.css';
import './styles/theme.css';

// Import and register all components
import './components/AnymalWidget.js';
import './components/GamesComponent.js';
import './components/GameDetail.js';
import './components/GameList.js';
import './components/GameItem.js';
import './components/StandingComponent.js';
import './components/LeaguesComponent.js';
import './components/TeamDetail.js';
import './components/PlayerDetail.js';
import './components/DriverDetail.js';
import './components/DatePicker.js';
import './components/SearchFilter.js';
import './components/ModalComponent.js';
import './components/SelectComponent.js';
import './components/NavTab.js';
import './components/FavoriteStar.js';
import './components/ChartStatistics.js';

// Export main widget class for programmatic usage
export { AnymalWidget } from './components/AnymalWidget.js';

// Enable sequential loading
(window as any).__WIDGET_SEQUENTIAL_LOADING__ = true;

console.log('Anymal Widgets loaded successfully');
