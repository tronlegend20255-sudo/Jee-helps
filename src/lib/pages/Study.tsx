import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { generateStudyMaterial } from '../gemini';
import { syllabus, subjects } from '../syllabus';
import { Loader2, PlayCircle, BookOpen, Layers } from 'lucide-react';

export default function Study() {
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const chapters = subject ? Object.keys(syllabus[subject]) : [];
  const topics = subject && chapter ? syllabus[subject][chapter] : [];

  const handleGenerate = async () => {
    if (!subject || !chapter || !topic) {
      setError("Please select subject, chapter, and topic.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await generateStudyMaterial(subject, chapter, topic);
      setResult(data);
    } catch (err) {
      setError("Failed to generate content. Please ensure your Gemini API key is configured.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Learn with AI</h1>
        <p className="text-gray-600 text-lg">
          Select a topic to get the best YouTube video, AI-curated short notes, and interactive flashcards.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 mb-10 border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
          <select 
            value={subject} 
            onChange={(e) => { setSubject(e.target.value); setChapter(""); setTopic(""); }}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none"
          >
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Chapter</label>
          <select 
            value={chapter} 
            onChange={(e) => { setChapter(e.target.value); setTopic(""); }}
            disabled={!subject}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none disabled:opacity-50"
          >
            <option value="">Select Chapter</option>
            {chapters.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Topic</label>
          <select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            disabled={!chapter}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none disabled:opacity-50"
          >
            <option value="">Select Topic</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Generate Lesson'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-8 border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Video Recommendation */}
          {result.videoRecommendation && (
            <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-8 border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <PlayCircle className="text-red-500" />
                Recommended Video
              </h2>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{result.videoRecommendation.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{result.videoRecommendation.channel}</p>
                </div>
                {result.videoRecommendation.url ? (
                  <a 
                    href={result.videoRecommendation.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Watch on YouTube
                  </a>
                ) : (
                  <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(result.videoRecommendation.searchQueryPlaceholder || `${subject} ${chapter} ${topic} JEE`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Search YouTube
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notes Section */}
            {(result.notes) && (
              <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-8 border border-gray-100 h-full">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="text-indigo-500" />
                  Short Notes
                </h2>
                <div className="prose prose-indigo prose-sm max-w-none text-gray-700">
                  <Markdown>{result.notes}</Markdown>
                </div>
              </div>
            )}

            {/* Flashcards Section */}
            {(result.flashcards && result.flashcards.length > 0) && (
              <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-8 border border-gray-100 flex flex-col h-full">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Layers className="text-amber-500" />
                  Flashcards
                </h2>
                <div className="space-y-4 flex-1">
                  {result.flashcards.map((card: any, idx: number) => (
                    <Flashcard key={idx} front={card.front} back={card.back} index={idx} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Flashcard({ front, back, index }: { front: string, back: string, index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="group perspective-1000 relative w-full border border-gray-200 rounded-xl cursor-pointer bg-gray-50 min-h-[120px]"
      onClick={() => setFlipped(!flipped)}
    >
      <div 
        className={`w-full h-full min-h-[120px] transition-all duration-500 transform-style-3d p-6 flex items-center justify-center text-center ${flipped ? '[transform:rotateX(180deg)]' : ''}`}
      >
        {!flipped ? (
          <div className="backface-hidden w-full text-lg font-medium text-gray-800">
           <span className="absolute top-3 left-3 text-xs font-bold text-gray-400">Q{index + 1}</span>
           {front}
          </div>
        ) : (
          <div className="backface-hidden w-full text-base text-indigo-800 font-medium [transform:rotateX(180deg)]">
            <span className="absolute top-3 left-3 text-xs font-bold text-indigo-400">Answer</span>
            {back}
          </div>
        )}
      </div>
    </div>
  );
}
