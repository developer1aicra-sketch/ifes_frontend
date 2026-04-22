// import { EXECUTIVE_MEMBERS } from '../../../data/aboutPeople';

// const PresidentMessagePage = () => (
//   <div className="space-y-8">
//     <div className="flex flex-col md:flex-row gap-8">
//       <div className="md:w-1/4 space-y-4">
//         <div className="bg-slate-100 rounded-xl overflow-hidden aspect-[3/4] max-w-[280px] mx-auto">
//           <img
//             src={EXECUTIVE_MEMBERS[0]?.image}
//             alt="Raj Kumar Sharma, President of International Federation of Esports"
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1Ljc1IDZhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNNC41IDguNWE2LjM3NiA2LjM3NiAwIDAxMS41LS4xNzdjLjg2MiAwIDEuNjg5LjEyNCAyLjQ1Ny4zNWEuNS41IDAgMTEtLjI4Ni45NjMgNC44NzggNC44NzggMCAwMC0yLjk5LS4xMDhBLiUuNSAwIDAxNC41IDguNXpNOCAyNGE4LjAwMSA4LjAwMSAwIDAwOC04YzAtMS4xNjgtLjI0NS0yLjI3Ni0uNjg0LTMuTC4yODJhLjUwMS41MDEgMCAwMS42Ni0uNjYxYy42MjguMjQyIDEuMjk2LjM5MyAyLjAyNC40M0ExNC42NiAxNC42NiAwIDAwMjIuNSAxNGMwIDguMDA4LTYuMjY4IDExLjc1LTExLjM2OCA5LjcyOWEuNDc4LjQ3OCAwIDAwLS4yNjQgMEM1Ljc2OCAyNS43NSAyLjUgMjIuMDA4IDIuNSAxNGMwLTQuMTQyIDEuNjY1LTcuOTExIDQuNDM5LTEwLjU2MWEuNS41IDAgMDEuNzA4LjcwNUM1LjEwOSA2Ljk3OSAzLjUgMTAuMzc2IDMuNSAxNGMwIDcuNTIxIDMuNDc1IDEwLjYyNSA4LjQzIDExLjgxOUE2LjQ1IDYuNDUgMCAwMTggMjR6Ii8+PC9zdmc+';
//             }}
//           />
//         </div>
//         <div className="text-center">
//           <p className="text-xl font-bold text-slate-900">Raj Kumar Sharma</p>
//           <p className="text-blue-600 font-medium">President, International Federation of Esports</p>
//         </div>
//       </div>

//       <div className="md:w-3/4 space-y-6">
//         <div>
//           <h2 className="text-3xl font-bold text-slate-900 mb-2">IFeS Leadership</h2>
//           <div className="w-16 h-1 bg-blue-600 mb-6"></div>
//         </div>

//         <p className="text-lg text-slate-700 leading-relaxed">
//           Attention all esports associations, fans, players, and pioneers!
//         </p>

//         <p className="text-slate-600 leading-relaxed">
//           As we stand at the threshold of a new year, brimming with potential and possibility, I wanted to take this moment to address you, the vibrant heart of the global esports community.
//         </p>

//         <p className="text-slate-600 leading-relaxed">
//           The past year has been nothing short of extraordinary for esports. We&apos;ve witnessed breathtaking moments of skill, witnessed esports break new barriers of mainstream acceptance, and experienced the power of our community coming together as one.
//         </p>

//         <p className="text-slate-600 leading-relaxed">
//           From the electrifying finals of the World Cup 7.0 - TechnoXian, where nations battled for esports glory, to the record-breaking viewership of major tournaments, to the grassroots passion evident in local communities around the world, we&apos;ve seen the undeniable growth and resilience of our beloved sport.
//         </p>

//         <p className="text-slate-600 leading-relaxed">
//           But this, my friends, is just the beginning. As the International Federation of Esports (IFeS), We are committed to nurturing this momentum and propelling esports to even greater heights. In the coming year, we will strive to:
//         </p>

