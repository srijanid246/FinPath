import Navbar from "./navbar";
import Hero from "./hero";
import Login from "./login";
import "./styles/landing.css";

function Landing() {

  return (
    <div>

      <Navbar />

      <section className="hero-section">

        <Hero />

        <Login />

      </section>

    </div>
  );
}

export default Landing;