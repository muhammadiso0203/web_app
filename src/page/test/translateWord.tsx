import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, Languages, CheckCircle2, XCircle, Timer } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslateGenerate } from "../service/translateGenerate";
import { useCheckResult } from "../service/checkResult";
import { useAiFeedback } from "../service/aiFeedback";
import Loading from "../../components/loading";

const TIME_PER_TEST = 20; // Translation tests are usually shorter

const TranslateWord = () => {
  const navigate = useNavigate();

  const [tests, setTests] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TEST);
  const [result, setResult] = useState<any>(null);

  const {
    mutate: generateTranslate,
    isPending,
    error: generateError,
  } = useTranslateGenerate();

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

    generateTranslate(telegramId, {
      onSuccess: (data) => {
        setTests(data);
      },
      onError: () => {
        setTests([]);
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
  const error = generateError || checkResultError;

  if (error) {
    const rawMessage = (error as any)?.response?.data?.message || (error as any)?.message || "";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl backdrop-blur-xl">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-200 text-lg font-medium mb-6">
            {rawMessage.includes("urinishlaringiz tugadi")
              ? "Sizning bepul urinishlaringiz tugadi. Davom etish uchun PRO obunani sotib oling."
              : "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-white text-black rounded-2xl font-bold active:scale-95 transition-transform"
          >
            Bosh sahifaga
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loading text="AI so'zlarni tayyorlamoqda..." />
      </div>
    );
  }

  /* ======================
     ⏳ NATIJA HISOBLANMOQDA
  ====================== */
  if (finished && (isChecking || !result)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loading text="Natijangiz tahlil qilinmoqda..." />
      </div>
    );
  }

  /* ======================
     📊 NATIJA SAHIFASI
  ====================== */
  if (finished && result) {
    return (
      <div className="min-h-screen w-full bg-slate-950 p-6 flex items-center justify-center font-sans">
        <div className="w-full  animate-in fade-in zoom-in duration-500">
          {/* Header Card */}
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />

            <Languages className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Tarjima Natijasi</h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                {result.level} LEVEL
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2 mx-auto" />
                <span className="block text-2xl font-bold text-white">{result.correct}</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tight">To'g'ri</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <XCircle className="w-5 h-5 text-rose-400 mb-2 mx-auto" />
                <span className="block text-2xl font-bold text-white">{result.wrong}</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tight">Xato</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-8 italic">
              "{result.feedback}"
            </p>

            {/* AI Feedback Section */}
            <div className="text-left mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-slate-300">AI Detailed Analysis</span>
              </div>
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5 min-h-[100px] flex items-center">
                {isGettingFeedback ? (
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    AI tahlil qilmoqda...
                  </div>
                ) : (
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {detailedFeedback?.feedback || "Feedback yuklanmadi."}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold
                         shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Bosh menyuga qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ======================
     📝 TEST SAHIFASI
  ====================== */
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center p-6 font-sans">
      <div className="w-full mt-8">

        {/* Progress Display */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-blue-500 font-black text-4xl leading-none">
              {String(current + 1).padStart(2, '0')}
            </span>
            <span className="text-slate-700 font-bold text-xl ml-1">
              / {String(tests.length).padStart(2, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 5 ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
              <Timer className="w-5 h-5" />
              00:{String(timeLeft).padStart(2, '0')}
            </div>
            <div className="w-32 h-1 bg-slate-900 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / TIME_PER_TEST) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl mb-8 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />

          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 block">
            Translate this word
          </span>
          <h2 className="text-4xl font-black text-white leading-tight mb-2 break-words">
            {tests[current]?.question}
          </h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4">
          {tests[current]?.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              className="group relative w-full text-left p-6 rounded-3xl bg-slate-900/60 border border-white/5 
                         hover:bg-slate-800 transition-all active:scale-[0.98] overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center 
                              font-bold text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">
                  {opt}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-transparent transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslateWord;
