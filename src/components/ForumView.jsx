import React, { useState } from 'react';
import { MessageSquare, Search, Plus, X, MessageCircle, Send } from 'lucide-react';

const ForumView = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('forum');
  
  // Chat state
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the community chat!', sender: 'system', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, text: 'Hello everyone!', sender: 'user1', username: 'Alex', timestamp: new Date(Date.now() - 1800000) },
    { id: 3, text: 'Hi Alex! How can we help you today?', sender: 'admin', username: 'Support', timestamp: new Date() },
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'currentUser',
      username: 'You',
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Auto-reply after 1 second (simulating another user)
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        text: `Thanks for your message! This is an automated reply.`,
        sender: 'system',
        username: 'System',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };
  const [forums, setForums] = useState([
    {
      id: 1,
      title: 'General Discussion',
      description: 'Discuss anything related to our community',
      threads: 24,
      lastPost: '2 hours ago',
      icon: '💬',
    },
    {
      id: 2,
      title: 'Project Showcase',
      description: 'Share and discuss your projects',
      threads: 15,
      lastPost: '5 hours ago',
      icon: '🚀',
    },
    {
      id: 3,
      title: 'Q&A',
      description: 'Ask questions and get answers from the community',
      threads: 42,
      lastPost: '1 day ago',
      icon: '❓',
    },
  ]);

  const [threads, setThreads] = useState([
    {
      id: 1,
      title: 'Welcome to our new forum!',
      author: 'Admin',
      date: '2 hours ago',
      replies: 5,
      views: 42,
      lastReply: '30 minutes ago',
      isPinned: true,
    },
    {
      id: 2,
      title: 'How to get started with our platform?',
      author: 'NewUser',
      date: '5 hours ago',
      replies: 3,
      views: 28,
      lastReply: '1 hour ago',
      isPinned: false,
    },
  ]);

  const [selectedForum, setSelectedForum] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewForumModal, setShowNewForumModal] = useState(false);
  const [newForum, setNewForum] = useState({
    title: '',
    description: '',
    icon: '💬'
  });

  const handleForumSelect = (forum) => {
    setSelectedForum(forum);
  };

  const handleBackToForums = () => {
    setSelectedForum(null);
  };

  const handleNewForumClick = () => {
    setShowNewForumModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewForum(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitForum = (e) => {
    e.preventDefault();
    const newForumObj = {
      id: forums.length + 1,
      title: newForum.title,
      description: newForum.description,
      icon: newForum.icon || '💬',
      threads: 0,
      lastPost: 'Just now'
    };

    setForums([...forums, newForumObj]);
    setNewForum({
      title: '',
      description: '',
      icon: '💬'
    });
    setShowNewForumModal(false);
  };

  const renderNewForumModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button 
          onClick={() => setShowNewForumModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Create New Forum</h2>
        
        <form onSubmit={handleSubmitForum}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Forum Title *
              </label>
              <input
                type="text"
                name="title"
                value={newForum.title}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter forum title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={newForum.description}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                placeholder="Enter forum description"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Icon (optional)
              </label>
              <input
                type="text"
                name="icon"
                value={newForum.icon}
                onChange={handleInputChange}
                className="w-20 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="💬"
                maxLength="2"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewForumModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Create Forum
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const renderForumsList = () => (
    <div className="grid gap-4">
      {forums.map((forum) => (
        <div
          key={forum.id}
          onClick={() => handleForumSelect(forum)}
          className="bg-white hover:bg-slate-50 rounded-xl p-4 cursor-pointer transition-colors border border-slate-200 hover:border-blue-300"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">{forum.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-800">{forum.title}</h3>
              <p className="text-slate-600 text-sm">{forum.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">{forum.threads} threads</div>
              <div className="text-xs text-slate-400">Last post {forum.lastPost}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderThreadsList = () => (
    <div>
      <button
        onClick={handleBackToForums}
        className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-1 text-sm"
      >
        ← Back to forums
      </button>

      <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">{selectedForum.title}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search threads..."
              className="bg-slate-100 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {threads
            .filter(thread => 
              thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              thread.author.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((thread) => (
              <div key={thread.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MessageSquare size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-800">{thread.title}</h3>
                      {thread.isPinned && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          Pinned
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span>by {thread.author}</span>
                      <span>•</span>
                      <span>{thread.date}</span>
                      <span>•</span>
                      <span>{thread.replies} replies</span>
                      <span>•</span>
                      <span>{thread.views} views</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Last reply</div>
                    <div className="text-sm text-slate-600">{thread.lastReply}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Render chat interface
  const renderChat = () => (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800">Community Chat</h2>
        <p className="text-sm text-slate-500">Chat with other community members in real-time</p>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'currentUser' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'currentUser' 
                  ? 'bg-blue-600 text-white' 
                  : message.sender === 'system'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-slate-200 text-slate-800'
              }`}
            >
              {message.sender !== 'system' && message.sender !== 'currentUser' && (
                <div className="font-medium text-xs text-blue-700 mb-1">{message.username}</div>
              )}
              <p className="text-sm">{message.text}</p>
              <div className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('forum')}
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'forum' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare size={16} />
          Forums
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'chat' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageCircle size={16} />
          Community Chat
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === 'forum' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">
                {selectedForum ? selectedForum.title : 'Community Forums'}
              </h1>
              {!selectedForum && (
                <button 
                  onClick={handleNewForumClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus size={16} />
                  New Forum
                </button>
              )}
            </div>
            {!selectedForum ? renderForumsList() : renderThreadsList()}
            {showNewForumModal && renderNewForumModal()}
          </>
        ) : (
          renderChat()
        )}
      </div>
    </div>
  );
};

export default ForumView;
