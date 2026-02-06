import { useEffect, useState } from "react";
import { ArrowLeft, Sparkles, Timer, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useTestGenerate } from "../service/testGenerate";
import { useCheckResult } from "../service/checkResult";
import { useAiFeedback } from "../service/aiFeedback";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const tgUser = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user;
    const telegramId = String(tgUser?.id || "");

    generateTest(telegramId, {
      onSuccess: (data) => {
        setTests(data);
      },
      onError: () => {
        setTests([]);
      },
    });
  }, []);

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

  if (generateTestError || checkResultError) {
    const error = (generateTestError || checkResultError) as any;
    const rawMessage = error?.response?.data?.message || error?.message || "";
    let friendlyMessage = "Unexpected error occurred 😢";

    if (rawMessage.includes("Foydalanuvchi topilmadi")) {
      friendlyMessage = "User not found. Please restart the bot.";
    } else if (rawMessage.includes("Sizning bepul urinishlaringiz tugadi")) {
      friendlyMessage = "Free attempts reached. Upgrade to PRO to continue.";
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-8 max-w-sm flex flex-col items-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-xl font-bold mb-6">{friendlyMessage}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-blue-600 rounded-2xl font-bold active:scale-95 transition shadow-lg shadow-blue-600/20"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
        />
        <p className="text-gray-400 font-medium animate-pulse">AI is crafting your test...</p>
      </div>
    );
  }

  if (finished && (isChecking || !result)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6"
        >
          <Sparkles className="w-10 h-10 text-blue-500" />
        </motion.div>
        <p className="text-gray-400 font-medium">Analyzing your performance...</p>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="min-h-screen bg-background p-6 pb-24 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold">Results Ready!</h2>
            <p className="text-gray-400 mt-2">Here's how you performed</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-5 text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Score</p>
              <p className="text-3xl font-bold text-blue-400">{result.correct}/{result.total}</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Band</p>
              <p className="text-3xl font-bold text-purple-400">{result.level}</p>
            </div>
          </div>

          <div className="glass-card p-6 mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              AI Feedback
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {result.feedback}
            </p>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Deep Analysis</h4>
              {isGettingFeedback ? (
                <div className="flex items-center gap-2 py-4">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Generating detailed breakdown...</span>
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {detailedFeedback?.feedback || "Detailed analysis not available."}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white p-6 pb-32">
      {/* Progress Header */}
      <div className="max-w-lg mx-auto mb-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500"><ArrowLeft /></button>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
            <Timer className={`w-4 h-4 ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-blue-400"}`} />
            <span className={`text-sm font-bold font-mono ${timeLeft < 10 ? "text-red-500" : "text-white"}`}>{timeLeft}s</span>
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {current + 1} / {tests.length}
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / tests.length) * 100}%` }}
            className="h-full bg-blue-500"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-lg mx-auto"
        >
          <div className="glass-card p-8 mb-8">
            <h3 className="text-2xl font-bold leading-tight">
              {tests[current]?.question}
            </h3>
          </div>

          <div className="space-y-4">
            {tests[current]?.options.map((opt: string, i: number) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectAnswer(i)}
                className="w-full text-left p-5 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-medium text-lg flex items-center justify-between group"
              >
                <span>{opt}</span>
                <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-blue-500 transition-colors" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AiTest;
