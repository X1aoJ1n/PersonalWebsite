import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVisiblePost } from '@/api/post'; // Assuming this is the path to your API service
import type { SimplePostData, PageQuery } from '@/models';

interface ResponseListSimplePostVO {
  code: number;
  message: string;
  data: SimplePostData[];
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<SimplePostData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const pageQuery: PageQuery = {
          pageNum: 1,
          pageSize: 10, // Fetch 10 recent posts
        };
        const response: ResponseListSimplePostVO = await getVisiblePost(pageQuery);
        if (response.code === 200) {
          setPosts(response.data);
        } else {
          setError(response.message || 'Failed to fetch posts');
        }
      } catch (err) {
        setError('An error occurred while fetching posts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle navigation to Profile
  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Handle navigation to Login (if needed)
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Placeholder for Settings (not implemented)
  const handleSettingsClick = () => {
    // Add settings navigation or functionality if needed
    alert('Settings page not implemented yet.');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">MyApp</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSettingsClick}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Settings
              </button>
              <button
                onClick={handleLoginClick}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={handleProfileClick}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Posts</h2>
        {isLoading && (
          <div className="text-center text-gray-600">Loading posts...</div>
        )}
        {error && (
          <div className="mb-4 text-red-500 text-center">{error}</div>
        )}
        {posts.length === 0 && !isLoading && !error && (
          <div className="text-center text-gray-600">No posts available.</div>
        )}
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
              {post.preview && (
                <p className="mt-2 text-gray-600">{post.preview}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Posted by {post.userVO.username} on{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>❤️ {post.likeCount} Likes</span>
                  <span>💬 {post.commentCount} Comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;