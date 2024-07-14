import { useState } from "react";
import { JsonFormat } from "@lib";
import { TextArea } from "@shared/textarea";
import { GithubIcon, MoonIcon, SunIcon, ClipboardIcon } from "@icons";
import { Button } from "@shared/button";
import { Header } from "./components/header";

interface MainPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export function MainPage(props: MainPageProps) {
  const { darkMode, setDarkMode } = props;

  const [data, setData] = useState(
    // '[{ "name": "John Doe", "age": 30, "pac":-2.32e-12, "cars": { "car1": "Ford", "car2": "BMW", "car3": "Fiat" }, "isMarried": true, "spouse": null, "children": [ "Ann", "Billy" ], "pets": [ { "animal": "dog", "name": "Fido" }, { "animal": "cat", "name": "Felix" } ] }, {}, [], "true", false, null, 0]',
    "",
  );
  const [result, setResult] = useState("");

  const handleParse = (newData?: string) => {
    try {
      const jsonFormat = newData ? JsonFormat(newData) : JsonFormat(data);
      setResult(jsonFormat);
    } catch (error: unknown) {
      setResult((error as Error).message);
    }
  };

  const handleJsonInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(() => {
      const data = e.target.value;
      handleParse(data);
      return data;
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-3 md:my-4 mb-2 gap-2 place-content-center">
        <div className="inline-flex justify-center md:justify-start">
          <Button onClick={handleCopy}>
            <ClipboardIcon />
          </Button>
        </div>
        <div className="inline-flex justify-center">
          <Button onClick={() => handleParse()}>Parse</Button>
        </div>
        <div className="w-full gap-2 flex justify-center md:justify-end">
          <Button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </Button>
          <a
            className="bg-gray-300 dark:bg-gray-700 dark:text-slate-50 px-4 py-2 rounded-lg w-auto h-full block"
            target="_blank"
            href="https://github.com/zeroproject-dev/json-web"
          >
            <GithubIcon />
          </a>
        </div>
      </div>
      <div className="min-w-dvw md:h-5/6 pb-6 flex flex-col md:flex-row gap-2">
        <TextArea
          value={data}
          placeholder="Enter Json Object"
          onChange={handleJsonInput}
        />
        <TextArea
          value={result}
          placeholder="Result will be shown here"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setResult(e.target.value);
          }}
        />
      </div>
    </>
  );
}
