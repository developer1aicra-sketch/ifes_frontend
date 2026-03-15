import React from 'react';

const TermsOfUseView = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1a] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Terms of Use</h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Version 1.0 | Effective Date: December 1, 2023</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6 sm:p-8">
          <section className="mb-10 bg-blue-500/10 p-6 rounded-lg border border-blue-500/20">
            <p className="text-lg text-slate-200 font-medium">
              Welcome to the World Robotics Sports Organization (WORSO)!
            </p>
          </section>

          <p className="text-slate-300 mb-8">
            These Terms & Conditions ("Terms") govern your access to and use of the WORSO website, services, platforms, and events (WORSO Services). Please read these Terms carefully before using the WORSO Services. By accessing or using the WORSO Services, you agree to be bound by these Terms.
          </p>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</div>
              <h2 className="text-xl font-bold text-white">Eligibility and Membership</h2>
            </div>
            
            <div className="pl-11">
              <div className="mb-4">
                <h3 className="font-semibold text-slate-200 mb-2">1.1 Eligibility</h3>
                <p className="text-slate-400">
                  To access and use the WORSO Services, you must be at least 10 years old (or the legal age of majority in your jurisdiction, whichever is greater) and have the legal capacity to enter into contracts.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-slate-200 mb-2">1.2 Membership</h3>
                <p className="text-slate-400 mb-3">
                  Membership in the WORSO is voluntary, but offers significant benefits like participation in official tournaments, events, and networking opportunities. WORSO offers different membership tiers with varying levels of access and benefits.
                </p>
                <p className="text-slate-400">
                  Membership applications are subject to WORSO approval based on demonstrated commitment to esports, fair play, and the ethical guidelines of the organization. The WORSO reserves the right to deny or revoke membership at its sole discretion, without providing any reason, but will consider appeals based on valid grounds.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-slate-200 mb-2">1.3 Anti-Doping Policy</h3>
                <p className="text-slate-400">
                  All members must adhere to the IFE's Anti-Doping Policy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-200 mb-2">1.4 Compliance</h3>
                <p className="text-slate-400">
                  Members must not be subject to any sanctions or penalties imposed by the IFE.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</div>
              <h2 className="text-xl font-bold text-slate-200">User Accounts and Content</h2>
            </div>
            
            <div className="pl-11">
              <div className="mb-6">
                <h3 className="font-semibold text-slate-200 mb-2">2.1 Account Creation</h3>
                <p className="text-slate-400">
                  You may be required to create an account to access certain features of the WORSO Services. You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account. You agree to immediately notify the WORSO of any unauthorized use of your account or any other breach of security.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-200 mb-2">2.2 User Content</h3>
                <p className="text-slate-400 mb-3">
                  You are responsible for any content you submit, post, or upload to the WORSO Services ("User Content"). You represent and warrant that you own all rights to your User Content or have obtained all necessary permissions and licenses to use and distribute it as contemplated by these Terms.
                </p>
                <p className="text-slate-400">
                  You grant the WORSO a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, translate, distribute, and display your User Content in connection with the WORSO Services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-200 mb-3">2.3 Prohibited Content</h3>
                <p className="text-slate-400 mb-4">
                  You agree not to submit, post, or upload any User Content that:
                </p>
                <ul className="space-y-2 pl-4">
                  {[
                    "Is illegal, harmful, threatening, abusive, harassing, defamatory, obscene, vulgar, pornographic, hateful, offensive, discriminatory, or invasive of another's privacy",
                    "Infringes any intellectual property rights of any third party",
                    "Contains malicious code or viruses",
                    "Impersonates any person or entity, or falsely states or misrepresents your affiliation with a person or entity",
                    "Solicits or promotes commercial activities or gambling",
                    "Violates any of these Terms"
                  ].map((item, index) => (
                    <li key={index} className="flex">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-slate-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</div>
              <h2 className="text-xl font-bold text-slate-200">Use of WORSO Services</h2>
            </div>
            
            <div className="pl-11">
              <div className="mb-6">
                <h3 className="font-semibold text-slate-200 mb-2">3.1 Permitted Use</h3>
                <p className="text-slate-400">
                  You may use the WORSO Services for their intended purposes only. You may not use the WORSO Services for any illegal or unauthorized purpose, including, but not limited to, hacking, cheating, spamming, or distributing malware.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-200 mb-3">3.2 Restrictions</h3>
                <p className="text-slate-400 mb-4">
                  You may not:
                </p>
                <ul className="space-y-2 pl-4">
                  {[
                    "Modify, reverse engineer, disassemble, decompile, or create derivative works of the WORSO Services",
                    "Remove or tamper with any copyright, trademark, or other proprietary notices from the WORSO Services",
                    "Interfere with or disrupt the WORSO Services or any servers or networks connected to them",
                    "Use the WORSO Services to harm or defraud others",
                    "Violate any applicable laws or regulations"
                  ].map((item, index) => (
                    <li key={index} className="flex">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-slate-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">4</div>
              <h2 className="text-xl font-bold text-slate-200">Third-Party Content and Links</h2>
            </div>
            
            <div className="pl-11">
              <div className="mb-6">
                <h3 className="font-semibold text-slate-200 mb-2">4.1 Third-Party Content</h3>
                <p className="text-slate-400">
                  The WORSO Services may contain links to third-party websites or services that are not owned or controlled by the WORSO. The WORSO is not responsible for the content, accuracy, or privacy practices of any third-party websites or services. You access and use third-party websites or services at your own risk.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-200 mb-2">4.2 Third-Party Advertising</h3>
                <p className="text-slate-400">
                  The WORSO Services may display advertising from third-party advertisers. The WORSO is not responsible for the content or accuracy of any third-party advertising. You interact with third-party advertisers at your own risk.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">5</div>
              <h2 className="text-xl font-bold text-slate-200">Intellectual Property</h2>
            </div>
            
            <div className="pl-11">
              <div className="mb-6">
                <h3 className="font-semibold text-slate-200 mb-2">5.1 WORSO Content</h3>
                <p className="text-slate-400">
                  The WORSO Services and all content contained therein, including but not limited to text, software, graphics, logos, trademarks, service marks, copyrights, and other intellectual property, are owned by the WORSO or its licensors and are protected by international laws and treaties. You may not use any WORSO Content except as expressly permitted by these Terms.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-200 mb-2">5.2 User Content</h3>
                <p className="text-slate-400">
                  You retain all ownership rights to your User Content. However, you grant the WORSO a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, translate, distribute, and display your User Content in connection with the WORSO Services.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-amber-50 p-6 rounded-lg border border-amber-100">
            <div className="flex items-center mb-3">
              <div className="bg-amber-100 text-amber-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">6</div>
              <h2 className="text-xl font-bold text-slate-200">Disclaimer of Warranties</h2>
            </div>
            <p className="text-slate-400 pl-11">
              The WORSO services are provided "as is" and "as available" without any warranties of any kind, express or implied. We disclaim all warranties, including, but not limited to, warranties of merchantability, fitness for a particular purpose, non-infringement, and accuracy of information. The WORSO does not warrant that the WORSO services will be uninterrupted, error-free, or completely secure. You agree that your use of the WORSO services is at your sole risk.
            </p>
            <p className="text-slate-400 mt-3 pl-11">
              This disclaimer ensures the WORSO is not liable for any technical issues, inaccuracies in data or information, or disruptions in service. It emphasizes that users assume the risks associated with using the WORSO Services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUseView;
