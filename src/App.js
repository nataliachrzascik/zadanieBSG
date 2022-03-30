import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Splash from "./components/Splash";
import Main from "./components/Main";
import { connect } from "react-redux";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Splash />} />
          <Route exact path="/main" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};
export default connect(mapStateToProps)(App);
