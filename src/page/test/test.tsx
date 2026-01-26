import { useEffect, useState } from "react";
import { tests } from "../../data/test";

const TIME_PER_TEST = 30; 

const Tests = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TEST);

  // ⏱ Timer ishlashi
  useEffect(() => {
    if (finished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleTimeOut();
          return TIME_PER_TEST;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [current, finished]);

  // ⏰ Vaqt tugaganda
  const handleTimeOut = () => {
    const newAnswers = [...answers];
    newAnswers[current] = -1; // javob tanlanmadi
    setAnswers(newAnswers);

    if (current + 1 < tests.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  // ✅ Javob tanlanganda
  const selectAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);

    setTimeLeft(TIME_PER_TEST);

    if (current + 1 < tests.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  /* =====================
     NATIJA SAHIFASI
  ====================== */
  if (finished) {
    const correctCount = answers.filter(
      (ans, i) => ans === tests[i].correct
    ).length;

    const skipped = answers.filter((a) => a === -1).length;

    return (
      <div style={styles.resultWrapper}>
        <h2 style={styles.title}>📊 Test natijasi</h2>

        <p>Jami testlar: <b>{tests.length}</b></p>
        <p>To‘g‘ri: <b style={{ color: "#22c55e" }}>{correctCount}</b></p>
        <p>Xato: <b style={{ color: "#ef4444" }}>
          {tests.length - correctCount - skipped}
        </b></p>
        <p>Belgilanmadi: <b>{skipped}</b></p>

        <div style={styles.percent}>
          {Math.round((correctCount / tests.length) * 100)}%
        </div>
      </div>
    );
  }

  /* =====================
     TEST SAHIFASI
  ====================== */
  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        <span>
          Test {current + 1} / {tests.length}
        </span>
        <span style={styles.timer}>
          ⏱ {timeLeft}s
        </span>
      </div>

      <h3 style={styles.question}>
        {tests[current].question}
      </h3>

      {tests[current].options.map((opt, i) => (
        <button
          key={i}
          onClick={() => selectAnswer(i)}
          style={styles.option}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export default Tests;

/* =====================
   STYLES
====================== */
const styles = {
  wrapper: {
    maxWidth: 480,
    margin: "40px auto",
    padding: 24,
    background: "#000000",
    color: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    fontSize: 14,
    color: "#94a3b8",
  },
  timer: {
    color: "#facc15",
    fontWeight: 600,
  },
  question: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 20,
  },
  option: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: 12,
    borderRadius: 12,
    border: "none",
    background: "#111827",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: 16,
    textAlign: "left" as const,
  },
  resultWrapper: {
    maxWidth: 420,
    margin: "60px auto",
    padding: 32,
    background: "#ffffff",
    color: "#000000",
    borderRadius: 20,
    textAlign: "center" as const,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  percent: {
    marginTop: 20,
    fontSize: 42,
    fontWeight: 700,
    color: "#2563eb",
  },
};
