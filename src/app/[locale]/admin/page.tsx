export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldAlert, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default async function AdminDashboard() {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;
  
  if (!userId) {
    redirect('/');
  }

  // NOTE: In production, check db if user.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-semibold mb-3">
            <ShieldAlert className="h-3.5 w-3.5" />
            Admin Oversight
          </div>
          <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform analytics, tutor approvals, and operational logs.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
            <p className="text-sm font-medium text-gray-500 mb-1">Active Tutors</p>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Applications</p>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500">
            <p className="text-sm font-medium text-gray-500 mb-1">Monthly MRR</p>
            <h3 className="text-2xl font-bold text-gray-900">$0.00</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            Recent Tutor Applications
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                    No pending applications at this time.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
