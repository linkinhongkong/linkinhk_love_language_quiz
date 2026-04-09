// ============================================================
// app.js — main Dashboard component, routing, header, bottom nav, mount
// ============================================================

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("match");
  const [profileSubTab, setProfileSubTab] = useState("me");

  // ---------------- Hash routing ----------------
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (TAB_IDS.includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab("match");
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // ---------------- Fetch profile on load ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authenticatedFetch(API.GET_PROFILE, {
          method: "POST",
          body: JSON.stringify({})
        });

        const data = await res.json();

        if (data.success && data.profile) {
          setProfile(data.profile);
        } else {
          setError(data.error || "載入失敗");
        }
      } catch (err) {
        // authenticatedFetch already handles 401 redirects
        if (err.message !== "Unauthorized" && err.message !== "No token") {
          console.error(err);
          setError("網絡連線錯誤");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const changeTab = (tabId) => {
    window.location.hash = tabId;
  };

  const handleLogout = () => {
    clearAuth();
    redirectToLogin();
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src="/logo.png" alt="Link in HK" className="h-7 w-auto" />
          <div className="text-xs text-stone-500 truncate ml-3">
            {profile?.email}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === "match" && <MatchTab profile={profile} />}
        {activeTab === "events" && <EventsTab profile={profile} />}
        {activeTab === "history" && <HistoryTab profile={profile} />}
        {activeTab === "profile" && (
          <ProfileTab
            profile={profile}
            subTab={profileSubTab}
            setSubTab={setProfileSubTab}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-20">
        <div className="max-w-2xl mx-auto flex justify-around">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => changeTab(id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 transition ${
                activeTab === id ? "text-stone-900" : "text-stone-400"
              }`}
            >
              <Icon className="w-6 h-6 mb-0.5" />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Dashboard />);
