import { useState } from "react";

import AppLayout from "./Applayout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AppLayout />
    </>
  );
}

export default App;
