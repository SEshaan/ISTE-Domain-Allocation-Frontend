import { useAppSelector } from '../../../app/hooks';
import Header from '../../../components/header';
import { useNavigate } from 'react-router-dom';
import { getDomainColor, getReadableTextColor } from '../../../utils/domainUI';

export default function QuestionsTasks() {
  const navigate = useNavigate();
  const { selectedDomains } = useAppSelector((s) => s.domain);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <Header title="Tasks" theme="dark" />

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        {selectedDomains.map((domain) => {
          const color = getDomainColor(domain.name);
          const textColor = getReadableTextColor(color);

          return (
            <section key={domain.id} className="space-y-10">

              {/* DOMAIN TITLE BLOCK */}
              <div
                className="rounded-2xl px-10 py-10 flex items-center justify-center text-center"
                style={{ background: color }}
              >
                <h2
                  className="text-4xl md:text-6xl font-extrabold tracking-widest"
                  style={{ color: textColor }}
                >
                  {domain.name.toUpperCase()}
                </h2>
              </div>

              {/* CARDS */}
              <div className="flex flex-col md:flex-row gap-8">

                {/* QUESTIONS CARD */}
                <div
                  onClick={() => navigate(`/questions?domain=${domain.id}`)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl 
                             p-12 cursor-pointer transition 
                             hover:scale-[1.02] hover:border-white"
                >
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">
                    QUESTIONS
                  </h3>

                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Solve conceptual and technical problems designed
                    to test your understanding and depth.
                  </p>

                  <div className="mt-10 text-5xl opacity-20">
                    ?
                  </div>
                </div>

                {/* TASKS CARD */}
                <div
                  onClick={() => navigate(`/tasks?domain=${domain.id}`)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl 
                             p-12 cursor-pointer transition 
                             hover:scale-[1.02] hover:border-white"
                >
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">
                    TASKS
                  </h3>

                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Build, implement, and submit practical work
                    to demonstrate applied skills.
                  </p>

                  <div className="mt-10 text-5xl opacity-20">
                    ✓
                  </div>
                </div>

              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
