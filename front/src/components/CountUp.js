import React from "react";
import CountUp from "react-countup";

function CountUpComponent({ value, prefix }) {
  return (
    <div>
      <CountUp
        start={0}
        end={value}
        duration={1.75}
        prefix={prefix ? prefix : ""}
      />
    </div>
  );
}

export default CountUpComponent;
