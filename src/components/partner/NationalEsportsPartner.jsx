import React from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');

  .nep-root * { margin: 0; padding: 0; box-sizing: border-box; }

  .nep-root {
    --gold: #c9a227;
    --gold-light: #e8c84a;
    --purple: #6c2bd9;
    --purple-dark: #4a1a9e;
    --bg-dark: #080b14;
    --bg-card: #0e1322;
    --bg-section: #0a0d1a;
    --text: #e8eaf0;
    --text-muted: #8a8fa8;
    --border: rgba(201,162,39,0.2);
    font-family: 'Inter', sans-serif;
    background: var(--bg-dark);
    color: var(--text);
    overflow-x: hidden;
  }

  /* HERO */
  .nep-hero {
    position: relative;
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, #050818 0%, #0d0a2e 50%, #050818 100%);
  }
  .nep-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 40%, rgba(108,43,217,0.25) 0%, transparent 70%),
      repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(201,162,39,0.03) 80px, rgba(201,162,39,0.03) 81px),
      repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(201,162,39,0.03) 80px, rgba(201,162,39,0.03) 81px);
  }
  .nep-hero-bg-text {
    position: absolute;
    font-family: 'Orbitron', monospace;
    font-size: clamp(60px, 12vw, 140px);
    font-weight: 900;
    color: rgba(108,43,217,0.08);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    pointer-events: none;
    white-space: nowrap;
    bottom: -10px;
  }
  .nep-hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 60px 20px 40px;
    animation: nepFadeUp 0.7s ease forwards;
  }
  .nep-breadcrumb {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    color: var(--text-muted);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .nep-breadcrumb span { color: var(--gold); }
  .nep-hero-content h1 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(28px, 5vw, 54px);
    font-weight: 900;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: linear-gradient(135deg, #fff 0%, #e8c84a 60%, #c9a227 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
  }

  /* INTRO */
  .nep-intro-section {
    background: #0b0e1c;
    padding: 80px 20px;
  }
  .nep-container { max-width: 1100px; margin: 0 auto; }
  .nep-tag-badge {
    display: inline-block;
    background: var(--purple);
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 2px;
    margin-bottom: 24px;
  }
  .nep-intro-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    animation: nepFadeUp 0.8s 0.2s ease both;
  }
  .nep-intro-grid h2 {
    font-family: 'Orbitron', monospace;
    font-size: clamp(18px, 2.5vw, 26px);
    font-weight: 700;
    line-height: 1.3;
    color: #fff;
    margin-bottom: 20px;
  }
  .nep-intro-grid p {
    font-size: 14px;
    line-height: 1.8;
    color: var(--text-muted);
    margin-bottom: 30px;
  }
  .nep-btn {
    display: inline-block;
    background: linear-gradient(135deg, var(--purple) 0%, var(--purple-dark) 100%);
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 14px 36px;
    border: none;
    cursor: pointer;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: all 0.3s ease;
  }
  .nep-btn:hover {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(201,162,39,0.4);
  }
  .nep-image-wrap { position: relative; }
  .nep-image-wrap::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, var(--purple), var(--gold));
    border-radius: 4px;
    z-index: 0;
  }
  .nep-image-box {
    position: relative;
    z-index: 1;
    background: #0d0a2e;
    border-radius: 3px;
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 220px;
    overflow: hidden;
  }
  .nep-image-box::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(108,43,217,0.3) 0%, transparent 70%);
  }
  .nep-logo-inner { position: relative; z-index: 2; text-align: center; }
  .nep-logo-inner .nep-nat {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: var(--gold);
    display: block;
    margin-bottom: 4px;
  }
  .nep-logo-inner .nep-esp {
    font-family: 'Orbitron', monospace;
    font-size: 42px;
    font-weight: 900;
    color: #fff;
    letter-spacing: 0.05em;
    display: block;
    line-height: 1;
  }
  .nep-logo-inner .nep-esp .nep-o { color: var(--purple); }
  .nep-logo-inner .nep-part {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: var(--gold);
    display: block;
    margin-top: 4px;
  }

  /* WHY */
  .nep-why-section {
    background: var(--bg-dark);
    padding: 80px 20px;
    position: relative;
    overflow: hidden;
  }
  .nep-why-section::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(108,43,217,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .nep-section-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 700;
    color: #fff;
    margin-bottom: 40px;
    position: relative;
    display: inline-block;
  }
  .nep-section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }
  .nep-why-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 50px;
    align-items: center;
  }
  .nep-benefits-list { list-style: none; }
  .nep-benefits-list li {
    position: relative;
    padding: 16px 0 16px 28px;
    border-bottom: 1px solid rgba(201,162,39,0.1);
    font-size: 13.5px;
    line-height: 1.7;
    color: var(--text-muted);
  }
  .nep-benefits-list li:last-child { border-bottom: none; }
  .nep-benefits-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 22px;
    width: 10px;
    height: 10px;
    background: var(--purple);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  .nep-benefits-list li strong {
    display: block;
    color: #fff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  .nep-map-box {
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 30px;
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .nep-map-box::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(201,162,39,0.05) 0%, transparent 70%);
  }
  .nep-map-svg { width: 100%; max-width: 380px; opacity: 0.7; }

  /* REQ */
  .nep-req-section {
    background: #0b0e1c;
    padding: 80px 20px;
  }
  .nep-req-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    margin-top: 40px;
  }
  .nep-req-box {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-top: 3px solid var(--purple);
    padding: 30px;
    border-radius: 0 0 4px 4px;
  }
  .nep-req-box h3 {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }
  .nep-check-list { list-style: none; }
  .nep-check-list li {
    padding: 10px 0 10px 26px;
    position: relative;
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.6;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nep-check-list li:last-child { border-bottom: none; }
  .nep-check-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--gold);
    font-weight: 700;
  }

  /* CTA */
  .nep-cta-section {
    background: linear-gradient(135deg, #0a0d1a 0%, #0d0a2e 50%, #0a0d1a 100%);
    padding: 80px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .nep-cta-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(108,43,217,0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .nep-cta-title {
    display: block;
    text-align: center;
    margin-bottom: 24px;
  }
  .nep-cta-section p {
    font-size: 15px;
    line-height: 1.8;
    color: var(--text-muted);
    max-width: 750px;
    margin: 0 auto 30px;
    position: relative;
    z-index: 2;
  }
  .nep-cta-contact {
    position: relative;
    z-index: 2;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 30px;
  }
  .nep-cta-contact a { color: var(--gold); text-decoration: none; }

  .nep-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent);
  }

  @keyframes nepFadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .nep-intro-grid,
    .nep-why-grid,
    .nep-req-columns { grid-template-columns: 1fr; gap: 40px; }
  }