//         <ul className="space-y-3 list-disc pl-5 text-slate-600">
//           <li><span className="font-medium">Champion a level playing field:</span> We will continue to advocate for fair competition at all levels, ensuring everyone has the opportunity to reach their full potential.</li>
//           <li><span className="font-medium">Foster sustainable growth:</span> We will work tirelessly to support infrastructure development, empower local communities, and create pathways for aspiring players and professionals.</li>
//           <li><span className="font-medium">Bridge the digital divide:</span> We will break down barriers to entry and ensure that everyone, regardless of socioeconomic background, can access the incredible opportunities esports offers.</li>
//           <li><span className="font-medium">Promote responsible gameplay:</span> We will champion principles of sportsmanship, ethical conduct, and player well-being, ensuring that esports remains a healthy and inclusive environment for all.</li>
//           <li><span className="font-medium">Elevate esports to its rightful place:</span> We will continue to collaborate with key stakeholders, including traditional sports organizations, governments, and educational institutions, to secure esports&apos; rightful place as a respected and recognized sport.</li>
//         </ul>

//         <p className="text-slate-600 leading-relaxed">
//           But none of this will be possible without you, the incredible esports community. We need your passion, your dedication, and your unwavering belief in the power of esports.
//         </p>

//         <p className="text-slate-600 leading-relaxed">
//           So, let&apos;s step into this new year together, united by our love for the game and our shared vision for the future. Let&apos;s strive for excellence, inspire each other, and continue to build a vibrant, inclusive, and sustainable esports landscape that benefits players, teams, organizations, and fans alike.
//         </p>

//         <p className="text-slate-700 font-medium text-lg">
//           Together, we can make esports more than just a game. We can make it a platform for connection, opportunity, and positive impact. Let&apos;s make this year the year esports truly reaches its full potential!
//         </p>

//         <p className="text-slate-800 font-medium mt-8 text-lg">
//           Onward and upward, esport family!
//         </p>

//         <p className="text-slate-600 mt-10">
//           With unwavering support,
//         </p>
//         <p className="text-slate-900 font-semibold">
//           Raj Kumar Sharma
//         </p>
//       </div>
//     </div>

//     <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 mt-8">
//       <h4 className="font-bold mb-2">Global Mandate</h4>
//       <p className="text-slate-600">As the International Federation of Esports, IFeS is committed to governing and promoting esports worldwide, ensuring fair play, integrity, and the continued growth of our sport.</p>
//     </div>
//   </div>
// );

// export default PresidentMessagePage;



// updated code
import { EXECUTIVE_MEMBERS } from '../../../data/aboutPeople';

