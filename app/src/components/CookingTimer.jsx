import { useEffect, useState } from "react";

export default function CookingTimer({
  initialMinutes = 10,
}) {
  const [seconds, setSeconds] = useState(
    initialMinutes * 60
  );

  const [running, setRunning] =
    useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) {
      if (seconds <= 0) {
        setRunning(false);
      }

      return;
    }

    const timer = setInterval(() => {
      setSeconds((current) =>
        Math.max(0, current - 1)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [running, seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const display = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(
    2,
    "0"
  )}`;

  function reset() {
    setRunning(false);
    setSeconds(initialMinutes * 60);
  }

  return (
    <div className="cooking-timer">
      <div className="timer-title">
        <span>⏱️</span>
        <div>
          <strong>Cooking Timer</strong>
          <small>Keep track while cooking</small>
        </div>
      </div>

      <div
        className={`timer-display ${
          seconds === 0 ? "finished" : ""
        }`}
      >
        {display}
      </div>

      {seconds === 0 && (
        <div className="timer-finished">
          🎉 Time's up!
        </div>
      )}

      <div className="timer-actions">
        <button
          onClick={() =>
            setRunning((current) => !current)
          }
        >
          {running ? "Pause" : "Start"}
        </button>

        <button
          className="timer-reset"
          onClick={reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}