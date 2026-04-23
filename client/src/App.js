import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icons
import {
  FaThumbsUp,
  FaThumbsDown,
  FaRoad,
  FaSignOutAlt,
  FaMapMarkedAlt
} from "react-icons/fa";

// ---------------- ICON FIX ----------------
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ---------------- APP ----------------
function App() {
  const [roads, setRoads] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [filter, setFilter] = useState("all");

  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  // ---------------- FETCH ROADS ----------------
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/roads")
      .then((res) => setRoads(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ---------------- LOGIN CHECK ----------------
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // ---------------- VOTE ----------------
  const vote = async (id, type) => {
    const res = await axios.post(
      `http://localhost:5000/api/roads/${id}/vote`,
      { vote_type: type }
    );

    setRoads((prev) =>
      prev.map((r) => (r.id === id ? res.data : r))
    );
  };

  // ---------------- SMART ANALYSIS ----------------
  const goodCount = roads.filter((r) => r.score > 0).length;
  const badCount = roads.filter((r) => r.score <= 0).length;

  const safety =
    roads.length === 0 ? 0 : (goodCount / roads.length) * 100;

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f6fa" }}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2><FaRoad /> Smart Road System</h2>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}
          style={styles.logout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* DASHBOARD */}
      <div style={styles.dashboard}>

        <div style={{ ...styles.card, background: "#dff6ff" }}>
          <h3>Total Roads</h3>
          <h2>{roads.length}</h2>
        </div>

        <div style={{ ...styles.card, background: "#e8fff0" }}>
          <h3>Good Roads</h3>
          <h2>{goodCount}</h2>
        </div>

        <div style={{ ...styles.card, background: "#ffecec" }}>
          <h3>Bad Roads</h3>
          <h2>{badCount}</h2>
        </div>

      </div>

      {/* SAFETY BANNER */}
      <div style={styles.safetyBox}>
        🚦 Route Safety Score: {safety.toFixed(1)}%
      </div>

      {/* FILTER */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("good")}>Good</button>
        <button onClick={() => setFilter("bad")}>Bad</button>
      </div>

      {/* ROUTE INPUT */}
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <input placeholder="Start lat,lng" onChange={(e) => setStartInput(e.target.value)} />
        <input placeholder="End lat,lng" onChange={(e) => setEndInput(e.target.value)} />
        <button><FaMapMarkedAlt /> Route</button>
      </div>

      {/* MAP */}
      <MapContainer
        center={[17.385, 78.486]}
        zoom={10}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {roads
          .filter((r) => {
            if (filter === "good") return r.score > 0;
            if (filter === "bad") return r.score <= 0;
            return true;
          })
          .map((road) => (
            <Marker
              key={road.id}
              position={[Number(road.latitude), Number(road.longitude)]}
            >
              <Popup>
                <b>
                  {road.condition === "good"
                    ? "🟢 Good Road"
                    : "🔴 Bad Road"}
                </b>

                <br />
                {road.description}
                <br />
                Score: {road.score}
                <br /><br />

                <button onClick={() => vote(road.id, 1)}>
                  <FaThumbsUp /> Good
                </button>

                <button onClick={() => vote(road.id, -1)}>
                  <FaThumbsDown /> Bad
                </button>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

// ---------------- STYLES ----------------
const styles = {
  header: {
    background: "linear-gradient(90deg,#1e3c72,#2a5298)",
    color: "white",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logout: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  dashboard: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    margin: "15px"
  },

  card: {
    padding: "15px",
    borderRadius: "10px",
    width: "150px",
    textAlign: "center",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)"
  },

  safetyBox: {
    margin: "10px",
    padding: "10px",
    background: "#fff3cd",
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: "8px"
  }
};

export default App;