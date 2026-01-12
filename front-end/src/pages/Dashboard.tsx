import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ClipboardList, FileText, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <GraduationCap className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">AI Career Advisor</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-1" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Career Journey!
          </h2>
          <p className="text-gray-600 text-lg">
            Discover the perfect career path tailored for you. Take our AI-powered career quiz
            to receive personalized recommendations including suitable degree programs and
            HEC-recognized universities in Pakistan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/quiz')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Start Career Quiz</h3>
            <p className="text-gray-600">
              Answer a series of questions about your interests, skills, and preferences to
              get AI-powered career recommendations.
            </p>
          </button>

          <button
            onClick={() => navigate('/recommendations')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">View Recommendations</h3>
            <p className="text-gray-600">
              Access your personalized career recommendations, degree programs, and university
              suggestions based on your quiz results.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
