import { useState } from "react";
import "./App.css";
import { Json } from "./lib";

function App() {
  const [data, setData] = useState(
    '[{ "name": "John Doe", "age": 30, "pac":-2.32e-12, "cars": { "car1": "Ford", "car2": "BMW", "car3": "Fiat" }, "isMarried": true, "spouse": null, "children": [ "Ann", "Billy" ], "pets": [ { "animal": "dog", "name": "Fido" }, { "animal": "cat", "name": "Felix" } ] }, {}, [], "true", false, null, 0]',
  );

  const [result, setResult] = useState({});

  const handleParse = () => {
    try {
      setResult(Json(data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <textarea
          rows={10}
          cols={80}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button onClick={() => handleParse()}>Parse</button>
        <textarea
          rows={10}
          cols={80}
          value={JSON.stringify(result, null, 2)}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
    </>
  );
}

export default App;
