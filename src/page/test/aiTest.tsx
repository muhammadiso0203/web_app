import { useEffect, useState } from "react";
import { ArrowLeft, LineChart } from "lucide-react";
import { useNavigate } from "react-router";
import { useTestGenerate } from "../service/testGenerate";
import { useCheckResult } from "../service/checkResult";
import Loading from "../../components/loading";

const TIME_PER_TEST = 30;

const AiTest = () => {
  const navigate = useNavigate();

  const [tests, setTests] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TEST);
  const [result, setResult] = useState<any>(null);

  const { mutate: generateTest, isPending, error: generateTestError } = useTestGenerate()
  const checkResult = useCheckResult();

  /* ======================
     AI TESTNI YUKLASH
  ====================== */
  useEffect(() => {
    const tgUser = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user;
    const telegramId = String(tgUser?.id || "");

    generateTest(telegramId, {
      onSuccess: (data) => {
        setTests(data);
      },
    });
  }, []);

  /* ======================
     TIMER
  ====================== */
  useEffect(() => {
    if (finished || tests.length === 0) return;

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
  }, [current, finished, tests]);

  const handleTimeOut = () => {
    const newAnswers = [...answers];
    newAnswers[current] = -1;
    setAnswers(newAnswers);

    if (current + 1 < tests.length) {
      setCurrent(current + 1);
      setTimeLeft(TIME_PER_TEST);
    } else {
      setFinished(true);
    }
  };

  const selectAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);

    if (current + 1 < tests.length) {
      setCurrent(current + 1);
      setTimeLeft(TIME_PER_TEST);
    } else {
      setFinished(true);
    }
  };

  /* ======================
     TEST TUGADI → AI NATIJA
  ====================== */
  useEffect(() => {
    if (finished && tests.length > 0) {
      checkResult.mutate(
        { tests, answers },
        {
          onSuccess: (data) => {
            setResult(data);
          },
        },
      );
    }
  }, [finished]);

  /* ======================
     LOADING STATES
  ====================== */
  if (isPending || tests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loading text="Ai test yuklanmoqda biroz sabr qiling... " />
      </div>
    );
  }

  if (generateTestError) {
    const errorMsg = (generateTestError as any)?.response?.data?.message || "Testni yuklab bo‘lmadi 😢";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <p className="text-red-500 text-lg font-semibold mb-4">{errorMsg}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 rounded-xl font-semibold active:scale-95 transition"
        >
          Ortga qaytish
        </button>
      </div>
    );
  }


  if (finished && !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loading text="Natija hisoblanmoqda biroz sabr qiling..." />
      </div>
    );
  }

  /* ======================
     NATIJA SAHIFASI
  ====================== */
  if (finished && result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="w-full max-w-md p-8 text-center flex flex-col items-center bg-black">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <LineChart className="w-7 h-7 text-blue-600" />
            AI Test Natijasi
          </h2>

          <div className="w-full space-y-2 text-lg">
            <p className="text-white">
              Jami testlar: <b>{result.total}</b>
            </p>
            <p className="text-green-600 font-semibold">
              To‘g‘ri: {result.correct}
            </p>
            <p className="text-red-600 font-semibold">
              Xato: {result.wrong}
            </p>
            <p className="text-blue-500 font-semibold">
              Daraja: <b>{result.level}</b>
            </p>
          </div>

          <p className="mt-4 text-slate-300 text-sm">
            {result.feedback}
          </p>

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

  /* ======================
     TEST SAHIFASI
  ====================== */
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-lg bg-black text-white rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between text-sm text-slate-400 mb-4">
          <span>
            Test {current + 1} / {tests.length}
          </span>
          <span className="text-yellow-400 font-semibold">
            ⏱ {timeLeft}s
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-6">
          {tests[current].question}
        </h3>

        <div className="space-y-4">
          {tests[current].options.map((opt: string, i: number) => (
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

export default AiTest;
