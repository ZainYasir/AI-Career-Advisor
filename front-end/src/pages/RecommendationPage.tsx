import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { recommendationAPI, Recommendation } from '../services/api';
import {
  GraduationCap,
  ArrowLeft,
  Award,
  BookOpen,
  Building2,
  Lightbulb,
} from 'lucide-react';

const RecommendationPage = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'ur'>('en'); // language toggle
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendation();
  }, [language]); // refetch when language changes

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await recommendationAPI.getRecommendations(language);

      // Defensive checks
      if (!data || !data.career) throw new Error('Invalid recommendation response');

      setRecommendation({
        ...data,
        confidence: Math.min(Math.max(data.confidence ?? 0.5, 0), 1),
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400 || err.response?.status === 404) {
          setError('You need to complete the quiz before viewing recommendations.');
        } else if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else {
          setError('Unable to load recommendations. Please try again later.');
        }
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your recommendations…</p>
        </div>
      </div>
    );
  }

  /* ===================== ERROR ===================== */
  if (error || !recommendation) {
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
            <h1 className="text-2xl font-bold text-gray-800">
              Career Recommendations
            </h1>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-red-600 text-lg mb-6">{error}</p>
            <button
              onClick={() => navigate('/quiz')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== SUCCESS ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">
              Your Career Recommendation
            </h1>
          </div>

          {/* Language Toggle */}
          <div>
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 font-medium"
            >
              {language === 'en' ? 'اردو' : 'English'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Career Card */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white shadow-lg">
          <div className="flex items-center mb-4">
            <Award className="w-12 h-12 mr-3" />
            <h2 className="text-3xl font-bold">{recommendation.career}</h2>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm mb-2">Confidence Score</p>
            <div className="flex items-center">
              <div className="flex-1 bg-white bg-opacity-30 h-3 rounded-full mr-3">
                <div
                  className="bg-white h-3 rounded-full"
                  style={{ width: `${recommendation.confidence * 100}%` }}
                />
              </div>
              <span className="font-bold text-xl">
                {Math.round(recommendation.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-7 h-7 text-yellow-500 mr-3" />
            <h3 className="text-2xl font-bold">
              {language === 'en' ? 'Why this career?' : 'یہ کیریئر کیوں؟'}
            </h3>
          </div>
          <p className="text-gray-700">{recommendation.explanation}</p>
        </div>

        {/* Degrees */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <BookOpen className="w-7 h-7 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold">
              {language === 'en' ? 'Recommended Degrees' : 'تجویز کردہ ڈگریاں'}
            </h3>
          </div>
          <ul className="space-y-2">
            {recommendation.degree_programs.map((d, i) => (
              <li key={i} className="bg-blue-50 p-3 rounded-lg">
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Universities */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <Building2 className="w-7 h-7 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold">
              {language === 'en'
                ? 'HEC-Recognized Universities'
                : 'HEC سے تسلیم شدہ یونیورسٹیاں'}
            </h3>
          </div>
          <ul className="space-y-2">
            {recommendation.universities.map((u, i) => (
              <li key={i} className="bg-green-50 p-3 rounded-lg">
                {u}
              </li>
            ))}
          </ul>
        </div>

        {/* Retake */}
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <button
            onClick={() => navigate('/quiz')}
            className="text-blue-600 hover:underline font-medium"
          >
            {language === 'en' ? 'Retake the quiz' : 'کوئز دوبارہ دیں'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
