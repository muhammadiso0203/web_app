import { useState } from "react";
import {tests} from "../../data/test"

const Tests = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);


  const selectAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);

    if (current + 1 < tests.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  // 📊 Natija sahifasi
  if (finished) {
    const correctCount = answers.filter(
      (ans, i) => ans === tests[i].correct
    ).length;

    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>📊 Test natijasi</h2>
        <p>Jami testlar: {tests.length}</p>
        <p>To‘g‘ri javoblar: {correctCount}</p>
        <p>Xato javoblar: {tests.length - correctCount}</p>
        <p>
          Natija:{' '}
          <b>{Math.round((correctCount / tests.length) * 100)}%</b>
        </p>
      </div>
    );
  }

  // 🧪 Test sahifasi
  return (
    <div style={{ padding: 20 }}>
      <p>
        Test {current + 1} / {tests.length}
      </p>

      <h3>{tests[current].question}</h3>

      <div>
        {tests[current].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selectAnswer(i)}
            style={{
              display: 'block',
              width: '100%',
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              border: '1px solid #ccc',
              background: '#f9f9f9',
              cursor: 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tests;