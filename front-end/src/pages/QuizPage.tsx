import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  quizAPI,
  QuizQuestion,
  QuizAnswer,
} from '../services/api';
import { GraduationCap, ArrowLeft, Send } from 'lucide-react';

const QuizPage = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await quizAPI.getQuestions();
      setQuestions(data);
    } catch {
      setError('Failed to load quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, careerTag: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: careerTag,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formattedAnswers: QuizAnswer[] = Object.entries(answers).map(
        ([questionId, answer]) => ({
          question_id: Number(questionId),
          answer,
        })
      );

      const result = await quizAPI.submitQuiz({ answers: formattedAnswers });
      // SAVE RESULT FOR NEXT PAGE
      localStorage.setItem("quiz_result", JSON.stringify(result));
      navigate('/recommendations');
    } catch {
      setError('Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold">
            Career Assessment Quiz
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id}>
                <h3 className="text-lg font-semibold mb-3">
                  {index + 1}. {question.question}
                </h3>

                <div className="space-y-2">
                  {question.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center border p-3 rounded cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.career_tag}
                        checked={
                          answers[question.id] === option.career_tag
                        }
                        onChange={(e) =>
                          handleAnswerChange(
                            question.id,
                            e.target.value
                          )
                        }
                        className="mr-3"
                      />
                      {option.text}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={
                submitting ||
                Object.keys(answers).length !== questions.length
              }
              className="w-full bg-blue-600 text-white py-3 rounded disabled:bg-gray-400 flex justify-center items-center"
            >
              {submitting ? 'Submitting...' : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Quiz
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
