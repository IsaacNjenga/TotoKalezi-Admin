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
  }, [index, ]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(104, 93, 93, 0.5)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <p
            style={{
              color: "#ffffff",
              fontSize: 18,
              marginTop: "1rem",
            }}
          >
            {text[index]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingComponent;
