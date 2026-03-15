// Inline CSS used across the experience. Injected once in App.
export const styles = `
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  .animate-marquee {
    display: flex;
    animation: marquee 40s linear infinite;
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .scrollbar-hide::-webkit-scrollbar {
      display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .card-shine { position: relative; overflow: hidden; }
  .card-shine::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 35%; height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%);
    animation: shine 6s linear infinite;
  }
  .trophy-bg {
    background-image:
      radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0, transparent 40%),
      radial-gradient(circle at 80% 0%, rgba(255,255,255,0.1) 0, transparent 40%);
  }
  .trophy-grid {
    background-image:
      radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.06), transparent 55%),
      radial-gradient(ellipse at 80% 90%, rgba(255,255,255,0.06), transparent 55%),
      linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: auto, auto, 48px 48px, 48px 48px;
    background-position: 0 0, 0 0, 0 0, 0 0;
  }
  .custom-checkbox:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }
  .typing-dot {
    animation: typing 1.4s infinite ease-in-out both;
  }
  .typing-dot:nth-child(1) { animation-delay: -0.32s; }
  .typing-dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

