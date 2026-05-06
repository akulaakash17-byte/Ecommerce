import LocationDropdowns from "../components/LocationDropdowns";

const Home = () => {
  return (
    <main className="app-shell">
      <section className="app-intro">
        <p className="eyebrow">Real Estate Web</p>
        <h1>Find properties by local area</h1>
        <p>
          Pick a district, mandal, and village to narrow the property location.
        </p>
      </section>
      <LocationDropdowns />
    </main>
  );
};

export default Home;
