const Telco = () => (
  <div className="flex items-center justify-between px-6 py-4 bg-gray-700 text-white">
    <span className="text-4xl">TELCO</span>
    <a
      href="/admin"
      className="text-white/70 hover:text-white transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
      </svg>
    </a>
  </div>
);

export default Telco;
