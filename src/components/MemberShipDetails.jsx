import { CheckCircle } from 'lucide-react'
import React from 'react'

const MemberShipDetails = ({ setpage }) => {
    return (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="p-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Membership Plan</h2>
                    <p className="text-blue-400 font-semibold mt-1">Student Basic</p>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                        <span className="text-slate-400">Duration</span>
                        <span className="text-white font-medium">1 Year</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                        <span className="text-slate-400">Membership Fee</span>
                        <span className="text-white font-medium">$10 USD</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-700">
                        <span className="text-slate-400">Shipping</span>
                        <span className="text-green-400 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b-2 border-blue-500 mb-4">
                        <span className="text-white font-bold">Total Amount</span>
                        <span className="text-white font-bold">$10 USD</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg mb-6">
                    <h3 className="text-white font-semibold mb-3">What's Included:</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center text-slate-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            WORSO Digital Certificate & ID
                        </li>
                        <li className="flex items-center text-slate-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            Student Directory Listing
                        </li>
                        <li className="flex items-center text-slate-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            Discounted DIY Kits Access
                        </li>
                    </ul>
                </div>


            </div>
        </div>
    )
}

export default MemberShipDetails