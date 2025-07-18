import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState({});
  const [projectFilter, setProjectFilter] = useState('All');
  const [projectCategories, setProjectCategories] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, blogRes, testimonialsRes, settingsRes, categoriesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/projects`),
        fetch(`${BACKEND_URL}/api/blog`),
        fetch(`${BACKEND_URL}/api/testimonials`),
        fetch(`${BACKEND_URL}/api/settings`),
        fetch(`${BACKEND_URL}/api/projects/categories`)
      ]);

      const projectsData = await projectsRes.json();
      const blogData = await blogRes.json();
      const testimonialsData = await testimonialsRes.json();
      const settingsData = await settingsRes.json();
      const categoriesData = await categoriesRes.json();

      setProjects(projectsData);
      setBlogPosts(blogData);
      setTestimonials(testimonialsData);
      setSettings(settingsData);
      setProjectCategories(['All', ...categoriesData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredProjects = projectFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === projectFilter);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const Navigation = () => (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="text-2xl font-bold text-white"
            whileHover={{ scale: 1.05 }}
          >
            {settings.name || 'Rabiul Hasan'}
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {['home', 'about', 'portfolio', 'blog', 'skills', 'contact'].map((section) => (
              <motion.button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeSection === section 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
            <motion.button
              onClick={() => window.open(settings.cv_url, '_blank')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download CV
            </motion.button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2"
            >
              {['home', 'about', 'portfolio', 'blog', 'skills', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(section);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeSection === section ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );

  const HeroSection = () => (
    <motion.section 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          className="text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {settings.name || 'Rabiul Hasan'}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {settings.title || 'Architectural Visualizer | AI Enthusiast'}
          </motion.p>
          <motion.p 
            className="text-gray-400 mb-8 max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Welcome to my creative space where architecture meets artistry and innovation.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.button
              onClick={() => setActiveSection('contact')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.button>
            <motion.button
              onClick={() => setActiveSection('portfolio')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors text-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work ↓
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.div 
            className="w-80 h-80 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={settings.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );

  const AboutSection = () => (
    <motion.section 
      className="py-20 bg-gray-800"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">About Me</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {settings.bio || 'Creative and detail-oriented Architectural Visualizer with a passion for creating stunning visual experiences.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-gray-900 p-8 rounded-xl border border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-blue-500 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-blue-400">Narsingdi Polytechnic Institute</h4>
                <p className="text-gray-300">Diploma in Civil Engineering</p>
                <p className="text-gray-500">2016 - 2020</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-400">Dargpara Model High School</h4>
                <p className="text-gray-300">Secondary School Certificate</p>
                <p className="text-gray-500">2015</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-900 p-8 rounded-xl border border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-green-500 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Certification</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-green-400">Architectural with Civil CAD</h4>
                <p className="text-gray-300">Certificate in CAD Design</p>
                <p className="text-gray-500">IsDB-BISEW IT Scholarship</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-900 p-8 rounded-xl border border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-purple-500 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Experience</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-purple-400">Junior Instructor - Civil Department</h4>
                <p className="text-gray-300">Technical Institute</p>
                <p className="text-gray-500">2020 - Present</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-400">Support Trainer</h4>
                <p className="text-gray-300">3D Visualization</p>
                <p className="text-gray-500">2019 - 2020</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  const SkillsSection = () => (
    <motion.section 
      className="py-20 bg-gray-900"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">My Skills</h2>
          <p className="text-xl text-gray-300">A blend of technical expertise and soft skills to bring visions to life.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gray-800 p-8 rounded-xl border border-gray-700"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-blue-500 mr-3">⚡</span>
              Software Proficiency
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {['Revit', 'AutoCAD', '3ds Max', 'Photoshop', 'MS Project', 'Corona', 'V-ray', 'Escape'].map((skill) => (
                <motion.div 
                  key={skill}
                  className="bg-gray-700 px-4 py-2 rounded-lg text-gray-300 text-center hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-gray-800 p-8 rounded-xl border border-gray-700"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="text-green-500 mr-3">🎯</span>
              Personal Skills
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {['Leadership', 'Time Management', 'Management Skills', 'Teamwork', 'Problem Solving'].map((skill) => (
                <motion.div 
                  key={skill}
                  className="bg-gray-700 px-4 py-2 rounded-lg text-gray-300 text-center hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  const PortfolioSection = () => (
    <motion.section 
      className="py-20 bg-gray-800"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">My Portfolio</h2>
          <p className="text-xl text-gray-300 mb-8">A selection of my work in architectural visualization, 3D modeling, and AI-driven design.</p>
        </motion.div>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {projectCategories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setProjectFilter(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                projectFilter === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer portfolio-item"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.software_used.map((software) => (
                    <span 
                      key={software}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
                    >
                      {software}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  const BlogSection = () => (
    <motion.section 
      className="py-20 bg-gray-900"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Latest from the Blog</h2>
          <p className="text-xl text-gray-300">Thoughts, tutorials, and insights on architectural visualization and AI.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedBlogPost(post)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {post.read_time} min read
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );

  const TestimonialsSection = () => (
    <motion.section 
      className="py-20 bg-gray-800"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What Clients Say</h2>
          <p className="text-xl text-gray-300">Testimonials from satisfied clients and collaborators.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-gray-900 p-6 rounded-xl border border-gray-700"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image_url} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
              <div className="flex text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  const ContactSection = () => (
    <motion.section 
      className="py-20 bg-gray-900"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-300">Have a project in mind? Let's work together to bring it to life.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <div>
                  <p className="text-gray-300">Email</p>
                  <p className="text-white">{settings.email || 'contact@example.com'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <div>
                  <p className="text-gray-300">Phone</p>
                  <p className="text-white">{settings.phone || '+880 1234 567890'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-gray-300">Location</p>
                  <p className="text-white">{settings.location || 'Dhaka, Bangladesh'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-white mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {Object.entries(settings.social_links || {}).map(([platform, url]) => (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message ✈'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );

  const ProjectModal = ({ project, onClose }) => (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">{project.title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="aspect-video mb-6">
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <p className="text-gray-300 mb-6">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.software_used.map((software) => (
                  <span 
                    key={software}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {software}
                  </span>
                ))}
              </div>
              
              {project.gallery_images && project.gallery_images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {project.gallery_images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${project.title} ${index + 1}`}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const BlogModal = ({ post, onClose }) => (
    <AnimatePresence>
      {post && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{post.title}</h2>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {post.category}
                    </span>
                    <span>{post.read_time} min read</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="aspect-video mb-6">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{post.content}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HeroSection />;
      case 'about':
        return <AboutSection />;
      case 'portfolio':
        return <PortfolioSection />;
      case 'blog':
        return <BlogSection />;
      case 'skills':
        return <SkillsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      
      <main className="pt-20">
        {renderSection()}
        {activeSection === 'home' && (
          <>
            <AboutSection />
            <SkillsSection />
            <PortfolioSection />
            <TestimonialsSection />
            <BlogSection />
            <ContactSection />
          </>
        )}
      </main>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <BlogModal post={selectedBlogPost} onClose={() => setSelectedBlogPost(null)} />
      
      <motion.button
        onClick={() => setShowAdmin(!showAdmin)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ⚙️
      </motion.button>
      
      {showAdmin && (
        <div className="fixed bottom-16 right-4 bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-700">
          <p className="text-white text-sm">Admin Panel Coming Soon!</p>
        </div>
      )}
    </div>
  );
}

export default App;