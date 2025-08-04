
import React, { useState, useEffect } from 'react';
import StaffLogin from '../components/StaffLogin';

// NOTE: In a real-world scenario, this data would be fetched from a secure,
// HIPAA-compliant backend, not from localStorage.
const SUBMISSIONS_KEY = 'insuranceSubmissions';

interface Submission {
    submissionId: number;
    submittedAt: string;
    patientData: {
        name: string;
        dob: string;
        provider: string;
        policyId: string;
    };
    verificationResult: {
        status: string;
        planName: string;
        coverageSummary: string;
        nextSteps: string;
    };
}

const StaffDashboardPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        if (isAuthenticated) {
            try {
                const storedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);
                if (storedSubmissions) {
                    setSubmissions(JSON.parse(storedSubmissions).reverse()); // Show newest first
                }
            } catch (error) {
                console.error("Failed to parse submissions from localStorage", error);
                setSubmissions([]);
            }
        }
    }, [isAuthenticated]);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const handleClearSubmissions = () => {
        if(window.confirm("Are you sure you want to delete all submission records? This action cannot be undone.")){
            localStorage.removeItem(SUBMISSIONS_KEY);
            setSubmissions([]);
        }
    };

    if (!isAuthenticated) {
        return <StaffLogin onLoginSuccess={handleLoginSuccess} />;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'Review Needed': return 'bg-amber-100 text-amber-800';
            case 'Plan Not Found': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    }

    return (
        <div className="bg-white min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Staff Dashboard</h1>
                        <p className="text-slate-600 mt-1">Review of AI Insurance Verifications</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleClearSubmissions}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Clear All Records
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        {submissions.length > 0 ? (
                            <table className="w-full text-sm text-left text-slate-600">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Submitted</th>
                                        <th scope="col" className="px-6 py-3">Patient Name</th>
                                        <th scope="col" className="px-6 py-3">DOB</th>
                                        <th scope="col" className="px-6 py-3">Provider (Policy ID)</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub) => (
                                        <tr key={sub.submissionId} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                                            <td className="px-6 py-4">{new Date(sub.submittedAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 font-semibold text-slate-800">{sub.patientData.name}</td>
                                            <td className="px-6 py-4">{sub.patientData.dob}</td>
                                            <td className="px-6 py-4">
                                                <div>{sub.patientData.provider}</div>
                                                <div className="text-xs text-slate-500">{sub.patientData.policyId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.verificationResult.status)}`}>
                                                    {sub.verificationResult.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 max-w-sm">
                                                <details>
                                                    <summary className="cursor-pointer font-medium text-sky-600">View</summary>
                                                    <div className="mt-2 p-3 bg-slate-100 rounded-md space-y-2 text-xs">
                                                        <p><strong>Plan:</strong> {sub.verificationResult.planName}</p>
                                                        <p><strong>Summary:</strong> {sub.verificationResult.coverageSummary}</p>
                                                        <p><strong>Next Steps:</strong> {sub.verificationResult.nextSteps}</p>
                                                    </div>
                                                </details>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center p-12">
                                <h3 className="text-xl font-semibold text-slate-700">No Submissions Yet</h3>
                                <p className="mt-2 text-slate-500">When users complete an insurance verification, their submissions will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 p-4 text-sm bg-amber-100 text-amber-800 rounded-lg border border-amber-200">
                    <p><strong>Plans for this portal:</strong> HIPAA-compliant application, all Protected Health Information (PHI) would be managed through a secure backend server with encrypted databases and strict access controls, not browser localStorage.</p>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboardPage;
