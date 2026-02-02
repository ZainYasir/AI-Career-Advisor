import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationAPI, Recommendation } from '../services/api';
import { GraduationCap, ArrowLeft, Award, BookOpen, Building2, Lightbulb } from 'lucide-react';

const RecommendationPage = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // Call GET /api/recommendations, backend handles ML & result.json
      const data = await recommendationAPI.getRecommendations();
      setRecommendation(data);
    } catch (err) {
      console.error('Recommendation API error:', err);
      setError(
        'Failed to load recommendations. Please make sure you have completed the quiz.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Career Recommendations</h1>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => navigate('/quiz')}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Your Career Recommendations</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Career Card */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-center mb-4">
            <Award className="w-12 h-12 mr-3" />
            <div>
              <h2 className="text-3xl font-bold">{recommendation.career}</h2>
              <p className="text-blue-100 mt-1">Your recommended career path</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mt-4">
            <p className="text-sm font-medium mb-1">Confidence Score</p>
            <div className="flex items-center">
              <div className="flex-1 bg-white bg-opacity-30 rounded-full h-3 mr-3">
                <div
                  className="bg-white h-3 rounded-full transition-all"
                  style={{ width: `${recommendation.confidence * 100}%` }}
                />
              </div>
              <span className="text-xl font-bold">{Math.round(recommendation.confidence * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-500 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">Why This Career?</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{recommendation.explanation}</p>
        </div>

        {/* Degree Programs */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">Recommended Degree Programs</h3>
          </div>
          <ul className="space-y-2">
            {recommendation.degree_programs.map((program, index) => (
              <li
                key={index}
                className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-800">{program}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Universities */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-4">
            <Building2 className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">HEC-Recognized Universities</h3>
          </div>
          <p className="text-gray-600 mb-4">
            These universities in Pakistan offer quality programs in your recommended field:
          </p>
          <ul className="space-y-2">
            {recommendation.universities.map((university, index) => (
              <li
                key={index}
                className="flex items-start p-3 bg-green-50 rounded-lg border border-green-100"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-800">{university}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Retake Quiz */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-center text-gray-600">
            Want to explore other career options?{' '}
            <button
              onClick={() => navigate('/quiz')}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Retake the quiz
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
