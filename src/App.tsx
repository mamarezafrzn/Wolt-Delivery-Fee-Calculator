import './App.css';
import DeliveryFeeCalculator from './components/deliveryFeeCalculator';
import woltLogo from "./img/wolt-logos-id6EQwzjcG.svg"

function App() {
  return (
    <div className="App">
      <img src={woltLogo} alt="" className='logo'/>
     <DeliveryFeeCalculator/>
    </div>
  );
}

export default App;
