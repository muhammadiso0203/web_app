import { useEffect, useState } from "react";
import { ArrowLeft, LineChart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { useTestGenerate } from "../service/testGenerate";
import { useCheckResult } from "../service/checkResult";
import { useAiFeedback } from "../service/aiFeedback";
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

  const {
    mutate: generateTest,
    isPending,
    error: generateTestError,
  } = useTestGenerate();

  const {
    mutate: checkResultMutate,
    isPending: isChecking,
    error: checkResultError,
  } = useCheckResult();

  const {
    mutate: getDetailedFeedback,
    data: detailedFeedback,
    isPending: isGettingFeedback,
  } = useAiFeedback();

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
      onError: () => {
        setTests([]); // ❗ loading osilib qolmasligi uchun
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
     TEST TUGADI → NATIJA
  ====================== */
  useEffect(() => {
    if (finished && tests.length > 0) {
      checkResultMutate(
        { tests, answers },
        {
          onSuccess: (data) => {
            setResult(data);

            // Fetch detailed feedback
            const tgUser = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user;
            const telegramId = String(tgUser?.id || "");

            getDetailedFeedback({
              telegramId,
              questions: tests,
              userAnswers: answers,
            });
          },
        },
      );
    }
  }, [finished]);

  /* ======================
     ❌ ERROR HANDLING
  ====================== */
  const error = generateTestError || checkResultError;

  if (error) {
    const rawMessage = (error as any)?.response?.data?.message || (error as any)?.message || "";
    let friendlyMessage = "Kutilmagan xatolik yuz berdi 😢";

    if (rawMessage.includes("Foydalanuvchi topilmadi")) {
      friendlyMessage = "Foydalanuvchi topilmadi. Iltimos, botni qaytadan ishga tushiring.";
    } else if (rawMessage.includes("Sizning bepul urinishlaringiz tugadi")) {
      friendlyMessage = "Sizning bepul urinishlaringiz tugadi. Davom etish uchun PRO obunani sotib oling.";
    } else if (rawMessage.includes("AI test generation failed")) {
      friendlyMessage = "AI test tayyorlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.";
    } else if (rawMessage.includes("AI result checking failed")) {
      friendlyMessage = "Natijani hisoblashda xatolik yuz berdi. Iltimos, birozdan so'ng qaytadan urinib ko'ring.";
    } else if (rawMessage.toLowerCase().includes("network error")) {
      friendlyMessage = "Internet bilan bog'liq muammo yuz berdi. Iltimos, aloqani tekshiring.";
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-sm">
          <p className="text-red-500 text-lg font-semibold mb-4">
            {friendlyMessage}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 rounded-xl font-semibold active:scale-95 transition"
          >
            Ortga qaytish
          </button>
        </div>
      </div>
    );
  }

  /* ======================
     ⏳ LOADING
  ====================== */
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loading text="AI test yuklanmoqda, biroz sabr qiling..." />
      </div>
    );
  }

  /* ======================
     ⏳ NATIJA HISOBLANMOQDA
  ====================== */
  if (finished && (isChecking || !result)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loading text="Natija hisoblanmoqda..." />
      </div>
    );
  }

  /* ======================
     📊 NATIJA SAHIFASI
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

          <div className="mt-6 w-full text-left">
            <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              Detailed Analysis
            </h3>
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {isGettingFeedback ? (
                <div className="flex items-center gap-2 text-slate-500 italic">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  AI tahlil qilmoqda...
                </div>
              ) : (
                detailedFeedback?.feedback || "Feedback yuklanmadi."
              )}
            </div>
          </div>

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
     📝 TEST SAHIFASI
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
          {tests[current]?.question}
        </h3>

        <div className="space-y-4">
          {tests[current]?.options.map((opt: string, i: number) => (
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
