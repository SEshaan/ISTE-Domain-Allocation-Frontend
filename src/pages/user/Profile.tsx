import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Header from '../../components/header'
import { updateProfile } from '../../features/authSlice'
import { getDomainColor, getReadableTextColor } from '../../utils/domainUI';
import { useNavigate } from 'react-router-dom';


const GITHUB_REGEX =
  /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/;

const LEETCODE_REGEX =
  /^https?:\/\/(www\.)?leetcode\.com\/u\/[A-Za-z0-9_-]+\/?$/;

const isValidGithub = (url: string) => GITHUB_REGEX.test(url);
const isValidLeetcode = (url: string) => LEETCODE_REGEX.test(url);

const extractUsername = (url: string) =>
  url.split('/').filter(Boolean).pop();

type GithubData = {
  login: string;
  avatar_url: string;
  name: string;
  public_repos: number;
  html_url: string;
};



function Profile() {
  const dispatch = useAppDispatch()
  const { user, profileComplete } = useAppSelector(state => state.auth)

  const [githubData, setGithubData] = useState<GithubData | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  const navigate = useNavigate();


  const fetchGithubPreview = async (url: string) => {
    if (!url) {
      setGithubData(null);
      setGithubError(null);
      return;
    }

    if (!isValidGithub(url)) {
      setGithubData(null);
      setGithubError("Invalid GitHub URL");
      return;
    }

    const username = extractUsername(url);
    if (!username) return;

    try {
      setGithubLoading(true);
      setGithubError(null);

      const res = await fetch(`https://api.github.com/users/${username}`);

      if (!res.ok) {
        throw new Error("GitHub user not found");
      }

      const data = await res.json();
      setGithubData(data);
    } catch (err: any) {
      setGithubData(null);
      setGithubError(err.message || "Something went wrong");
    } finally {
      setGithubLoading(false);
    }
  };





  const [form, setForm] = useState({
    name: '',
    email: '',
    regNo: '',
    branch: '',
    githubLink: '',
    leetcodeLink: '',
    portfolioLink: '',
    selectedDomainIds: [] as string[],
  })

  useEffect(() => {
    if (user) {
      console.log(user);
      
      setForm({
        name: user.name,
        email: user.email,
        regNo: user.regNo,
        branch: user.branch,
        githubLink: user.githubLink,
        leetcodeLink: user.leetcodeLink,
        portfolioLink: user.portfolioLink || '',
        selectedDomainIds: user.selectedDomainIds,
      })
    }
  }, [user])

  const handleSave = () => {
    dispatch(updateProfile(form))
  }

  return (
    <div className="bg-primary min-h-screen text-zinc-100">
      <Header title="Profile" />

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">



        {/* ================= DETAILS ================= */}
        <section className="bg-black border border-zinc-700 rounded-2xl p-12">
          <h2 className="text-5xl text-left font-extrabold tracking-widest text-zinc-300 mb-8">
            DETAILS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['Full Name', 'name'],
              ['Email', 'email'],
              ['Registration No', 'regNo'],
              ['Branch', 'branch'],
            ].map(([label, key]) => (
              <div key={key} className="text-left">
                <p className="text-zinc-400 text-lg mb-2">{label}</p>
                <input
                  className="w-full px-4 py-4 rounded-lg bg-zinc-900 border border-zinc-700
                           placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder={label}
                  value={(form as any)[key]}
                  onChange={e =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================= PROFILES ================= */}
        <section className="bg-black border border-zinc-700 rounded-2xl p-12">
          <h2 className="text-5xl text-left font-extrabold tracking-widest text-zinc-300 mb-8">
            PROFILES
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* INPUTS */}
            <div className="space-y-4">
              <div>
                <h1 className='text-xl text-left mb-4'>Github Profile</h1>
                <input
                  className="w-full px-4 py-4 rounded-lg bg-zinc-900 border border-zinc-700
                         placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="GitHub Profile URL"
                  value={form.githubLink}
                  onChange={e =>
                    setForm({ ...form, githubLink: e.target.value })
                  }
                  onBlur={() => fetchGithubPreview(form.githubLink)}
                />
              </div>
              <div>
                <h1 className='text-xl text-left mb-4'>Leetcode Profile</h1>
                <input
                  className="w-full px-4 py-4 rounded-lg bg-zinc-900 border border-zinc-700
                         placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="LeetCode Profile URL"
                  value={form.leetcodeLink}
                  onChange={e =>
                    setForm({ ...form, leetcodeLink: e.target.value })
                  }
                />
              </div>
              <div>
                <h1 className='text-xl text-left mb-4'>Portfolio Website</h1>
                <input
                  className="w-full px-4 py-4 rounded-lg bg-zinc-900 border border-zinc-700
                         placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Portfolio Website URL"
                  value={form.portfolioLink}
                  onChange={e =>
                    setForm({ ...form, portfolioLink: e.target.value })
                  }

                />
              </div>
            </div>

            {/* PREVIEWS */}
            <div className="grid grid-cols-1 h-full gap-4">
              {/* GITHUB */}
              {githubData ? (
                <a
                  href={githubData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:col-span-2 rounded-2xl border border-white bg-zinc-900
               flex items-center justify-between gap-8 px-10 py-8
               hover:bg-zinc-800 transition"
                >
                  <div className="flex items-center gap-6">
                    <img
                      src={githubData.avatar_url}
                      alt={githubData.login}
                      className="h-20 w-20 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm text-zinc-400">GitHub</p>
                      <p className="text-2xl font-bold">{githubData.login}</p>
                      <p className="text-sm text-zinc-500">
                        {githubData.public_repos} public repositories
                      </p>
                    </div>
                  </div>

                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-70"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              ) : (
                <div className="md:col-span-2 h-32 rounded-2xl border border-dashed border-zinc-600
      flex items-center justify-center text-zinc-500 text-sm">
                  Enter a valid GitHub profile URL
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= DOMAINS ================= */}
        <section className="bg-black border border-zinc-700 rounded-2xl p-12">
          <h2 className="text-5xl text-left font-extrabold tracking-widest text-zinc-300 mb-12">
            DOMAINS
          </h2>
          {form.selectedDomainIds.length === 0 ? (
            <div className="h-40 rounded-2xl border-2 border-dashed border-zinc-700
      flex items-center justify-center text-zinc-500 text-lg">
              No domains selected
            </div>
          ) : (
            <div className="flex flex-wrap justify-evenly">
              {form.selectedDomainIds.map(id => {
                const color = getDomainColor(id);

                const textColor = getReadableTextColor(color);
                console.log(color, textColor, id);

                return (
                  <div
                    key={id}
                    className="w-40 h-40 md:w-80 md:h-80 rounded-2xl
                       flex items-center justify-center text-center font-bold"
                    style={{ background: color }}
                  >
                    <span
                      className="px-4 text-2xl md:text-4xl"
                      style={{ color: textColor }}
                    >
                      {id.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SAVE */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-14 py-4 rounded-xl text-black
                     font-extrabold tracking-widest
                     hover:scale-[1.02] transition ml-4"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="px-14 py-4 rounded-xl bg-black text-white
                     font-extrabold tracking-widest
                     hover:scale-[1.02] transition"
          >
            SAVE PROFILE
          </button>
        </div>
      </div>
    </div>
  )

}


export default Profile
