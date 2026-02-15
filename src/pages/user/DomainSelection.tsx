import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  toggleDraftDomain,
  resetDraft,
  setSelectedDomains,
} from '../../features/domainSlice';
import { getDomainColor, getReadableTextColor } from '../../utils/domainUI';
import { updateProfile } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, i) => val === sortedB[i]);
}

export default function EditDomains() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { domainList, draftDomains, selectedDomains } =
    useAppSelector(state => state.domain);

  const hasChanges = !arraysEqual(
    draftDomains.map(d => d.id),
    selectedDomains.map(d => d.id)
  );

  const handleConfirm = async () => {
    const confirmReset = window.confirm(
      'Changing your domains will reset your previous progress. Do you want to continue?'
    );

    if (!confirmReset) return;

    await dispatch(
      updateProfile({
        selectedDomainIds: draftDomains.map(d => d.id),
      })
    );

    // sync selectedDomains with draft
    dispatch(setSelectedDomains(draftDomains));

    navigate('/dashboard');
  };

  const renderSlot = (domain?: typeof draftDomains[0]) => {
    if (!domain) {
      return (
        <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-zinc-600 flex items-center justify-center text-zinc-500 md:w-80 md:h-80">
          Empty
        </div>
      );
    }

    const color = getDomainColor(domain.name);
    const textColor = getReadableTextColor(color);

    return (
      <div
        className="w-40 h-40 relative rounded-2xl flex items-center justify-center text-center font-bold md:w-80 md:h-80"
        style={{ background: color }}
      >
        <button
          onClick={() => dispatch(toggleDraftDomain(domain))}
          className="absolute top-3 right-3"
          style={{ color: textColor + 'aa' }}
        >
          ✕
        </button>

        <span className="px-4 text-2xl md:text-4xl" style={{ color: textColor }}>
          {domain.name}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <Header title='Domains' theme='dark'/>
      <div className="max-w-6xl mx-auto space-y-12">

        {/* SELECTED DOMAINS */}
        <div className="flex flex-col items-center justify-center ">
          <h2 className="text-5xl font-bold mb-16 tracking-wide">
            Selected Domains
          </h2>

          <div className="flex flex-row items-center gap-12 justify-center md:flex-row">
            {renderSlot(draftDomains[0])}
            <span className="text-7xl font-thin text-zinc-500">+</span>
            {renderSlot(draftDomains[1])}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col justify-center items-center pt-6 gap-8">
          <button
            disabled={!hasChanges}
            onClick={handleConfirm}
            className={`px-10 py-4 rounded-xl font-extrabold tracking-wide transition
              ${
                hasChanges
                  ? 'bg-white text-black hover:scale-[1.02]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
          >
            Confirm & Save
          </button>

          <button
            onClick={() => {
              dispatch(resetDraft());
              navigate('/dashboard');
            }}
            className="text-zinc-400 hover:text-white"
          >
            Cancel
          </button>

        </div>

        {/* ALL DOMAINS */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-16">
            {domainList.map(domain => {
              const active = draftDomains.some(d => d.id === domain.id);
              const disabled = !active && draftDomains.length >= 2;

              const color = getDomainColor(domain.name);
              const textColor = getReadableTextColor(color);

              return (
                <button
                  key={domain.id}
                  disabled={disabled}
                  onClick={() => dispatch(toggleDraftDomain(domain))}
                  style={
                    active
                      ? { background: color, color: textColor, borderColor: color }
                      : undefined
                  }
                  className={`relative aspect-square rounded-2xl p-4 text-center font-bold transition border
                    ${
                      active
                        ? 'border-white'
                        : disabled
                        ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
                        : 'bg-zinc-900 border-zinc-700 hover:border-white'
                    }`}
                >
                  <div className="flex h-full items-center justify-center text-2xl font-regular">
                    {domain.name}
                  </div>

                </button>
              );
            })}
          </div>
        </div>

        

      </div>
    </div>
  );
}
