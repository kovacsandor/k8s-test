import React, { useRef, useState } from "react";
import axios from "axios";

function App() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [e, setE] = useState("");

  const inputRefF = useRef<HTMLInputElement>(null);
  const inputRefG = useRef<HTMLInputElement>(null);

  const onClickA = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ORIGIN}/microservice-a`);
    setA(JSON.stringify(data));
  };

  const onClickB = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_ORIGIN}/microservice-a/response-including-data-from-microservice-b`
    );
    setB(JSON.stringify(data));
  };

  const onClickC = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_ORIGIN}/microservice-b`);
    setC(JSON.stringify(data));
  };

  const onClickD = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_ORIGIN}/microservice-b/data-from-microservice-b`
    );
    setD(JSON.stringify(data));
  };

  const onClickE = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_ORIGIN}/microservice-a/test-objects-from-database`
    );
    setE(JSON.stringify(data));
  };

  const onClickF = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_ORIGIN}/microservice-a/add-test-object-to-database/${inputRefF.current?.value}`
    );
    if (inputRefF.current) inputRefF.current.value = "";

    console.log(data);
  };

  const onClickG = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_ORIGIN}/microservice-a/test-kafka-producer/${inputRefG.current?.value}`
    );
    if (inputRefG.current) inputRefG.current.value = "";

    console.log(data);
  };

  console.log("process.env", process.env, 'version', 2);

  return (
    <>
      <div>
        <button onClick={onClickA}>GET /microservice-a</button>
        <div>{a}</div>
      </div>
      <div>
        <button onClick={onClickB}>
          GET /microservice-a/response-including-data-from-microservice-b
        </button>
        <div>{b}</div>
      </div>
      <div>
        <button onClick={onClickC}>GET /microservice-b</button>
        <div>{c}</div>
      </div>
      <div>
        <button onClick={onClickD}>
          GET /microservice-b/data-from-microservice-b
        </button>
        <div>{d}</div>
      </div>
      <div>
        <button onClick={onClickE}>
          GET /microservice-a/test-objects-from-database
        </button>
        <div>{e}</div>
      </div>
      <div>
        <input ref={inputRefF} />
        <button onClick={onClickF}>
          POST /microservice-a/add-test-object-to-database/:name
        </button>
      </div>
      <div>
        <input ref={inputRefG} />
        <button onClick={onClickG}>
          POST /microservice-a/test-kafka-producer/:message
        </button>
      </div>
    </>
  );
}

export default App;
