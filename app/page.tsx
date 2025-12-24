import UrlInput from '@/components/UrlInput';
import { Search, Zap, FileText } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
          <Zap className="w-4 h-4" />
          <span>AI-Powered SEO Audit</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          SEO Audit in <span className="text-blue-600">30 Seconds</span>
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Instantly analyze your website's on-page SEO. Get actionable, AI-generated fixes to rank higher and drive more traffic.
        </p>

        <UrlInput />

        <p className="mt-6 text-sm text-gray-400">
          Free tool. No sign-up required.
        </p>
      </div>

      {/* How it works */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Enter URL</h3>
              <p className="text-gray-600">Paste your website URL. We support any public webpage.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">Our system scans your code and uses AI to find optimization opportunities.</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Get Results</h3>
              <p className="text-gray-600">Receive a score, detailed issues list, and a step-by-step fix checklist.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
