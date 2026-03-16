import React from "react";
import { Spin } from "antd";

const text = ["Loading.", "Loading..", "Loading..."];

function LoadingComponent() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const swapTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % text.length);
    }, 800);

    return () => {
      clearTimeout(swapTimer);
    };
  }, [index]);

  return <Spin fullscreen description={text[index]} />;
}

export default LoadingComponent;
