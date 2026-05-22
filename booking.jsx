// Booking modal — multi-step: form → confirm
const { useState, useEffect, useMemo } = React;

function BookingModal({ open, onClose, copy, palette }) {
  const [step, setStep] = useState("form"); // form | done
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState("");
  const [anon, setAnon] = useState(false);
  const [dayIdx, setDayIdx] = useState(1);
  const [time, setTime] = useState(null);

  // Reset when reopened
  useEffect(() => {
    if (open) {
      setStep("form");
      setTime(null);
    }
  }, [open]);

  // Generate next 14 weekdays
  const days = useMemo(() => {
    const out = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    let i = 0;
    while (out.length < 14) {
      const x = new Date(d);
      x.setDate(d.getDate() + i);
      const dow = x.getDay();
      if (dow !== 0 && dow !== 6) {
        out.push(x);
      }
      i++;
    }
    return out;
  }, []);

  const times = useMemo(
    () => ({
      morning: ["09:30", "10:30", "11:30"],
      afternoon: ["13:00", "14:00", "15:00", "16:00"],
    }),
    []
  );

  // Pretend some are taken for realism
  const takenKeys = useMemo(() => {
    const set = new Set();
    days.forEach((d, di) => {
      // hash-ish; mark ~1-2 as taken per day
      const key = d.getDate();
      if (key % 3 === 0) set.add(`${di}-10:30`);
      if (key % 4 === 0) set.add(`${di}-14:00`);
      if (key % 5 === 0) set.add(`${di}-16:00`);
      if (key % 7 === 0) set.add(`${di}-09:30`);
    });
    return set;
  }, [days]);

  const selectedDay = days[dayIdx];
  const canSubmit = (anon || (name.trim() && contact.trim())) && time;

  if (!open) return null;

  const fmtDay = (d) =>
    d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  const fmtLongDay = (d) =>
    d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {step === "form" && (
          <div className="modal-form">
            <div className="modal-header">
              <div className="kicker">— {copy.booking.title}</div>
              <h2 className="modal-title">{copy.booking.sub}</h2>
            </div>

            <div className="form-row">
              <label className="form-label">
                <span>{copy.booking.date}</span>
              </label>
              <div className="date-strip">
                {days.map((d, i) => (
                  <button
                    key={i}
                    className={"date-chip" + (i === dayIdx ? " active" : "")}
                    onClick={() => {
                      setDayIdx(i);
                      setTime(null);
                    }}
                  >
                    <span className="dc-dow">
                      {d.toLocaleDateString(undefined, { weekday: "short" })}
                    </span>
                    <span className="dc-day">{d.getDate()}</span>
                    <span className="dc-mon">
                      {d.toLocaleDateString(undefined, { month: "short" })}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">
                <span>{copy.booking.time}</span>
                <span className="form-meta">{fmtLongDay(selectedDay)}</span>
              </label>
              <div className="time-grid">
                <div className="time-group">
                  <div className="time-label">{copy.booking.morning}</div>
                  <div className="time-row">
                    {times.morning.map((t) => {
                      const taken = takenKeys.has(`${dayIdx}-${t}`);
                      return (
                        <button
                          key={t}
                          disabled={taken}
                          className={"time-chip" + (time === t ? " active" : "") + (taken ? " taken" : "")}
                          onClick={() => setTime(t)}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="time-group">
                  <div className="time-label">{copy.booking.afternoon}</div>
                  <div className="time-row">
                    {times.afternoon.map((t) => {
                      const taken = takenKeys.has(`${dayIdx}-${t}`);
                      return (
                        <button
                          key={t}
                          disabled={taken}
                          className={"time-chip" + (time === t ? " active" : "") + (taken ? " taken" : "")}
                          onClick={() => setTime(t)}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className={"form-grid" + (anon ? " anon" : "")}>
              <div className="form-row">
                <label className="form-label">
                  <span>{copy.booking.name}</span>
                </label>
                <input
                  className="form-input"
                  placeholder={copy.booking.namePh}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={anon}
                />
              </div>
              <div className="form-row">
                <label className="form-label">
                  <span>{copy.booking.contact}</span>
                </label>
                <input
                  className="form-input"
                  placeholder={copy.booking.contactPh}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  disabled={anon}
                />
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">
                <span>{copy.booking.topic}</span>
                <span className="form-meta">{copy.booking.topicOpt}</span>
              </label>
              <textarea
                className="form-input form-textarea"
                placeholder={copy.booking.topicPh}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={2}
              />
            </div>

            <div className="form-foot">
              <label className="anon-toggle">
                <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
                <span className="anon-box">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="anon-text">
                  {copy.booking.anon}
                  {anon && <em className="anon-note"> · {copy.booking.anonNote}</em>}
                </span>
              </label>

              <button
                className={"btn btn-primary" + (canSubmit ? "" : " btn-disabled")}
                disabled={!canSubmit}
                onClick={() => setStep("done")}
              >
                {copy.booking.submit}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="modal-confirm">
            <div className="confirm-mark">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <path d="M8 14.5L12 18.5L20 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="modal-title">{copy.booking.confirmTitle}</h2>
            <div className="confirm-card">
              <div className="confirm-row">
                <div className="confirm-k">Date</div>
                <div className="confirm-v">{fmtLongDay(selectedDay)}</div>
              </div>
              <div className="confirm-row">
                <div className="confirm-k">Time</div>
                <div className="confirm-v">{time} · 50 min</div>
              </div>
              <div className="confirm-row">
                <div className="confirm-k">With</div>
                <div className="confirm-v">Shakhnoza Amreeva</div>
              </div>
              {!anon && (
                <div className="confirm-row">
                  <div className="confirm-k">For</div>
                  <div className="confirm-v">{name}</div>
                </div>
              )}
            </div>
            <p className="confirm-meta">
              {copy.booking.confirmBody}{" "}
              <em>tomorrow, 5pm</em>. {copy.booking.confirmMeta}{" "}
              <a href="#" className="link">@Shakhnoza_TEAM</a>.
            </p>
            <button className="btn btn-primary" onClick={onClose}>{copy.booking.confirmClose}</button>
          </div>
        )}
      </div>
    </div>
  );
}

window.BookingModal = BookingModal;
