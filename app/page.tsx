'use client';

import UrlInput from '@/components/UrlInput';
import { Search, Zap, FileText, BarChart3, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-cyan-600/10 blur-[80px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-blue-400 text-sm font-medium"
        >
          <Zap className="w-4 h-4" />
          <span>Next-Gen AI SEO Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8 tracking-tight max-w-4xl mx-auto"
        >
          Dominate Search with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
            AI-Powered Precision
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Stop guessing. Start ranking. Our advanced AI scans your entire architecture,
          detects hidden bottlenecks, and generates code-ready fixes in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-black/50 backdrop-blur-xl rounded-xl p-2 border border-white/10">
            <UrlInput />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-sm text-gray-500"
        >
          No credit card required • Instant Analysis • Enterprise Grade
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 py-32 border-t border-white/5 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why SEO Pulse AI?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We don't just list problems. We provide the intelligence to fix them.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Deep Scan Technology",
                desc: "Analyzes HTML structure, meta tags, and content hierarchy with surgical precision.",
                color: "blue"
              },
              {
                icon: Zap,
                title: "AI-Generated Fixes",
                desc: "Don't just see the error. Get the exact code snippet to fix it instantly.",
                color: "purple"
              },
              {
                icon: BarChart3,
                title: "Competitor Benchmarking",
                desc: "See how your metrics stack up against industry standards and top performers.",
                color: "cyan"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Bank-grade encryption and privacy. Your data never leaves our secure sandbox.",
                color: "green"
              },
              {
                icon: Globe,
                title: "Global SEO Support",
                desc: "Optimized for international SEO, supporting multi-language and regional targeting.",
                color: "orange"
              },
              {
                icon: FileText,
                title: "PDF Reporting",
                desc: "Generate white-label reports for your team or clients in a single click.",
                color: "pink"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
