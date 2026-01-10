import AppNavbar from "../src/components/Navbar";
import Dashboard from "./components/Dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <AppNavbar />
      <div style={{ marginTop: '80px' }}> {/* Add margin for fixed navbar */}
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
