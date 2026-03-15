import React from 'react';

const PrivacyPolicyView = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1a] py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm">Effective Date: December 1, 2023</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-white/10 p-6 sm:p-8">
          <section className="mb-10 bg-blue-500/10 p-6 rounded-lg border border-blue-500/20">
            <p className="text-lg text-slate-200 font-medium mb-4">
              Welcome to the International Federation of Esports (IFES)!
            </p>
            <p className="text-slate-400">
              This Privacy Policy explains how we collect, use, and disclose your personal information ('Personal Information') when you use our website, services, platforms, and events ('IFES Services').
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</div>
              <h2 className="text-xl font-bold text-white">Information We Collect</h2>
            </div>
            <p className="text-slate-400 mb-4 pl-11">
              We collect various types of Personal Information from you, depending on your interaction with the IFES Services:
            </p>
            <ul className="space-y-3 pl-11 mb-6">
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
                <div>
                  <span className="font-medium text-slate-200">Account Information:</span>
                  <span className="text-slate-400"> Name, email address, username, password, and country of residence.</span>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
                <div>
                  <span className="font-medium text-slate-200">Profile Information:</span>
                  <span className="text-slate-400"> Date of birth, gender, language preference, and avatar.</span>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
                <div>
                  <span className="font-medium text-slate-200">Activity Information:</span>
                  <span className="text-slate-400"> Game play data, tournament participation, forum posts, and messages.</span>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
                <div>
                  <span className="font-medium text-slate-200">Device Information:</span>
                  <span className="text-slate-400"> Device type, operating system, and IP address.</span>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
                <div>
                  <span className="font-medium text-slate-200">Payment Information:</span>
                  <span className="text-slate-400"> Credit card details and billing address for purchases.</span>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
                <div>
                  <span className="font-medium text-slate-200">Cookies and Similar Technologies:</span>
                  <span className="text-slate-400"> We use cookies to track activity and personalize your experience. You can manage cookie preferences in your browser settings.</span>
                </div>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</div>
              <h2 className="text-xl font-bold text-slate-200">How We Use Your Information</h2>
            </div>
            <p className="text-slate-400 mb-4 pl-11">
              We use your Personal Information to:
            </p>
            <ul className="space-y-3 pl-11 mb-6">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-400">Provide and operate the IFES Services</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-400">Personalize your experience and deliver targeted content</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-400">Manage your account and respond to inquiries</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-400">Organize and conduct tournaments and events</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-400">Analyze and improve our services</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-400">Prevent fraud and abuse</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-400">Comply with legal requirements and enforce our Terms & Conditions</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</div>
              <h2 className="text-xl font-bold text-slate-200">Sharing of Personal Information</h2>
            </div>
            <p className="text-slate-400 mb-4 pl-11">
              We may share your information with:
            </p>
            <div className="grid md:grid-cols-2 gap-4 pl-11 mb-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-200 mb-2">Service Providers</h4>
                <p className="text-sm text-slate-400">Third parties who help us operate the IFES Services</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-200 mb-2">Tournament Organizers</h4>
                <p className="text-sm text-slate-400">When you participate in their events</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-200 mb-2">Legal Authorities</h4>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Retention</h2>
            <p className="text-gray-700 mb-6">
              We retain your Personal Information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">5</div>
              <h2 className="text-xl font-bold text-gray-900">Your Rights and Choices</h2>
              <h2 className="text-xl font-bold text-slate-200">Your Rights and Choices</h2>
            </div>
            <p className="text-slate-400 mb-4 pl-11">
              You have the right to:
            </p>
            <div className="grid md:grid-cols-2 gap-3 pl-11 mb-6">
              {['Access your Personal Information', 'Correct inaccurate or incomplete information', 'Request deletion of your data', 'Withdraw consent for data processing', 'Object to certain processing activities'].map((right, index) => (
                <div key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-400">{right}</span>
                </div>
              ))}
            </div>
            <p className="text-slate-400">
              To exercise these rights, please contact us at <a href="mailto:office@ifes.in" className="text-blue-600 hover:underline">office@ifes.in</a>
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">6</div>
              <h2 className="text-xl font-bold text-slate-200">International Data Transfers</h2>
            </div>
            <p className="text-slate-400 pl-11">
              Your information may be transferred to and processed in countries other than your own. We implement appropriate safeguards to protect your data in accordance with applicable laws.
            </p>
          </section>

          <section className="mb-10 bg-amber-50 p-6 rounded-lg border border-amber-100">
            <div className="flex items-center mb-3">
              <div className="bg-amber-100 text-amber-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">7</div>
              <h2 className="text-xl font-bold text-slate-200">Children's Privacy</h2>
            </div>
            <p className="text-slate-400 pl-11">
              Our services are not intended for children under 10 years of age. We do not knowingly collect personal information from children under 10. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">8</div>
              <h2 className="text-xl font-bold text-slate-200">Security</h2>
            </div>
            <p className="text-slate-400 pl-11">
              We implement appropriate security measures to protect your Personal Information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">9</div>
              <h2 className="text-xl font-bold text-slate-200">Changes to This Policy</h2>
            </div>
            <p className="text-slate-400 pl-11">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>

          <section className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500/20 text-blue-300 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">10</div>
              <h2 className="text-xl font-bold text-slate-200">Contact Us</h2>
            </div>
            <p className="text-slate-400 pl-11">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:office@ifes.in" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">office@ifes.in</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyView;
