import { useEffect, useState } from "react";
import { ArrowLeft, LineChart } from "lucide-react";
import { tests } from "../../data/test";
import { useNavigate } from "react-router";
import { useSubmitTest } from "../service/checkResult";

const TIME_PER_TEST = 30;

const Tests = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TEST);

  const navigate = useNavigate();
  const { mutate: submitTest, isPending } = useSubmitTest();

  const test = tests.level1.tests1;

  /* ================= TIMER ================= */
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

  /* ================= TIME OUT ================= */
  const handleTimeOut = () => {
    const newAnswers = [...answers];
    newAnswers[current] = -1;
    setAnswers(newAnswers);

    if (current + 1 < test.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  /* ================= ANSWER ================= */
  const selectAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);

    setTimeLeft(TIME_PER_TEST);

    if (current + 1 < test.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  /* ================= BACKENDGA YUBORISH ================= */
  useEffect(() => {
    if (!finished) return;

    // Telegram WebApp user (agar bo‘lsa)
    const tgUser = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user;

    submitTest({
      tests: test,
      answers,
      user: {
        username: tgUser?.username,
        firstName: tgUser?.first_name,
      },
    });
  }, [finished]);

  /* ================= RESULT ================= */
  if (finished) {
    const correctCount = answers.filter(
      (ans, i) => ans === test[i].correct,
    ).length;

    const skipped = answers.filter((a) => a === -1).length;

    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="w-full max-w-md p-8 text-center flex flex-col items-center bg-black">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <LineChart className="w-7 h-7 text-blue-600" />
            Test natijasi
          </h2>

          <div className="w-full space-y-2 text-lg">
            <p className="text-white">
              Jami testlar: <b>{test.length}</b>
            </p>
            <p className="text-green-600 font-semibold">
              To‘g‘ri: {correctCount}
            </p>
            <p className="text-red-600 font-semibold">
              Xato: {test.length - correctCount - skipped}
            </p>
            <p className="text-blue-600 font-semibold">
              Belgilanmadi: <b>{skipped}</b>
            </p>
          </div>

          <div className="mt-8 text-5xl font-extrabold text-blue-600">
            {Math.round((correctCount / test.length) * 100)}%
          </div>

          {isPending && (
            <p className="mt-4 text-sm text-slate-400">
              Natija serverga yuborilmoqda...
            </p>
          )}

          <button
            onClick={() => navigate("/")}
            className="mt-8 flex items-center gap-2 px-4 py-2 rounded-xl
              bg-linear-to-r from-blue-500 to-blue-600
              text-white font-semibold
              shadow-lg shadow-blue-500/30
              hover:from-blue-600 hover:to-blue-700
              active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Ortga
          </button>
        </div>
      </div>
    );
  }

  /* ================= TEST ================= */
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-lg bg-black text-white rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between text-sm text-slate-400 mb-4">
          <span>
            Test {current + 1} / {test.length}
          </span>
          <span className="text-yellow-400 font-semibold">⏱ {timeLeft}s</span>
        </div>

        <h3 className="text-xl font-semibold mb-6">
          {test[current].question}
        </h3>

        <div className="space-y-4">
          {test[current].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              className="w-full text-left px-4 py-3 rounded-xl
                bg-gray-900 text-white
                hover:bg-slate-800
                active:scale-95
                transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tests;
