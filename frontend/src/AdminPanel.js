import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AdminPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState({});
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, projectsRes, blogRes, testimonialsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/settings`),
        fetch(`${BACKEND_URL}/api/projects`),
        fetch(`${BACKEND_URL}/api/blog`),
        fetch(`${BACKEND_URL}/api/testimonials`)
      ]);

      const settingsData = await settingsRes.json();
      const projectsData = await projectsRes.json();
      const blogData = await blogRes.json();
      const testimonialsData = await testimonialsRes.json();

      setSettings(settingsData);
      setProjects(projectsData);
      setBlogPosts(blogData);
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        setMessage('Settings updated successfully!');
        setSettings(updatedSettings);
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/${type}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(`${type} deleted successfully!`);
        setTimeout(() => setMessage(''), 3000);
        fetchData(); // Refresh data
      } else {
        throw new Error(`Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      setMessage(`Error deleting ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const SettingsForm = () => {
    const [formData, setFormData] = useState(settings);

    const handleSubmit = (e) => {
      e.preventDefault();
      updateSettings(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-2">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Title</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Bio</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Profile Image URL</label>
          <input
            type="url"
            value={formData.profile_image || ''}
            onChange={(e) => setFormData({...formData, profile_image: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">Location</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-white mb-2">CV Download URL</label>
          <input
            type="url"
            value={formData.cv_url || ''}
            onChange={(e) => setFormData({...formData, cv_url: e.target.value})}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Updating...' : 'Update Settings'}
        </motion.button>
      </form>
    );
  };

  const ProjectsList = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Portfolio Projects ({projects.length})</h3>
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-white font-semibold">{project.title}</h4>
              <p className="text-gray-400 text-sm">{project.category}</p>
              <p className="text-gray-300 text-sm mt-1">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.software_used.map((software, index) => (
                  <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    {software}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => deleteItem('projects', project.id)}
              className="text-red-400 hover:text-red-300 ml-4"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const BlogPostsList = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Blog Posts ({blogPosts.length})</h3>
      {blogPosts.map((post) => (
        <div key={post.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-white font-semibold">{post.title}</h4>
              <p className="text-gray-400 text-sm">{post.category} • {post.read_time} min read</p>
              <p className="text-gray-300 text-sm mt-1">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => deleteItem('blog', post.id)}
              className="text-red-400 hover:text-red-300 ml-4"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const TestimonialsList = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Testimonials ({testimonials.length})</h3>
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="text-white font-semibold">{testimonial.name}</h4>
              <p className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</p>
              <p className="text-gray-300 text-sm mt-1">"{testimonial.content}"</p>
              <div className="flex text-yellow-400 mt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
            <button
              onClick={() => deleteItem('testimonials', testimonial.id)}
              className="text-red-400 hover:text-red-300 ml-4"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsForm />;
      case 'projects':
        return <ProjectsList />;
      case 'blog':
        return <BlogPostsList />;
      case 'testimonials':
        return <TestimonialsList />;
      default:
        return <SettingsForm />;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {message && (
          <div className="mx-6 mt-4 p-3 bg-green-600 text-white rounded-lg">
            {message}
          </div>
        )}

        <div className="flex">
          <div className="w-1/4 bg-gray-800 p-4">
            <nav className="space-y-2">
              {[
                { id: 'settings', label: 'Settings', icon: '⚙️' },
                { id: 'projects', label: 'Projects', icon: '🏗️' },
                { id: 'blog', label: 'Blog Posts', icon: '📝' },
                { id: 'testimonials', label: 'Testimonials', icon: '💬' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;