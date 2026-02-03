import { useState, useEffect } from "react";
import { INITIAL_DB } from "../constants/userData";
import { Cpu, Users, Copy, Check, UserPlus, Key, Share2, Link as LinkIcon } from "lucide-react";

export const SquadManager = ({ setPage, user }) => {
  const [selectedBot, setSelectedBot] = useState(null);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [competitionType, setCompetitionType] = useState('Robo Race Challenge');
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [userTeam, setUserTeam] = useState(null);
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : [];
  });
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Competition configurations with specific bot requirements
  const COMPETITION_CONFIG = {
    'Innovation Contest': {
      min: 1,
      max: 10,
      requiresPilot: false,
      allowedBots: ['arduino', 'raspberry_pi', 'esp32'],
      requiredFeatures: ['programming', 'design'],
      allowedCategories: ['Innovation', 'Prototype']
    },
    'Robosoccer Challenge': {
      min: 3,
      max: 10,
      requiresPilot: true,
      allowedBots: ['soccer_bot', 'omni_wheel', 'rc_bot'],
      requiredFeatures: ['remote_control', 'kicking_mechanism'],
      allowedCategories: ['Sports', 'RC']
    },
    'BotCombat Challenge': {
      min: 1,
      max: 10,
      requiresPilot: true,
      allowedBots: ['combat_bot', 'sumo_bot', 'battle_bot'],
      requiredFeatures: ['armor', 'weapon_system'],
      allowedCategories: ['Combat', 'Battle']
    },
    'Robo Race Challenge': {
      min: 1,
      max: 10,
      requiresPilot: true,
      allowedBots: ['race_bot', 'rc_car', 'line_follower'],
      requiredFeatures: ['speed_control', 'navigation'],
      allowedCategories: ['Racing', 'RC']
    },
  };

  // Generate team join link
  const generateJoinLink = (code) => {
    // Use the current origin and add team join parameter
    const baseUrl = window.location.origin;
    return `${baseUrl}?team_join=${code}`;
  };

  // Generate unique invitation code
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Handle team join from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const teamCode = urlParams.get('team_join');

    if (teamCode && user && user.uid && !userTeam) {
      // Auto-fill the join code
      setInviteCode(teamCode.toUpperCase());

      // Show a notification
      setSuccess(`Found team invitation! Click "Join Team" to accept.`);

      // Remove the parameter from URL without refreshing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [user, userTeam]);

  // Filter bots based on competition requirements
  const getAvailableBots = () => {
    const config = COMPETITION_CONFIG[competitionType];
    if (!config) return INITIAL_DB.garage;

    return INITIAL_DB.garage.filter(bot =>
      config.allowedCategories.includes(bot.category) ||
      config.allowedBots.includes(bot.type)
    );
  };

  const currentConfig = COMPETITION_CONFIG[competitionType] || COMPETITION_CONFIG['Robo Race Challenge'];
  const totalTeamMembers = 1 + (selectedPilot ? 1 : 0) + selectedCrew.length;

  // Create a new team
  const createTeam = () => {
    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    if (!user || !user.uid) {
      setError('User information is missing. Please log in again.');
      return;
    }

    if (teams.some(team => team.creatorId === user.uid)) {
      setError('You have already created a team');
      return;
    }

    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
      creatorId: user.uid,
      creatorName: user.name || user.full_name || 'Unknown',
      inviteCode: generateInviteCode(),
      joinLink: generateJoinLink(generateInviteCode()),
      members: [{
        uid: user.uid,
        name: user.name || user.full_name || 'Unknown',
        role: 'Captain',
        joinedAt: new Date().toISOString()
      }],
      competitions: [],
      createdAt: new Date().toISOString()
    };

    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    setUserTeam(newTeam);
    setSuccess('Team created successfully!');

    setInviteCode(newTeam.inviteCode);
    setShowInviteModal(true);
  };

  // Join a team using invitation code
  const joinTeam = () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invitation code');
      return;
    }

    if (!user || !user.uid) {
      setError('User information is missing. Please log in again.');
      return;
    }

    const teamToJoin = teams.find(team => team.inviteCode === inviteCode.toUpperCase());

    if (!teamToJoin) {
      setError('Invalid invitation code');
      return;
    }

    if (teamToJoin.members.some(member => member.uid === user.uid)) {
      setError('You are already a member of this team');
      return;
    }

    if (teamToJoin.members.length >= 15) {
      setError('Team is full');
      return;
    }

    const updatedTeam = {
      ...teamToJoin,
      members: [...teamToJoin.members, {
        uid: user.uid,
        name: user.name || user.full_name || 'Unknown',
        role: 'Member',
        joinedAt: new Date().toISOString()
      }]
    };

    const updatedTeams = teams.map(team =>
      team.id === teamToJoin.id ? updatedTeam : team
    );

    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    setUserTeam(updatedTeam);
    setSuccess(`Successfully joined team: ${teamToJoin.name}`);
    setInviteCode('');
    setShowInviteModal(false);
  };

  // Copy join link to clipboard
  const copyJoinLink = () => {
    if (!userTeam) return;

    const link = generateJoinLink(userTeam.inviteCode);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setSuccess('Join link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Share via social media or other methods
  const shareTeamLink = async () => {
    if (!userTeam) return;

    const link = generateJoinLink(userTeam.inviteCode);
    const shareData = {
      title: `Join my team: ${userTeam.name}`,
      text: `Join ${userTeam.name} for the robotics competition! Use this link to join my team.`,
      url: link,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying link
        copyJoinLink();
      }
    } catch (err) {
      console.log('Error sharing:', err);
      copyJoinLink();
    }
  };

  // Filter team members for crew selection
  const availableTeamMembers = userTeam && user?.uid ?
    userTeam.members.filter(member =>
      member.uid !== (selectedPilot?.uid) &&
      !selectedCrew.some(crew => crew.uid === member.uid) &&
      member.uid !== user.uid
    ) : [];

  const handleCrewSelect = (member) => {
    if (selectedCrew.some(m => m.uid === member.uid)) {
      setSelectedCrew(selectedCrew.filter(m => m.uid !== member.uid));
    } else if (totalTeamMembers < currentConfig.max) {
      setSelectedCrew([...selectedCrew, member]);
    }
  };

  const handleSubmit = () => {
    if (!userTeam) {
      setError('You must create or join a team first');
      return;
    }

    if (!selectedBot) {
      setError('Please select a bot');
      return;
    }

    if (currentConfig.requiresPilot && !selectedPilot) {
      setError('This competition requires a pilot');
      return;
    }

    if (totalTeamMembers < currentConfig.min) {
      setError(`Minimum ${currentConfig.min} team members required`);
      return;
    }

    const isCaptainInTeam = userTeam.members.some(member => member.uid === captain?.uid);
    if (!isCaptainInTeam) {
      setError('Captain must be a team member');
      return;
    }

    const competitionEntry = {
      id: Date.now().toString(),
      competition: competitionType,
      bot: selectedBot,
      pilot: selectedPilot,
      crew: selectedCrew,
      captain: captain,
      teamId: userTeam.id,
      teamName: userTeam.name,
      entryFee: 3500,
      status: 'pending_payment',
      registeredAt: new Date().toISOString()
    };

    const updatedTeam = {
      ...userTeam,
      competitions: [...userTeam.competitions, competitionEntry]
    };

    const updatedTeams = teams.map(team =>
      team.id === userTeam.id ? updatedTeam : team
    );

    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    setUserTeam(updatedTeam);
    localStorage.setItem('currentRegistration', JSON.stringify(competitionEntry));

    setPage('payment');
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) return;

    try {
      setSending(true);
      // call your API here
      // await sendTeamInvite({ email: inviteEmail, teamId: userTeam._id });

      setInviteEmail("");
      alert("Invitation sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send invite");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!user || !user.uid) return;

    const userTeam = teams.find(team =>
      team.members.some(member => member.uid === user.uid)
    );
    if (userTeam) {
      setUserTeam(userTeam);
      setTeamName(userTeam.name);
      setTeamMembers(userTeam.members);
    }
  }, [teams, user?.uid]);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setSuccess('Invitation code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const availableBots = getAvailableBots();

  return (
    <div className="animate-fadeIn p-6">
      <button
        onClick={() => setPage('dashboard')}
        className="text-slate-500 text-sm mb-4 hover:text-white"
      >
        ← Back to Command Center
      </button>

      {/* Team Creation/Join Section */}
      {!userTeam ? (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Team Setup</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Team */}
            <div className="border border-slate-700 rounded-lg p-5">
              <h3 className="text-lg font-bold text-white mb-3">Create New Team</h3>
              <p className="text-slate-400 text-sm mb-4">Create a team and invite others to join</p>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                className="w-full bg-slate-800 text-white rounded px-3 py-2 border border-slate-600 mb-4"
              />
              <button
                onClick={createTeam}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded"
              >
                Create Team
              </button>
            </div>

            {/* Join Team */}
            <div className="border border-slate-700 rounded-lg p-5">
              <h3 className="text-lg font-bold text-white mb-3">Join Existing Team</h3>
              <p className="text-slate-400 text-sm mb-4">Enter invitation code or use link to join</p>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="Enter invitation code"
                    className="w-full bg-slate-800 text-white rounded px-10 py-2 border border-slate-600"
                  />
                </div>
                <button
                  onClick={joinTeam}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded"
                >
                  Join
                </button>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Or click a join link shared by your teammate
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{userTeam.name}</h2>
              <p className="text-slate-400 text-sm">
                Members: {userTeam.members.length} |
                Captain: {userTeam.creatorName} |
                Competitions: {userTeam.competitions.length}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={shareTeamLink}
                className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded flex items-center gap-2"
              >
                <Share2 size={16} />
                Share Link
              </button>
              <button
                onClick={() => {
                  setInviteCode(userTeam.inviteCode);
                  setShowInviteModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded flex items-center gap-2"
              >
                <UserPlus size={16} />
                Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal with Link Sharing */}
      {showInviteModal && userTeam && (
        <div className="mb-6">
          <p className="text-xs text-slate-500 uppercase mb-2">Invite via Email</p>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={handleSendInvite}
              disabled={sending || !inviteEmail}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* Competition Registration Section - Only show if user has a team */}
      {userTeam && (
        <>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h1 className="text-3xl font-black italic text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    MANAGE SQUAD
                  </h1>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                    <Users size={16} className="text-blue-400" />
                    <p className="text-blue-400 text-sm font-bold">{userTeam.name}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded">
                      <p className="text-purple-400 text-xs font-bold uppercase">Competition</p>
                    </div>
                    <div className="relative">
                      <select
                        value={competitionType}
                        onChange={(e) => {
                          setCompetitionType(e.target.value);
                          setSelectedBot(null);
                          setSelectedPilot(null);
                          setSelectedCrew([]);
                          setCaptain(null);
                          setError('');
                        }}
                        className="bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer hover:bg-slate-700 transition-colors pr-10"
                      >
                        {Object.keys(COMPETITION_CONFIG).map((comp) => (
                          <option key={comp} value={comp}>{comp}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-green-900/30 border border-green-500/30 rounded">
                      <p className="text-green-400 text-xs font-bold uppercase">Captain</p>
                    </div>
                    <div className="relative">
                      <select
                        value={captain?.uid || ''}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedMember = [selectedPilot, ...selectedCrew].find(m => m?.uid === selectedId);
                          setCaptain(selectedMember || null);
                        }}
                        className="bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2 border border-slate-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none cursor-pointer hover:bg-slate-700 transition-colors pr-10 min-w-[200px]"
                      >
                        <option value="">Select Captain...</option>
                        {selectedPilot && (
                          <option key={selectedPilot.uid} value={selectedPilot.uid}>
                            {selectedPilot.name} (Pilot)
                          </option>
                        )}
                        {selectedCrew.map(member => (
                          <option key={member.uid} value={member.uid}>
                            {member.name} (Crew)
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-600">
                    <div className={`w-2 h-2 rounded-full ${totalTeamMembers >= currentConfig.min ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <p className="text-xs text-slate-300">
                      Team: <span className="font-bold text-white">{totalTeamMembers}</span>
                      <span className="text-slate-400"> member{totalTeamMembers !== 1 ? 's' : ''}</span>
                    </p>
                    {currentConfig && (
                      <span className="text-xs text-slate-400">
                        (<span className="text-green-400">{currentConfig.min}-{currentConfig.max}</span> required)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 text-center min-w-[120px]">
                <p className="text-xs text-slate-500 uppercase mb-1">Entry Fee</p>
                <p className="text-xl font-mono font-bold text-white">₹3,500</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm p-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-500/50 text-green-300 text-sm p-3 rounded mb-6">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Selection Area */}
            <div className="space-y-6">
              {/* Available Bots */}
              <div className="bg-slate-900 p-4 rounded border border-slate-700">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">
                  Available Bots ({availableBots.length})
                  {currentConfig.allowedCategories && (
                    <span className="ml-2 text-xs text-blue-400">
                      {currentConfig.allowedCategories.join(', ')}
                    </span>
                  )}
                </h3>
                {availableBots.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    Bots not found for this competition
                  </p>
                ) : (
                  availableBots.map(bot => (
                    <div
                      key={bot.bot_id}
                      onClick={() => {
                        setSelectedBot(bot);
                        setError('');
                      }}
                      className={`flex items-center p-2 hover:bg-slate-800 cursor-pointer rounded mb-2 ${selectedBot?.bot_id === bot.bot_id ? 'bg-blue-900/20 border border-blue-500' : ''
                        }`}
                    >
                      <span className="text-2xl mr-3">{bot.image}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{bot.name}</p>
                        <p className="text-xs text-slate-500">{bot.category}</p>
                        {bot.features && (
                          <p className="text-xs text-green-400">
                            {bot.features.filter(f => currentConfig.requiredFeatures?.includes(f)).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Available Team Members */}
              <div className="bg-slate-900 p-4 rounded border border-slate-700">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">
                  Available Team Members ({availableTeamMembers.length})
                </h3>
                {availableTeamMembers.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Team Member not found</p>
                ) : (
                  availableTeamMembers.map(member => (
                    <div
                      key={member.uid}
                      onClick={() => {
                        if (!selectedPilot && currentConfig.requiresPilot) {
                          setSelectedPilot(member);
                        } else {
                          handleCrewSelect(member);
                        }
                        setError('');
                      }}
                      className={`flex items-center p-2 hover:bg-slate-800 cursor-pointer rounded mb-2`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white mr-3">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Formation Board */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-xl p-8 relative">
              <div className="absolute top-4 right-4 text-xs text-slate-500 uppercase font-bold tracking-widest">
                {competitionType} Lineup
              </div>

              <div className="flex flex-wrap gap-5 justify-center mt-8">
                {/* Bot Slot */}
                <div className={`w-40 h-56 border-2 ${selectedBot ? 'border-blue-500 bg-blue-900/10' : 'border-slate-600 border-dashed'} rounded-xl flex flex-col items-center justify-center p-4 transition-all`}>
                  <p className="text-xs text-slate-500 uppercase mb-2">1. Select Bot</p>
                  {selectedBot ? (
                    <>
                      <span className="text-5xl mb-2">{selectedBot.image}</span>
                      <p className="font-bold text-white text-center text-sm">{selectedBot.name}</p>
                      <p className="text-xs text-slate-400 mt-1 text-center">{selectedBot.category}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBot(null);
                        }}
                        className="text-red-400 hover:text-red-300 text-xs mt-2"
                      >
                        Remove
                      </button>
                    </>
                  ) : <Cpu className="text-slate-600" size={40} />}
                </div>

                {/* Pilot Slot */}
                {currentConfig.requiresPilot && (
                  <div className={`w-40 h-56 border-2 ${selectedPilot ? 'border-green-500 bg-green-900/10' : 'border-slate-600 border-dashed'} rounded-xl flex flex-col items-center justify-center p-4 transition-all`}>
                    <p className="text-xs text-slate-500 uppercase mb-2">2. Select Pilot</p>
                    {selectedPilot ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-xl font-bold text-white mb-2">
                          {selectedPilot.name.charAt(0)}
                        </div>
                        <p className="font-bold text-white text-center text-sm">{selectedPilot.name}</p>
                        <p className="text-xs text-slate-400 text-center">{selectedPilot.role}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPilot(null);
                          }}
                          className="text-red-400 hover:text-red-300 text-xs mt-2"
                        >
                          Remove
                        </button>
                      </>
                    ) : <Users className="text-slate-600" size={40} />}
                  </div>
                )}

                {/* Crew Slots */}
                {[...Array(currentConfig.max - (currentConfig.requiresPilot ? 1 : 0))].map((_, index) => {
                  const crewMember = selectedCrew[index];
                  return (
                    <div
                      key={index}
                      className={`w-40 h-56 border-2 ${crewMember
                        ? 'border-purple-500 bg-purple-900/10'
                        : selectedCrew.length === index
                          ? 'border-dashed border-slate-600'
                          : 'border-slate-600'
                        } rounded-xl flex flex-col items-center justify-center p-4 transition-all`}
                    >
                      <p className="text-xs text-slate-500 uppercase mb-2">
                        {currentConfig.requiresPilot ? `${index + 3}. ` : `${index + 2}. `}
                        Crew {index + 1}
                      </p>
                      {crewMember ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold text-white mb-2">
                            {crewMember.name.charAt(0)}
                          </div>
                          <p className="font-bold text-white text-center text-sm">{crewMember.name}</p>
                          <p className="text-xs text-slate-400 text-center">{crewMember.role}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCrew(selectedCrew.filter((_, i) => i !== index));
                            }}
                            className="text-red-400 hover:text-red-300 text-xs mt-2"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <Users className="text-slate-600" size={40} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedBot || (currentConfig.requiresPilot && !selectedPilot) || totalTeamMembers < currentConfig.min || !captain}
                  className={`px-8 py-3 rounded font-bold uppercase tracking-wide transition-all ${selectedBot && (!currentConfig.requiresPilot || selectedPilot) && totalTeamMembers >= currentConfig.min && captain ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                >
                  {totalTeamMembers < currentConfig.min
                    ? `Add ${currentConfig.min - totalTeamMembers} more member${currentConfig.min - totalTeamMembers > 1 ? 's' : ''}`
                    : 'Confirm Lineup & Pay'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};