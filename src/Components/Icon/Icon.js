import React from "react";

const icons = {
  X: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 769 1024">
      <path
        fill="currentColor"
        d="m462 512l286 401q21 28 21 47q0 27-19 45.5t-45 18.5q-7 0-13.5-1t-11.5-3.5t-8.5-4.5t-8-6t-5.5-5.5t-5-6.5l-4-5l-265-370l-264 370l-4 5l-5 6.5l-5.5 5.5l-8 6l-9 4.5L77 1023l-13 1q-26 0-45-18.5T0 960q0-19 21-47l286-401L16 105q-1-1-4-5.5T7.5 93T4 86.5t-2.5-10T1 64q0-26 18.5-45T65 0q38 0 56 34l263 369L648 34q18-34 56-34q27 0 45.5 19T768 64q0 7-.5 12.5t-2.5 10t-3.5 6.5t-4.5 6.5t-4 5.5z"
      />
    </svg>
  ),
  O: (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 768 1024">
      <path
        fill="currentColor"
        d="M512 1024H256q-106 0-181-75T0 768V256Q0 150 75 75T256 0h256q106 0 181 75t75 181v512q0 106-75 181t-181 75zM256 896h256q31 0 61-16L128 267v501q0 53 37.5 90.5T256 896zm256-768H256q-32 0-61 16l445 613V256q0-53-37.5-90.5T512 128z"
      />
    </svg>
  ),
};

const Icon = ({ type = "X", size = 48, color = "currentColor" }) => {
  const icon = icons[type];

  if (!icon) return null;

  return React.cloneElement(icon, {
    width: size,
    height: size,
    style: { color },
  });
};

export default Icon;
