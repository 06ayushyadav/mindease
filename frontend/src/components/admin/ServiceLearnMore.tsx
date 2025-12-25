import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function MindEaseServices() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-slate-800">
      <div className="p-5">
        <Link to={`/`}>
      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-full">👈 Back to home page</Button>
      </Link>
      </div>
      <header className="max-w-5xl mx-auto text-center  px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">
          Services Related to Mind Health on MindEase
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          We provide <span className="font-semibold text-indigo-600">online therapy</span>,
          <span className="font-semibold text-indigo-600"> AI-driven emotional guidance</span>, and
          <span className="font-semibold text-indigo-600"> mindfulness resources</span> designed
          to help you maintain balance, peace, and mental well-being.
        </p>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-indigo-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-700">
            1. Online Counseling & Therapy
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            MindEase connects you with certified mental health professionals who offer therapy
            sessions through secure text, audio, or video. Whether it’s anxiety, depression, or
            everyday stress — we ensure you receive compassionate, confidential support from
            wherever you are.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-indigo-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-700">
            2. AI-Driven Emotional Guidance
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Our AI chatbot offers instant, 24×7 emotional support to help you manage difficult
            moments. It listens, guides, and suggests coping techniques — anytime you need a safe
            space to talk.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-indigo-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-700">
            3. Mindfulness & Self-Help Tools
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Explore guided meditations, breathing exercises, and daily affirmations to build
            resilience and inner calm. MindEase helps you cultivate self-awareness and emotional
            balance at your own pace.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-indigo-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-700">
            4. Mood Tracking & Journaling
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Track your emotions daily, write reflections, and gain insights into your mood
            patterns. Our tools help you understand your triggers and progress on your mental
            health journey.
          </p>
        </div>

        {/* SUPPORT */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-indigo-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-700">
            5. Community & Group Support
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Join group therapy sessions or supportive communities where you can share experiences,
            learn from others, and realize you’re not alone in your journey toward healing.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-indigo-100 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-indigo-700">
            6. Crisis & Emergency Support
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            In urgent situations, MindEase provides verified helplines and connects you to
            immediate professional support — because every moment matters.
          </p>
        </div>
      </main>

      
    </div>
  );
}
