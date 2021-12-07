import Reservation from './components/Reservation'
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

function App() {
  return (
    <div className="App">
      <MuiThemeProvider>
        <Reservation/>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
