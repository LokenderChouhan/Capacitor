import './App.css'
import Stack from './pages/Stack'
import Header from './components/header'
import Cart from './pages/Cart'
import { useCart } from './hooks/useCart'

function App() {
  const { state: {showCart} } = useCart()
  return (
      <div className='pt-[55px] w-full max-w-96 bg-white m-auto h-screen relative'>
        <Header/>
        {showCart ? <Cart/> : <Stack/>}
      </div>
  )
}

export default App
