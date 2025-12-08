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
  .custom-checkbox:checked {
    background-color: #2563eb;
    border-color: #2563eb;
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

