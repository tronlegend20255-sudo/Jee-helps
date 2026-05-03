import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { generateMockTest } from '../gemini';
import { Loader2, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function MockTest() {
  const [examType, setExamType] = useState<"Mains" | "Advanced">("Mains");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [testActive, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour for mini mock

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (testActive && !testFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testActive && !testFinished) {
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [testActive, testFinished, timeLeft]);

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await generateMockTest(examType);
      if (data && data.length > 0) {
        setQuestions(data);
        setTestActive(true);
        setTestFinished(false);
        setUserAnswers({});
        setCurrentQIdx(0);
        setTimeLeft(3600);
      } else {
        setError("Failed to generate test. Please try again.");
      }
    } catch (err) {
      setError("Error generating mock test. Please check API configuration.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTest = () => {
    setTestFinished(true);
    setTestActive(false);
  };

  const handleOptionSelect = (opt: string) => {
    const q = questions[currentQIdx];
    const isMultiCorrect = q.questionType.toLowerCase().includes("multi");
    
    setUserAnswers(prev => {
      if (isMultiCorrect) {
        const current = Array.isArray(prev[currentQIdx]) ? prev[currentQIdx] as string[] : [];
        if (current.includes(opt)) {
          return { ...prev, [currentQIdx]: current.filter(o => o !== opt) };
        } else {
          return { ...prev, [currentQIdx]: [...current, opt] };
        }
      } else {
        return { ...prev, [currentQIdx]: opt };
      }
    });
  };

  const handleNumericalInput = (val: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQIdx]: val }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!testActive && !testFinished) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">AI Mock Tests</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience real-time AI-generated mock tests simulating JEE Mains and Advanced.
            Tests are bound by a timer to ensure rigorous practice.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 max-w-md mx-auto text-center">
          <h2 className="text-xl font-semibold mb-6">Select Exam Type</h2>
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={() => setExamType("Mains")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                examType === "Mains" ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              JEE Mains
            </button>
            <button
              onClick={() => setExamType("Advanced")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                examType === "Advanced" ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              JEE Advanced
            </button>
          </div>
          
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
          >
            {loading ? <><Loader2 className="animate-spin" size={24} /> Generating Test...</> : 'Start Assessment'}
          </button>
          
          {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
        </div>
      </div>
    );
  }

  // Find subject-wise distribution for nav
  const subjects = [...new Set(questions.map(q => q.subject))];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6">
      {/* Left side: Questions Nav */}
      <div className="w-full md:w-64 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm p-4 h-full overflow-y-auto">
        <div className="text-center mb-6 border-b pb-4">
          <h3 className="font-bold text-gray-800">Time Remaining</h3>
          <div className={`text-2xl font-mono mt-2 flex items-center justify-center gap-2 ${timeLeft < 300 ? 'text-red-600' : 'text-indigo-600'}`}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex-1">
          {subjects.map(subj => (
            <div key={subj} className="mb-6">
              <h4 className="font-semibold text-gray-600 mb-3 text-sm uppercase tracking-wider">{subj}</h4>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, i) => {
                  if (q.subject !== subj) return null;
                  const isAnswered = userAnswers[i] !== undefined && (Array.isArray(userAnswers[i]) ? (userAnswers[i] as string[]).length > 0 : userAnswers[i] !== "");
                  
                  let btnColor = "bg-gray-100 text-gray-600 hover:bg-gray-200";
                  if (currentQIdx === i) btnColor = "bg-indigo-600 text-white";
                  else if (isAnswered) btnColor = "bg-emerald-100 text-emerald-700 font-semibold";

                  return (
                    <button
                      key={i}
                      onClick={() => !testFinished && setCurrentQIdx(i)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-colors ${btnColor}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!testFinished && (
          <button
            onClick={handleSubmitTest}
            className="mt-4 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
          >
            Submit Test
          </button>
        )}
      </div>

      {/* Right side: Question View */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
        {testFinished && (
          <div className="bg-indigo-50 border-b border-indigo-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-indigo-900">Test Submitted</h2>
              <p className="text-indigo-700 opacity-80">Review your answers and solutions below.</p>
            </div>
            <button
              onClick={() => { setTestActive(false); setTestFinished(false); }}
              className="px-6 py-2.5 bg-white border border-indigo-200 text-indigo-700 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-md">
              Question {currentQIdx + 1}
            </span>
            <span className="text-gray-500 font-medium text-sm">
              {questions[currentQIdx]?.subject} • {questions[currentQIdx]?.questionType}
            </span>
          </div>

          <div className="prose prose-indigo max-w-none text-gray-800 text-lg mb-10">
            <Markdown>{questions[currentQIdx]?.questionText}</Markdown>
          </div>

          {!testFinished ? (
            <div className="space-y-4 max-w-2xl">
              {questions[currentQIdx]?.options && questions[currentQIdx].options.length > 0 ? (
                questions[currentQIdx].options.map((opt: string, i: number) => {
                  const isMulti = questions[currentQIdx].questionType.toLowerCase().includes("multi");
                  const isSelected = isMulti 
                    ? (Array.isArray(userAnswers[currentQIdx]) && (userAnswers[currentQIdx] as string[]).includes(opt))
                    : userAnswers[currentQIdx] === opt;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(opt)}
                      className={`w-full text-left p-5 rounded-xl border flex gap-4 transition-all ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-sm font-bold mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-gray-700"><Markdown>{opt}</Markdown></span>
                    </button>
                  );
                })
              ) : (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numerical Answer:</label>
                  <input 
                    type="text" 
                    value={(userAnswers[currentQIdx] as string) || ""}
                    onChange={(e) => handleNumericalInput(e.target.value)}
                    className="w-full max-w-md bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter value..."
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="p-6 rounded-xl border bg-gray-50">
                <h4 className="font-bold text-gray-700 mb-4">Your Answer vs Correct Answer</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border rounded-lg">
                    <span className="block text-xs uppercase text-gray-500 font-bold mb-1">Your Answer</span>
                    <span className="font-medium text-gray-800">
                      {userAnswers[currentQIdx] 
                        ? (Array.isArray(userAnswers[currentQIdx]) ? (userAnswers[currentQIdx] as string[]).join(", ") : userAnswers[currentQIdx] as string)
                        : <span className="text-gray-400 italic">Not attempted</span>}
                    </span>
                  </div>
                  <div className="p-4 bg-white border rounded-lg border-emerald-200">
                    <span className="block text-xs uppercase text-emerald-600 font-bold mb-1">Correct Answer</span>
                    <span className="font-medium text-emerald-800">
                      <Markdown>{questions[currentQIdx]?.correctAnswer}</Markdown>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                  <AlertCircle size={18} />
                  Detailed Solution
                </h4>
                <div className="prose prose-sm prose-blue max-w-none text-blue-900">
                  <Markdown>{questions[currentQIdx]?.solution}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => setCurrentQIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQIdx === 0}
            className="px-6 py-2.5 font-medium text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          
          <button
            onClick={() => setCurrentQIdx(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQIdx === questions.length - 1}
            className="px-6 py-2.5 font-medium text-white bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-900"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
}
