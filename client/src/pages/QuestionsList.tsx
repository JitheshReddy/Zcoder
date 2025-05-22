import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Question = {
  _id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter states
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterTopic, setFilterTopic] = useState<string>('All');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/v1/questions');
        const data = await res.json();
        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleClick = (questionId: string) => {
    navigate(`/questions/${questionId}`);
  };

  // Extract unique topics from questions for filter dropdown
  const topics = Array.from(new Set(questions.map((q) => q.topic)));

  // Filter questions by difficulty and topic
  const filteredQuestions = questions.filter((q) => {
    const difficultyMatch = filterDifficulty === 'All' || q.difficulty === filterDifficulty;
    const topicMatch = filterTopic === 'All' || q.topic === filterTopic;
    return difficultyMatch && topicMatch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Coding Questions</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="border rounded px-3 py-2"
          aria-label="Filter by difficulty"
        >
          <option value="All">Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className="border rounded px-3 py-2"
          aria-label="Filter by topic"
        >
          <option value="All">Topic</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading questions...</p>
      ) : filteredQuestions.length === 0 ? (
        <p>No questions match the selected filters.</p>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isBookmarked = bookmarks.includes(q._id);
            return (
              <div
                key={q._id}
                className="border p-4 rounded shadow hover:bg-gray-50 transition cursor-pointer"
                onClick={() => handleClick(q._id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{q.title}</h2>
                    <p className="text-gray-600 mt-1">Topic: {q.topic}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm px-2 py-1 rounded font-medium bg-${
                        q.difficulty === 'Easy'
                          ? 'green'
                          : q.difficulty === 'Medium'
                          ? 'yellow'
                          : 'red'
                      }-100 text-${
                        q.difficulty === 'Easy'
                          ? 'green'
                          : q.difficulty === 'Medium'
                          ? 'yellow'
                          : 'red'
                      }-800`}
                    >
                      {q.difficulty}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation on star click
                        toggleBookmark(q._id);
                      }}
                      className="text-3xl leading-none focus:outline-none"
                      title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                      style={{
                        color: isBookmarked ? 'gold' : 'black',
                        cursor: 'pointer',
                      }}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