`;

const NationalEsportsPartner = () => {
  return (
    <div className="nep-root">
      <style>{styles}</style>

      {/* HERO */}
      <section className="nep-hero">
        <div className="nep-hero-bg-text">ESPORTS</div>
        <div className="nep-hero-content">
          <p className="nep-breadcrumb">@ Home / <span>National Esports Partner</span></p>
          <h1>National Esports Partner</h1>
        </div>
      </section>

      <div className="nep-divider" />

      {/* INTRO */}
      <section className="nep-intro-section">
        <div className="nep-container">
          <div className="nep-intro-grid">
            <div>
              <span className="nep-tag-badge">National Esports Partner</span>
              <h2>Become a National Esports Partner (NEP) of the International Federation of Esports (IFES)</h2>
              <p>
                The International Federation of Esports (IFES) is dedicated to the growth and regulation of
                competitive gaming across the globe. As part of our mission, we are seeking dynamic and
                forward-thinking organisations to join us as National Esports Partners. These partners will be
                responsible for organising esports and gaming events on behalf of IFES in collaboration with
                local governments and esports associations to bring esports to the forefront of their respective
                countries.
              </p>
              <button className="nep-btn">JOIN US</button>
            </div>
            <div className="nep-image-wrap">
              <div className="nep-image-box">
                <div className="nep-logo-inner">
                  <span className="nep-nat">NATIONAL</span>
                  <span className="nep-esp">ESP<span className="nep-o">O</span>RTS</span>
                  <span className="nep-part">PARTNER</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="nep-divider" />

      {/* WHY SECTION */}
      <section className="nep-why-section">
        <div className="nep-container">
          <div className="nep-why-grid">
            <div>
              <h2 className="nep-section-title">Why Become A National Esports Partner?</h2>
              <ul className="nep-benefits-list">
                <li>
                  <strong>Exclusive Access and Authority</strong>
                  As a National Esports Partner, your organisation will have the exclusive rights to organise
                  esports and gaming competitions within your country, in close coordination with IFES and
                  relevant local authorities.
                </li>
                <li>
                  <strong>Global Recognition</strong>
                  Become an official part of the IFES network, recognised globally for your role in advancing
                  esports. Enhance your brand's visibility and credibility within the esports community worldwide.
                </li>
                <li>
                  <strong>Sponsorship Opportunities</strong>
                  As a National Partner, you will be responsible for sourcing and securing sponsors for esports
                  competitions. Tap into a rapidly growing market and attract key industry sponsors to support your events.
                </li>
                <li>
                  <strong>Player Registration and Management</strong>
                  Manage the registration and participation of players in regional and international competitions,
                  ensuring smooth and organised tournament structures.
                </li>
                <li>
                  <strong>Collaboration with IFES and Local Governments</strong>
                  Work alongside IFES and local government entities to ensure esports growth and regulation in
                  your country. Help shape policies and drive the development of esports ecosystems.
                </li>
              </ul>
            </div>
            <div>
              <div className="nep-map-box">
                <svg className="nep-map-svg" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="nepGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#c9a227" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="800" height="450" fill="transparent" />
                  <path d="M 80 80 L 180 60 L 220 90 L 240 130 L 210 160 L 200 200 L 170 220 L 140 210 L 110 180 L 90 150 L 70 120 Z" fill="#c9a227" opacity="0.5" stroke="#c9a227" strokeWidth="1" />
                  <path d="M 160 230 L 200 220 L 220 260 L 210 310 L 190 350 L 165 360 L 150 330 L 140 290 L 145 260 Z" fill="#c9a227" opacity="0.5" stroke="#c9a227" strokeWidth="1" />
                  <path d="M 340 60 L 400 55 L 420 75 L 410 100 L 380 110 L 350 105 L 335 90 Z" fill="#6c2bd9" opacity="0.8" stroke="#6c2bd9" strokeWidth="1" />
                  <path d="M 350 120 L 400 115 L 420 145 L 415 200 L 400 240 L 380 260 L 355 255 L 335 230 L 325 185 L 330 145 Z" fill="#c9a227" opacity="0.5" stroke="#c9a227" strokeWidth="1" />
                  <path d="M 430 55 L 580 50 L 620 80 L 610 130 L 570 155 L 510 160 L 460 145 L 425 120 L 420 85 Z" fill="#c9a227" opacity="0.5" stroke="#c9a227" strokeWidth="1" />
                  <path d="M 510 155 L 545 150 L 555 185 L 545 220 L 528 230 L 510 215 L 505 185 Z" fill="#6c2bd9" opacity="0.9" stroke="#c9a227" strokeWidth="1.5" />
                  <path d="M 570 155 L 610 145 L 625 175 L 610 195 L 585 195 L 565 175 Z" fill="#c9a227" opacity="0.4" stroke="#c9a227" strokeWidth="1" />
                  <path d="M 580 270 L 650 260 L 670 290 L 660 320 L 630 335 L 595 325 L 575 305 Z" fill="#c9a227" opacity="0.5" stroke="#c9a227" strokeWidth="1" />
                  <line x1="530" y1="190" x2="400" y2="90" stroke="#c9a227" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
                  <line x1="530" y1="190" x2="170" y2="140" stroke="#c9a227" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
                  <line x1="530" y1="190" x2="615" y2="295" stroke="#c9a227" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
                  <circle cx="528" cy="190" r="8" fill="#6c2bd9" opacity="0.5" />
                  <circle cx="528" cy="190" r="4" fill="#fff" opacity="0.9" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="nep-divider" />

      {/* REQUIREMENTS */}
      <section className="nep-req-section">
        <div className="nep-container">
          <h2 className="nep-section-title">Requirements & Responsibilities</h2>
          <div className="nep-req-columns">
            <div className="nep-req-box">
              <h3>Requirements to Qualify</h3>
              <ul className="nep-check-list">
                <li>Have a solid track record in organising competitive gaming events or esports tournaments in your country.</li>
                <li>Work effectively with local government bodies, esports associations, and other relevant stakeholders to promote esports.</li>
                <li>Demonstrate commitment to fostering esports growth, including player development, infrastructure, and community engagement.</li>
                <li>Be able to manage and oversee sponsorship and funding for esports events.</li>
                <li>To become an official National Esports Partner of IFES, an annual license fee of USD 2,000 to be paid.</li>
              </ul>
            </div>
            <div className="nep-req-box">
              <h3>Your Responsibilities as NEP</h3>
              <ul className="nep-check-list">
                <li>Organise national esports competitions and events under the IFES banner.</li>
                <li>Coordinate with local government and esports bodies.</li>
                <li>Access IFES branding, event guidelines, and resources.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="nep-divider" />

      {/* CTA */}
      <section className="nep-cta-section">
        <div className="nep-container">
          <h2 className="nep-section-title nep-cta-title">Ready to Make an Impact?</h2>
          <p>
            Becoming a National Esports Partner of IFES is an exciting opportunity to play a central role in
            shaping the future of esports in your country. Together with IFES, we can elevate competitive
            gaming, provide opportunities for players, and create a thriving esports culture. Submit your
            application in the attached online form. Our team will review your application, and upon approval,
            you will be notified of your official status as a National Esports Partner.
          </p>
          <button className="nep-btn">APPLY NOW</button>
          <p className="nep-cta-contact">
            For any questions or assistance with the application process, feel free to contact our team at{' '}
            <a href="mailto:president@ifes.in">president@ifes.in</a> or WhatsApp @ +91 93 03950 59492
          </p>
        </div>
      </section>
    </div>
  );
};

export default NationalEsportsPartner;