const PresidentMessagePage = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/4 space-y-4">
        <div className="bg-slate-100 rounded-xl overflow-hidden aspect-[3/4] max-w-[280px] mx-auto">
          <img
            src={EXECUTIVE_MEMBERS[0]?.image}
            alt="Raj Kumar Sharma, President of International Federation of Esports"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1Ljc1IDZhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNNC41IDguNWE2LjM3NiA2LjM3NiAwIDAxMS41LS4xNzdjLjg2MiAwIDEuNjg5LjEyNCAyLjQ1Ny4zNWEuNS41IDAgMTEtLjI4Ni45NjMgNC44NzggNC44NzggMCAwMC0yLjk5LS4xMDhBLiUuNSAwIDAxNC41IDguNXpNOCAyNGE4LjAwMSA4LjAwMSAwIDAwOC04YzAtMS4xNjgtLjI0NS0yLjI3Ni0uNjg0LTMuTC4yODJhLjUwMS41MDEgMCAwMS42Ni0uNjYxYy42MjguMjQyIDEuMjk2LjM5MyAyLjAyNC40M0ExNC42NiAxNC42NiAwIDAwMjIuNSAxNGMwIDguMDA4LTYuMjY4IDExLjc1LTExLjM2OCA5LjcyOWEuNDc4LjQ3OCAwIDAwLS4yNjQgMEM1Ljc2OCAyNS43NSAyLjUgMjIuMDA4IDIuNSAxNGMwLTQuMTQyIDEuNjY1LTcuOTExIDQuNDM5LTEwLjU2MWEuNS41IDAgMDEuNzA4LjcwNUM1LjEwOSA2Ljk3OSAzLjUgMTAuMzc2IDMuNSAxNGMwIDcuNTIxIDMuNDc1IDEwLjYyNSA4LjQzIDExLjgxOUE2LjQ1IDYuNDUgMCAwMTggMjR6Ii8+PC9zdmc+';
            }}
          />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-slate-900">Rajkumar Sharma</p>
          <p className="text-blue-600 font-medium">President, International Federation of Esports</p>
        </div>
      </div>

      <div className="md:w-3/4 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">President's Message</h2>
          <div className="w-16 h-1 bg-blue-600 mb-6"></div>
        </div>

        <p className="text-slate-600 leading-relaxed">
          At the International Federation of Esports, we stand at a defining moment in the evolution of competitive gaming. Esports has grown far beyond entertainment—it is now a global movement that blends technology, skill, strategy, and community into a powerful new-age sport.
        </p>

        <p className="text-slate-600 leading-relaxed">
          Our vision at IFES is clear: to build a structured, inclusive, and globally connected esports ecosystem that empowers players, federations, and industry stakeholders alike. We believe esports has the potential to unite nations, create meaningful career opportunities, and inspire the next generation of digital athletes and innovators.
        </p>

        <p className="text-slate-600 leading-relaxed">
          Since our inception, we have focused on laying strong foundations—developing governance frameworks, fostering international collaborations, and creating platforms that enable fair and competitive play. Through initiatives such as global tournaments, partnerships, and development programs, we are working to ensure that esports is recognized not only as a sport, but as a legitimate and respected global discipline.
        </p>

        <p className="text-slate-600 leading-relaxed">
          A key priority for us is to bridge the gap between grassroots talent and global opportunity. Across regions, we see immense potential waiting to be nurtured. IFES is committed to enabling access, supporting national federations, and creating pathways that allow talent from every corner of the world to compete on the global stage.
        </p>

        <p className="text-slate-600 leading-relaxed">
          Equally important is our responsibility to uphold the integrity and sustainability of esports. We advocate for fair play, ethical standards, inclusivity, and responsible growth—ensuring that the ecosystem we build today remains strong and credible for the future.
        </p>

        <p className="text-slate-600 leading-relaxed">
          As we look ahead, our focus remains on expanding our global network, strengthening partnerships, and embracing innovation. The esports industry is evolving rapidly, and IFES is committed to leading this transformation with purpose, collaboration, and vision.
        </p>

        <p className="text-slate-600 leading-relaxed">
          I invite all stakeholders—players, teams, federations, brands, and enthusiasts—to join us in shaping the future of esports. Together, we can create a unified global platform that not only celebrates competition but also drives progress, connection, and opportunity.
        </p>

        <p className="text-slate-600 leading-relaxed">
          Let us move forward together, building a future where esports thrives as a sport, an industry, and a global community.
        </p>

        <div className="mt-8 pt-4 border-t border-slate-100">
          <p className="text-slate-800 font-semibold text-lg">
            Rajkumar Sharma
          </p>
          <p className="text-slate-500">
            President
          </p>
          <p className="text-slate-500">
            International Federation of Esports
          </p>
        </div>
      </div>
    </div>

    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 mt-8">
      <h4 className="font-bold mb-2">Global Mandate</h4>
      <p className="text-slate-600">As the International Federation of Esports, IFES is committed to governing and promoting esports worldwide, ensuring fair play, integrity, and the continued growth of our sport.</p>
    </div>
  </div>
);

export default PresidentMessagePage;