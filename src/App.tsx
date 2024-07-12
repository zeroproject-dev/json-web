import { useState } from "react";
import "./App.css";
import { lexer, parser } from "./lib";

function App() {
  const [data, setData] = useState(
    '[{ "name": "John Doe", "age": 30, "pac":-2.32e-12, "cars": { "car1": "Ford", "car2": "BMW", "car3": "Fiat" }, "isMarried": true, "spouse": null, "children": [ "Ann", "Billy" ], "pets": [ { "animal": "dog", "name": "Fido" }, { "animal": "cat", "name": "Felix" } ] }]',
  );

  const handleParse = () => {
    try {
      console.time("parse");
      lexer.setData(data);
      const tokens = lexer.getTokens();
      console.log("tokens", tokens);
      parser.setTokens(tokens);
      const astParse = parser.parse();
      console.log("astParse", astParse);
      console.timeEnd("parse");
      console.time("parse time");
      console.log(JSON.parse(data));
      console.timeEnd("parse time");
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
      </div>
    </>
  );
}

export default App;
