import React, { useMemo, useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';
import { money, products, olfactoryFamilies } from './data';

/* --------------------------------------------------------------------------
   Shared Icons & Visual Assets
   -------------------------------------------------------------------------- */

const Icon = ({ children, className = 'ic', viewBox = '0 0 24 24' }) => (
  <svg className={className} viewBox={viewBox} aria-hidden="true">
    {children}
  </svg>
);

const Flame = () => (
  <img className="brand-logo" src="/fine-drops-logo.jpg" alt="Fine Drops" />
);

function BottleArt({ product }) {
  if (!product) return null;
  const shapes = {
    0: <rect x="24" y="42" width="52" height="80" rx="6" />,
    1: <circle cx="50" cy="84" r="37" />,
    2: <rect x="32" y="32" width="36" height="90" rx="4" />,
    3: <rect x="20" y="50" width="60" height="72" rx="4" />,
    4: <path d="M30 44h40l8 12v60a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V56z" />
  };
  const shape = shapes[product.sh] || shapes[0];
  const top = { 0: 42, 1: 47, 2: 32, 3: 50, 4: 44 }[product.sh] || 42;
  const center = { 0: 84, 1: 84, 2: 80, 3: 90, 4: 90 }[product.sh] || 84;
  const glass = product.sh === 1 ? '#d4af37' : '#241a16';

  return (
    <svg className="bottle-art" viewBox="0 0 100 130" role="img" aria-label={`${product.n} bottle`}>
      <defs>
        <linearGradient id={`l${product.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={product.col || '#1b1b24'} />
          <stop offset="1" stopColor="#000" stopOpacity=".75" />
        </linearGradient>
        <linearGradient id={`h${product.id}`} x1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".3" stopColor="#fff" stopOpacity="0" />
          <stop offset=".85" stopColor="#fff" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="124" rx="34" ry="3.5" fill="#241a16" opacity=".25" />
      <rect x="40" y={top - 24} width="20" height="16" rx="2" fill={glass} />
      <rect x="44" y={top - 9} width="12" height="9" fill="#d4af37" />
      <g fill={`url(#l${product.id})`} stroke="#fffaf0" strokeOpacity=".7" strokeWidth="1.6">
        {shape}
      </g>
      <g fill={`url(#h${product.id})`}>{shape}</g>
      <rect x="31" y={center - 11} width="38" height="22" rx="2" fill="#f3ebdd" fillOpacity=".92" stroke="#d4af37" strokeWidth=".5" />
      <text
        x="50"
        y={center + 2}
        textAnchor="middle"
        fontSize={product.lb.length > 6 ? 5 : 6.5}
        fontFamily="Cormorant Garamond,serif"
        fill="#241a16"
        letterSpacing=".8"
      >
        {product.lb}
      </text>
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Scroll-To-Hash Utility Helper
   -------------------------------------------------------------------------- */

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

/* --------------------------------------------------------------------------
   Toast Notifications
   -------------------------------------------------------------------------- */

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div className="toast" key={toast.id}>
          <span className="toast-icon">✦</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Top Announcement Bar & Header
   -------------------------------------------------------------------------- */

function TopBar({ onAccount }) {
  return (
    <div className="top">
      <span className="l">
        <b>✦</b> Complimentary shipping on orders above ₹799 <span className="top-separator">/</span> 100% Authentic Fine Fragrances
      </span>
      <span className="r">
        <a href="#track" onClick={(e) => { e.preventDefault(); onAccount('track'); }}>Track Order</a>
        <a href="#about">Heritage</a>
        <Link to="/admin/login" className="top-admin-badge" title="Fine Drops Admin Studio Portal">
          <Icon className="ic" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </Icon>
          Admin Portal
        </Link>
      </span>
    </div>
  );
}

function Header({ count, wishlistCount, onBag, onMenu, onAccount }) {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
      const searchInput = document.getElementById('catalogue-search-input');
      if (searchInput) searchInput.focus();
    } else {
      navigate('/#shop');
    }
  };

  return (
    <>
      <TopBar onAccount={onAccount} />
      <header>
        <Link className="logo" to="/" aria-label="Fine Drops Home">
          <span className="logo-mark"><Flame /></span>
          <span className="wordmark">
            <span>FINE DROPS</span>
            <small>BEYOND THE SENSES</small>
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <Link to="/">Home</Link>
          <a href="/#shop">Collection</a>
          <a href="/#about">Point of View</a>
          <a href="/#trust">Authenticity</a>
          <a href="/#contact">Contact</a>
        </nav>

        <div className="icons">
          <button aria-label="Search Fragrances" onClick={handleSearchClick} title="Search Collection">
            <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
          </button>

          <button aria-label="Saved Wishlist" onClick={() => onAccount('wishlist')} title="View Wishlist">
            <Icon><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z" /></Icon>
            {wishlistCount > 0 && <span className="wishlist-counter-badge">{wishlistCount}</span>}
          </button>

          <button aria-label="Account & Portals" onClick={() => onAccount('choose')} title="Account & Admin Studio">
            <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 15-5 16 0" /></Icon>
          </button>

          <button className="cartb" aria-label="Shopping Bag" onClick={onBag} title="View Bag">
            <Icon><path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0" /></Icon>
            {count > 0 && <span className="cnt">{count}</span>}
          </button>

          <button className="burger" aria-label="Open Mobile Menu" onClick={onMenu}>
            <Icon><path d="M4 7h16M4 12h16M4 17h16" /></Icon>
          </button>
        </div>
      </header>
    </>
  );
}

/* --------------------------------------------------------------------------
   Mobile Bottom Dock Navigation (Phone screens <= 768px)
   -------------------------------------------------------------------------- */

function MobileBottomDock({ count, wishlistCount, onBag, onAccount, onQuiz }) {
  const navigate = useNavigate();

  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile Bottom Navigation">
      <button className="dock-item" onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <Icon><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Icon>
        <span>Home</span>
      </button>

      <button className="dock-item" onClick={() => {
        const shop = document.getElementById('shop');
        if (shop) shop.scrollIntoView({ behavior: 'smooth' });
        else navigate('/#shop');
      }}>
        <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
        <span>Search</span>
      </button>

      <button className="dock-item" onClick={() => onAccount('wishlist')}>
        <Icon><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z" /></Icon>
        <span>Wishlist</span>
        {wishlistCount > 0 && <span className="dock-badge gold">{wishlistCount}</span>}
      </button>

      <button className="dock-item" onClick={onBag}>
        <Icon><path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0" /></Icon>
        <span>Bag</span>
        {count > 0 && <span className="dock-badge">{count}</span>}
      </button>

      <button className="dock-item admin-dock" onClick={() => onAccount('admin')}>
        <Icon viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </Icon>
        <span>Admin</span>
      </button>
    </nav>
  );
}

/* --------------------------------------------------------------------------
   Mobile Menu Drawer Component
   -------------------------------------------------------------------------- */

function MobileMenu({ onClose, onAccount, onQuiz }) {
  const navigate = useNavigate();

  const handleNav = (target) => {
    onClose();
    if (target.startsWith('#')) {
      const el = document.getElementById(target.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(target);
    }
  };

  return (
    <div className="ov open dr" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mobile-menu-drawer">
        <button className="x" onClick={onClose} aria-label="Close menu">×</button>

        <div className="mobile-menu-header">
          <Link className="logo" to="/" onClick={onClose}>
            <span className="logo-mark"><Flame /></span>
            <span className="wordmark">
              <span>FINE DROPS</span>
              <small>BEYOND THE SENSES</small>
            </span>
          </Link>
        </div>

        <div className="mobile-menu-links">
          <button onClick={() => handleNav('/')}>Home</button>
          <button onClick={() => handleNav('#shop')}>Explore Collection</button>
          <button onClick={() => { onClose(); onQuiz(); }}>✦ Scent Match Quiz</button>
          <button onClick={() => handleNav('#about')}>Our Point of View</button>
          <button onClick={() => handleNav('#trust')}>Authenticity & Care</button>
          <button onClick={() => handleNav('#contact')}>Contact & FAQs</button>
          <button onClick={() => { onClose(); onAccount('track'); }}>Track Delivery</button>
          <button onClick={() => { onClose(); onAccount('wishlist'); }}>Saved Wishlist</button>
        </div>

        <div className="mobile-menu-admin-card">
          <span>STAFF & MANAGEMENT</span>
          <p>Access inventory, revenue insights, order fulfillment and customer directories.</p>
          <Link to="/admin/login" className="btn" onClick={onClose}>
            Admin Studio Login ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Interactive Scent Match Quiz Modal
   -------------------------------------------------------------------------- */

function ScentQuizModal({ onClose, onSelectProduct }) {
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState(null);
  const [mood, setMood] = useState(null);

  const occasions = [
    { key: 'daily', label: 'Everyday Signature', desc: 'Versatile, subtle distinction that lingers' },
    { key: 'evening', label: 'Regal Evening', desc: 'Deep, mysterious woods and smoky amber' },
    { key: 'fresh', label: 'Crisp & Uplifting', desc: 'Sparkling citrus, sea breeze and botanicals' },
    { key: 'date', label: 'Sensual & Intimate', desc: 'Warm vanilla, creamy woods and musk' }
  ];

  const moods = [
    { key: 'woody', label: 'Woody & Smoky Oud', matchId: 3 },
    { key: 'floral', label: 'Grasse Floral & Lavender', matchId: 1 },
    { key: 'citrus', label: 'Calabrian Bergamot Fresh', matchId: 0 },
    { key: 'gourmand', label: 'Rich Vanilla & Tobacco', matchId: 14 }
  ];

  const matchedProduct = products.find((p) => p.id === (moods.find((m) => m.key === mood)?.matchId || 0));

  return (
    <div className="ov open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="account-modal">
        <button className="x" onClick={onClose} aria-label="Close quiz">×</button>
        <div className="eyebrow eyebrow-dark">FINE DROPS OLFACTORY ADVISOR <span /></div>
        <h3 style={{ marginTop: '8px' }}>Find Your Signature Scent</h3>
        <p className="account-modal-sub">Answer two quick questions to discover your personalized fragrance match.</p>

        {step === 1 && (
          <div>
            <b style={{ fontSize: '13px', color: '#06153b' }}>1. What occasion or presence are you seeking?</b>
            <div className="quiz-options-grid">
              {occasions.map((o) => (
                <button
                  key={o.key}
                  className={`quiz-option-card ${occasion === o.key ? 'selected' : ''}`}
                  onClick={() => { setOccasion(o.key); setStep(2); }}
                >
                  <b>{o.label}</b>
                  <p>{o.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <b style={{ fontSize: '13px', color: '#06153b' }}>2. Which olfactory accord resonates most?</b>
            <div className="quiz-options-grid">
              {moods.map((m) => (
                <button
                  key={m.key}
                  className={`quiz-option-card ${mood === m.key ? 'selected' : ''}`}
                  onClick={() => { setMood(m.key); setStep(3); }}
                >
                  <b>{m.label}</b>
                  <p>Fine distilled extrait formulation</p>
                </button>
              ))}
            </div>
            <button
              style={{ fontSize: '12px', color: '#64728f', marginTop: '10px' }}
              onClick={() => setStep(1)}
            >
              ← Back to occasion
            </button>
          </div>
        )}

        {step === 3 && matchedProduct && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Your Tailored Olfactory Match
            </span>
            <div style={{ width: '100px', height: '110px', margin: '14px auto' }}>
              <BottleArt product={matchedProduct} />
            </div>
            <h4 style={{ margin: '4px 0', fontSize: '22px', fontFamily: 'var(--serif)', color: '#06153b' }}>
              {matchedProduct.n}
            </h4>
            <p style={{ fontSize: '12px', color: '#556585', margin: '4px 0 14px' }}>
              {matchedProduct.b} · {matchedProduct.c} · {money(matchedProduct.p)}
            </p>
            <p style={{ fontSize: '13px', color: '#64728f', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 20px' }}>
              {matchedProduct.desc}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="btn"
                onClick={() => {
                  onSelectProduct(matchedProduct);
                  onClose();
                }}
              >
                View Fragrance Details ↗
              </button>
              <button className="btn o" onClick={() => setStep(1)}>
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Account, Track Order & Portals Modal
   -------------------------------------------------------------------------- */

function AccountModal({ onClose, initialTab = 'choose', isAdminAuth, onAdminLogout, wishlist, onAdd, onWishlist }) {
  const [tab, setTab] = useState(initialTab === 'track' ? 'track' : initialTab === 'wishlist' ? 'wishlist' : initialTab === 'admin' ? 'admin' : 'choose');
  const [orderQuery, setOrderQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const navigate = useNavigate();

  const demoOrders = [
    { id: '#ESS8421', customer: 'Ananya Mehta', product: 'Dior Sauvage', status: 'In Transit via BlueDart Express', eta: 'Tomorrow, by 4:00 PM', address: 'Bandra West, Mumbai' },
    { id: '#ESS8420', customer: 'Rohan Kapoor', product: 'YSL Libre', status: 'Dispatched from Kannauj Hub', eta: '12 Nov 2026', address: 'Indiranagar, Bangalore' },
    { id: '#ESS8419', customer: 'Ishita Rao', product: 'Chanel Chance', status: 'Delivered', eta: 'Delivered on 09 Nov', address: 'Vasant Vihar, New Delhi' },
    { id: '#ESS8418', customer: 'Kabir Shah', product: 'Tom Ford Oud Wood', status: 'Quality Sealed & Packed', eta: '13 Nov 2026', address: 'Jubilee Hills, Hyderabad' }
  ];

  const handleTrack = (e) => {
    e?.preventDefault();
    const clean = orderQuery.trim().toUpperCase();
    const found = demoOrders.find((o) => o.id.includes(clean) || clean.includes(o.id.replace('#', '')));
    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackedOrder({
        id: clean || '#ESS9999',
        customer: 'Valued Collector',
        product: 'Fine Drops Handcrafted Fragrance',
        status: 'Order Verified · Preparing Velvet Coffret',
        eta: '2-4 business days',
        address: 'Direct Delivery Address'
      });
    }
  };

  const wishlistProducts = useMemo(() => {
    return Object.entries(wishlist)
      .filter(([, active]) => active)
      .map(([id]) => products.find((p) => p.id === Number(id)))
      .filter(Boolean);
  }, [wishlist]);

  return (
    <div className="ov open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="account-modal">
        <button className="x" onClick={onClose} aria-label="Close modal">×</button>

        <div className="modal-tabs">
          <button
            className={`modal-tab-btn ${tab === 'choose' ? 'active' : ''}`}
            onClick={() => setTab('choose')}
          >
            Portals & Access
          </button>
          <button
            className={`modal-tab-btn ${tab === 'track' ? 'active' : ''}`}
            onClick={() => setTab('track')}
          >
            Track Order
          </button>
          <button
            className={`modal-tab-btn ${tab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setTab('wishlist')}
          >
            Saved Wishlist ({wishlistProducts.length})
          </button>
        </div>

        {tab === 'choose' && (
          <>
            <h3>Account & Portals</h3>
            <p className="account-modal-sub">Select your destination to sign in or manage your Fine Drops experience.</p>

            <div className="portal-grid">
              <div className="portal-card">
                <div className="portal-icon">
                  <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 15-5 16 0" /></Icon>
                </div>
                <div className="portal-info">
                  <b>Customer Order Portal</b>
                  <p>Track existing perfume deliveries, view purchase history, and manage saved wishlist fragrances.</p>
                  <button
                    className="portal-btn"
                    onClick={() => setTab('track')}
                  >
                    Track Existing Order →
                  </button>
                </div>
              </div>

              <div className="portal-card highlight">
                <div className="portal-icon" style={{ background: '#e3e8ff', color: '#3b50f7' }}>
                  <Icon viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </Icon>
                </div>
                <div className="portal-info">
                  <b>Fine Drops Admin Studio</b>
                  <p>Store management portal: inventory stock levels, daily sales revenue, customer directory, and order logistics.</p>
                  {isAdminAuth ? (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      <button
                        className="portal-btn"
                        onClick={() => {
                          onClose();
                          navigate('/admin');
                        }}
                      >
                        Open Studio Dashboard ↗
                      </button>
                      <button
                        className="portal-btn"
                        style={{ color: '#ef4444' }}
                        onClick={() => {
                          onAdminLogout();
                          onClose();
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/admin/login"
                      className="portal-btn"
                      onClick={onClose}
                      style={{ color: '#3b50f7', fontWeight: 600 }}
                    >
                      Go to Dedicated Admin Login ↗
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'track' && (
          <div className="order-tracker-box">
            <h4 style={{ margin: '0 0 6px', fontFamily: 'var(--serif)', fontSize: '20px', color: '#06153b' }}>
              Track Your Fragrance Parcel
            </h4>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#64728f' }}>
              Enter your Order Number (e.g. <b>#ESS8421</b>) to track live logistics status.
            </p>

            <form className="order-tracker-form" onSubmit={handleTrack}>
              <input
                type="text"
                placeholder="Enter #ESS8421, #ESS8420..."
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
              />
              <button className="btn" type="submit" style={{ minHeight: 'auto', padding: '8px 16px', fontSize: '11px' }}>
                Track
              </button>
            </form>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', color: '#8d9ab5' }}>Sample Orders:</span>
              {demoOrders.map((o) => (
                <button
                  key={o.id}
                  style={{ fontSize: '10px', color: '#3b50f7', textDecoration: 'underline' }}
                  onClick={() => { setOrderQuery(o.id); setTrackedOrder(o); }}
                >
                  {o.id}
                </button>
              ))}
            </div>

            {trackedOrder && (
              <div className="order-result-card">
                <div className="order-result-row">
                  <span>Order Number</span>
                  <b>{trackedOrder.id}</b>
                </div>
                <div className="order-result-row">
                  <span>Recipient</span>
                  <span>{trackedOrder.customer}</span>
                </div>
                <div className="order-result-row">
                  <span>Fragrance</span>
                  <b>{trackedOrder.product}</b>
                </div>
                <div className="order-result-row">
                  <span>Live Status</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{trackedOrder.status}</span>
                </div>
                <div className="order-result-row">
                  <span>Estimated Delivery</span>
                  <span>{trackedOrder.eta}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'wishlist' && (
          <div>
            <h4 style={{ margin: '0 0 6px', fontFamily: 'var(--serif)', fontSize: '20px', color: '#06153b' }}>
              Your Saved Fragrances
            </h4>
            <p style={{ margin: '0 0 14px', fontSize: '12px', color: '#64728f' }}>
              Handpicked creations saved to your private collection.
            </p>

            {wishlistProducts.length > 0 ? (
              <div className="wishlist-modal-list">
                {wishlistProducts.map((p) => (
                  <div className="wishlist-modal-item" key={p.id}>
                    <div className="wishlist-modal-item-left">
                      <div className="mini-bottle">
                        <BottleArt product={p} />
                      </div>
                      <div>
                        <b style={{ fontSize: '13px', color: '#06153b' }}>{p.n}</b>
                        <small style={{ display: 'block', color: '#8190aa', fontSize: '11px' }}>{p.b} · {money(p.p)}</small>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        className="btn"
                        style={{ minHeight: '32px', padding: '6px 12px', fontSize: '10px' }}
                        onClick={() => { onAdd(p); }}
                      >
                        Add to Bag +
                      </button>
                      <button
                        style={{ color: '#a0aec0', fontSize: '16px', padding: '4px' }}
                        onClick={() => onWishlist(p.id)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#8d9ab5' }}>
                <p>You haven't saved any fragrances yet.</p>
                <p style={{ fontSize: '12px' }}>Tap the heart icon on any perfume card to add it to your wishlist.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Product Card Component
   -------------------------------------------------------------------------- */

function Card({ product, onAdd, wishlist, onWishlist }) {
  const discount = product.o ? Math.round((1 - product.p / product.o) * 100) : 0;

  return (
    <article className="card">
      {product.bd && (
        <span className={`bd ${product.bd === 'Bestseller' ? 'dc' : ''}`}>
          {product.bd}
        </span>
      )}
      {!product.bd && discount > 0 && (
        <span className="bd">{discount}% OFF</span>
      )}

      <button
        className={`wl ${wishlist ? 'on' : ''}`}
        onClick={() => onWishlist(product.id)}
        aria-label={`Save ${product.n} to wishlist`}
      >
        <Icon>
          <path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 6-8 11-8 11z" />
        </Icon>
      </button>

      <Link className="img" to={`/product/${product.id}`} aria-label={`View ${product.n}`}>
        <BottleArt product={product} />
      </Link>

      <div className="inf">
        <span className="br">{product.b}</span>
        <h3>
          <Link to={`/product/${product.id}`}>{product.n}</Link>
        </h3>

        <div className="rating-stars">
          ★★★★★ <span>{product.rating || '4.9'} ({product.reviewsCount || '120'})</span>
        </div>

        <small>{product.c} · {product.s}</small>

        <div className="card-bottom-row">
          <div className="pr">
            {money(product.p)}
            {product.o > 0 && (
              <>
                <s>{money(product.o)}</s>
                <em>{discount}% savings</em>
              </>
            )}
          </div>

          <button
            className="add"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.n} to shopping bag`}
            title="Add to bag"
          >
            <Icon>
              <path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0" />
            </Icon>
          </button>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Product Detail Page Component
   -------------------------------------------------------------------------- */

function ProductDetail({ onAdd, count, wishlistCount, onBag, onMenu, onAccount }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === Number(id));
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <>
        <Header count={count} wishlistCount={wishlistCount} onBag={onBag} onMenu={onMenu} onAccount={onAccount} />
        <main className="not-found">
          <h2>Fragrance Not Found</h2>
          <p>The fragrance you were looking for is unavailable or has been archived.</p>
          <Link className="btn" to="/">Return to the collection <span>↗</span></Link>
        </main>
        <Footer onAccount={onAccount} />
      </>
    );
  }

  const discount = product.o ? Math.round((1 - product.p / product.o) * 100) : 0;
  const related = products.filter((p) => p.id !== product.id && (p.b === product.b || p.cat === product.cat)).slice(0, 4);

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) {
      onAdd(product);
    }
    onBag();
  };

  const handleAddMultiple = () => {
    for (let i = 0; i < qty; i++) {
      onAdd(product);
    }
  };

  return (
    <>
      <Header count={count} wishlistCount={wishlistCount} onBag={onBag} onMenu={onMenu} onAccount={onAccount} />
      <main className="product-page">
        <Link className="back-link" to="/#shop">← Back to catalogue</Link>

        <div className="product-detail">
          <div className="product-visual">
            <BottleArt product={product} />
          </div>

          <div className="product-copy">
            <div className="eyebrow eyebrow-dark">
              {product.b.toUpperCase()} <span />
            </div>
            <h1>{product.n}</h1>
            <p className="product-subtitle">{product.c} · {product.s} · {product.family}</p>

            <div className="rating-stars" style={{ margin: '8px 0 16px', fontSize: '13px' }}>
              ★★★★★ <span style={{ fontSize: '12px', color: '#64728f' }}>{product.rating} / 5.0 ({product.reviewsCount} verified connoisseurs)</span>
            </div>

            <div className="detail-price">
              {money(product.p)}
              {product.o > 0 && (
                <>
                  <s>{money(product.o)}</s>
                  <span style={{ fontSize: '12px', color: '#3b50f7', background: '#e5ebff', padding: '3px 8px', borderRadius: '4px' }}>
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="detail-description">{product.desc}</p>

            <div className="detail-notes">
              <div>
                <span>🌿 Opening</span>
                <div>{product.notes?.top || 'Bright bergamot, fresh botanical accords'}</div>
              </div>
              <div>
                <span>🌸 Character</span>
                <div>{product.notes?.heart || 'Warm spices, rare florals, velvety heart'}</div>
              </div>
              <div>
                <span>🪵 Finish</span>
                <div>{product.notes?.base || 'Rich ambergris, creamy woods, lasting sillage'}</div>
              </div>
            </div>

            <div className="product-actions">
              <div className="product-quantity-selector">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
              </div>

              <button className="btn" onClick={handleAddMultiple}>
                Add to bag ({qty}) <span>↗</span>
              </button>

              <button className="btn o" onClick={handleBuyNow}>
                Buy Now <span>→</span>
              </button>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: '#fff', border: '1px solid var(--line)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#06153b', fontWeight: 600 }}>
                <span>✦ Luxury Coffret Presentation</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#64728f', lineHeight: 1.5 }}>
                Each bottle arrives hand-sealed in our velvet-lined keepsake coffret, accompanied by a complimentary 2ml discovery vial.
              </p>
            </div>
          </div>
        </div>

        {/* You May Also Adore */}
        {related.length > 0 && (
          <section className="related-section">
            <div className="related-header">
              <span className="kicker">CURATED RECOMMENDATIONS</span>
              <h2>You May Also Adore</h2>
            </div>
            <div className="grid">
              {related.map((item) => (
                <Card
                  key={item.id}
                  product={item}
                  onAdd={onAdd}
                  wishlist={false}
                  onWishlist={() => {}}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer onAccount={onAccount} />
    </>
  );
}

/* --------------------------------------------------------------------------
   Shopping Bag Slide-Out Panel
   -------------------------------------------------------------------------- */

function Bag({ cart, onClose, onRemove, onAdd }) {
  const items = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: products.find((p) => p.id === Number(id)), qty }))
    .filter((item) => item.product);

  const subtotal = items.reduce((sum, { product, qty }) => sum + product.p * qty, 0);
  const freeShippingThreshold = 799;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="bag-panel">
      <button className="x" onClick={onClose} aria-label="Close bag">×</button>
      <h3>Your Shopping Bag</h3>

      {items.length > 0 ? (
        <>
          <div className="free-shipping-bar">
            <span>
              {isFreeShipping ? (
                <>✓ <b>Complimentary Express Shipping</b> unlocked!</>
              ) : (
                <>Add <b>{money(amountNeeded)}</b> more for <b>Free Express Delivery</b></>
              )}
            </span>
            <div className="free-shipping-track">
              <div className="free-shipping-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="bag-items">
            {items.map(({ product, qty }) => (
              <div className="li" key={product.id}>
                <div className="img">
                  <BottleArt product={product} />
                </div>
                <div className="li-info">
                  <b>{product.n}</b>
                  <small>{product.b} · {product.s}</small>
                  <div className="q">
                    <button onClick={() => onRemove(product.id, -1)} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button onClick={() => onAdd(product)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <div className="li-price">
                  <strong>{money(product.p * qty)}</strong>
                  <button
                    className="li-remove"
                    onClick={() => onRemove(product.id, -qty)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="tot">
            <div className="tot-row">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="tot-row">
              <span>Estimated Shipping</span>
              <span>{isFreeShipping ? 'Complimentary' : money(99)}</span>
            </div>
            <div className="tot-final">
              <span>Total</span>
              <b>{money(isFreeShipping ? subtotal : subtotal + 99)}</b>
            </div>
          </div>

          <button
            className="btn"
            style={{ width: '100%' }}
            onClick={() => {
              alert("Order checkout simulation: Thank you for shopping with Fine Drops! Your package will be prepared with care.");
              onClose();
            }}
          >
            Proceed to Checkout <span>↗</span>
          </button>
        </>
      ) : (
        <div className="bag-empty">
          <p>Your shopping bag is currently empty.</p>
          <a
            className="btn"
            href="#shop"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Discover Fragrances <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Home Page View
   -------------------------------------------------------------------------- */

function Home({ onAdd, cart, wishlist, onWishlist, onBag, onMenu, onAccount, onQuiz }) {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    ['all', 'All Fragrances'],
    ['women', 'Women'],
    ['men', 'Men'],
    ['unisex', 'Unisex'],
    ['best', 'Best Sellers']
  ];

  const visible = useMemo(() => {
    return products.filter((product) => {
      const matchesFilter =
        filter === 'all' ||
        product.cat === filter ||
        (filter === 'best' && product.bd === 'Bestseller');

      const matchesVisibility = showAll || product.f === 1;

      const matchesSearch =
        searchQuery.trim() === '' ||
        product.n.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.b.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesVisibility && matchesSearch;
    });
  }, [filter, showAll, searchQuery]);

  return (
    <>
      <Header
        count={Object.values(cart).reduce((a, b) => a + b, 0)}
        wishlistCount={Object.values(wishlist).filter(Boolean).length}
        onBag={onBag}
        onMenu={onMenu}
        onAccount={onAccount}
      />

      <main id="top">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              THE FINE DROPS ARCHIVE <span />
            </div>
            <h1>
              Scent, distilled to its <em>most beautiful form.</em>
            </h1>
            <p className="hero-lede">
              A considered collection of modern classics and quiet discoveries, formulated to leave a signature long after you leave the room.
            </p>
            <div className="hero-actions">
              <a className="btn" href="#shop">
                Explore the collection <span>↗</span>
              </a>
              <button className="btn g" onClick={onQuiz}>
                Take Scent Quiz <span>✦</span>
              </button>
            </div>
            <div className="hero-meta">
              <span><b>01</b> / 03</span>
              <span className="meta-line" />
              <span>Curated in India · Shipped Nationwide</span>
            </div>
          </div>

          <div className="art" aria-label="Amber FINE DROPS perfume bottle" role="img">
            <div className="art-orbit art-orbit-one" />
            <div className="art-orbit art-orbit-two" />
            <span className="art-caption">
              Signature Edit<br />
              <b>Amber / Cedar</b>
            </span>
            <svg viewBox="0 0 420 460" aria-hidden="true">
              <defs>
                <linearGradient id="am" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#d29a57" />
                  <stop offset=".48" stopColor="#84512a" />
                  <stop offset="1" stopColor="#261511" />
                </linearGradient>
              </defs>
              <circle cx="230" cy="190" r="170" fill="none" stroke="#caa56a" strokeOpacity=".32" />
              <path d="M20 400c60-40 80-90 150-70l120 40 110-40 0 60H20z" fill="#3c2921" />
              <ellipse cx="240" cy="395" rx="150" ry="22" fill="#735b48" opacity=".58" />
              <rect x="150" y="170" width="170" height="215" rx="14" fill="url(#am)" stroke="#e8d3a8" strokeOpacity=".7" strokeWidth="3" />
              <rect x="212" y="120" width="46" height="52" fill="#b98a3e" />
              <rect x="200" y="100" width="70" height="26" rx="4" fill="#d4af37" />
              <path d="M178 40l16-14h82l16 14 4 40-30 24H204l-30-24z" fill="#f2e6cd" fillOpacity=".55" stroke="#fff" strokeOpacity=".7" />
              <text x="235" y="295" textAnchor="middle" fontFamily="Cormorant Garamond,serif" fontSize="26" fill="#D4AF37" letterSpacing="2">
                FINE DROPS
              </text>
            </svg>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="cats-wrapper">
          <section className="cats" aria-label="Browse fragrance categories">
            {categories.map(([key, label]) => (
              <button
                key={key}
                className={filter === key ? 'active' : ''}
                onClick={() => {
                  setFilter(key);
                  setShowAll(true);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Icon>
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 4v16M4 12h16" />
                </Icon>
                <span>{label}</span>
                <small>Shop Now →</small>
              </button>
            ))}
          </section>
        </div>

        {/* Signature Collection Catalogue */}
        <section className="col" id="shop">
          <div className="section-intro">
            <div className="eyebrow eyebrow-dark">
              THE SIGNATURE EDIT <span />
            </div>
            <h2>
              Find the note<br />
              <em>that finds you.</em>
            </h2>
            <p>
              Our most celebrated perfumes, formulated for presence, balance, and quiet distinction.
            </p>
            <button
              className="btn o"
              onClick={() => {
                setShowAll(!showAll);
                setFilter('all');
                setSearchQuery('');
              }}
            >
              {showAll ? 'Show featured' : 'View all 16 creations'} <span>↗</span>
            </button>

            <div className="quiz-trigger-card">
              <h4>Unsure of your note?</h4>
              <p>Take our 30-second Olfactory Match quiz to find the fragrance suited for your skin chemistry.</p>
              <button onClick={onQuiz}>Find My Scent ✦</button>
            </div>
          </div>

          <div className="catalogue">
            <div className="catalogue-head">
              <div className="catalogue-top-row">
                <div>
                  <span className="kicker">CURATED FRAGRANCES</span>
                  <span className="catalogue-note">A fragrance wardrobe for every mood</span>
                </div>

                <div className="catalogue-search-bar">
                  <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></Icon>
                  <input
                    id="catalogue-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search note, brand, or name..."
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ color: '#a0aec0', fontSize: '14px' }}>×</button>
                  )}
                </div>
              </div>

              <div className="catalogue-filter-chips">
                {categories.map(([key, label]) => (
                  <button
                    key={key}
                    className={`filter-chip ${filter === key ? 'active' : ''}`}
                    onClick={() => {
                      setFilter(key);
                      setShowAll(true);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="rule" />
            </div>

            <div className="grid">
              {visible.map((product) => (
                <Card
                  key={product.id}
                  product={product}
                  onAdd={onAdd}
                  wishlist={wishlist[product.id]}
                  onWishlist={onWishlist}
                />
              ))}
            </div>

            {visible.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <p style={{ color: '#64728f', fontSize: '15px' }}>No fragrances match your selected search or filter.</p>
                <button
                  className="btn"
                  onClick={() => { setFilter('all'); setShowAll(true); setSearchQuery(''); }}
                >
                  Reset All Filters
                </button>
              </div>
            )}

            <p className="catalogue-disclaimer">
              ✦ Certified Authentic Fragrance Guarantee: All perfumes and attars are sourced directly from verified European and Indian perfume houses.
            </p>
          </div>
        </section>

        {/* Trust Strip */}
        <section id="trust" className="trust-strip">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">
                <Icon viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>
              </div>
              <div className="trust-copy">
                <b>100% Authentic Guaranteed</b>
                <p>Pure concentrates sourced directly from premier perfume houses.</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon">
                <Icon viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></Icon>
              </div>
              <div className="trust-copy">
                <b>Complimentary Shipping</b>
                <p>Enjoy express doorstep delivery on all orders above ₹799.</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon">
                <Icon viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></Icon>
              </div>
              <div className="trust-copy">
                <b>Free Discovery Sample</b>
                <p>Receive a complimentary 2ml luxury tester vial with every bottle.</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon">
                <Icon viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Icon>
              </div>
              <div className="trust-copy">
                <b>Temperature Protected</b>
                <p>Delivered in insulated, light-safe, gift-ready presentation boxes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seasonal Promo Banner */}
        <section className="promo">
          <div className="promo-copy">
            <div className="eyebrow">
              THE SEASONAL EDIT <span />
            </div>
            <h2>
              Indulge in<br />
              <em>the extraordinary.</em>
            </h2>
            <p>
              Special seasonal curation: experience the warmest notes of Madagascar vanilla, ambergris, and smoky cedar.
            </p>
            <a className="btn g" href="#shop" onClick={() => { setFilter('all'); setShowAll(true); }}>
              Shop the edit <span>↗</span>
            </a>
          </div>

          <div className="promo-art">
            <span>30</span>
            <small>% OFF</small>
            <svg viewBox="0 0 300 220" aria-hidden="true">
              <ellipse cx="190" cy="120" rx="60" ry="80" fill="#d9a070" opacity=".72" />
              <path d="M130 220c0-50 30-70 60-70s70 20 70 70z" fill="#2d1c14" />
              <rect x="70" y="90" width="40" height="70" rx="5" fill="#e0a36a" opacity=".9" />
            </svg>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="about-stamp" title="Fine Drops Monogram">
            F<br />D
          </div>
          <div>
            <div className="eyebrow eyebrow-dark">
              A QUIETER KIND OF LUXURY <span />
            </div>
            <h2>
              Beyond the senses,<br />
              <em>a feeling that stays.</em>
            </h2>
          </div>
          <div className="about-copy">
            <p>
              FINE DROPS was created as an antidote to loud fragrances. We believe true elegance never shouts; it stays close, evolves gracefully on your skin, and creates an unforgettable olfactory memory.
            </p>
            <a className="text-link dark" href="#contact">
              Meet our care team <span>→</span>
            </a>
          </div>
        </section>
      </main>

      <Footer onAccount={onAccount} />
    </>
  );
}

/* --------------------------------------------------------------------------
   Footer Component
   -------------------------------------------------------------------------- */

function Footer({ onAccount }) {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    e.currentTarget.reset();
  };

  return (
    <footer id="contact">
      <div className="fg">
        <div className="footer-brand">
          <Link className="logo" to="/">
            <span className="logo-mark"><Flame /></span>
            <span className="wordmark">
              <span>FINE DROPS</span>
              <small>BEYOND THE SENSES</small>
            </span>
          </Link>
          <p>
            A world of considered fragrance, meticulously curated and delivered across India.
          </p>
          <div className="so">
            <a href="#contact" aria-label="Fine Drops Instagram">Instagram</a>
            <a href="#contact" aria-label="Fine Drops YouTube">YouTube</a>
            <a href="#contact" aria-label="Fine Drops X">X</a>
          </div>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="/#shop">Shop All</a></li>
            <li><a href="/#about">Our Story</a></li>
            <li><a href="/#trust">Authenticity</a></li>
            <li>
              <Link to="/admin/login" className="footer-admin-link">
                Admin Studio Login ↗
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Care & Support</h4>
          <ul>
            <li><a href="#track" onClick={(e) => { if (onAccount) { e.preventDefault(); onAccount('track'); } }}>Track Order</a></li>
            <li><a href="#contact">Shipping Policy</a></li>
            <li><a href="#contact">Returns & Exchanges</a></li>
            <li><a href="#contact">Customer Care</a></li>
            <li><a href="#contact">Authenticity FAQs</a></li>
          </ul>
        </div>

        <div className="newsletter">
          <span className="kicker">THE FINE DROPS LETTER</span>
          <h4>Notes worth keeping.</h4>
          <p>Private edits, rare batch releases, and fragrance care rituals.</p>
          <form className="nl" onSubmit={handleSubscribe}>
            <input type="email" required placeholder="Enter your email address" aria-label="Email address" />
            <button aria-label="Subscribe to newsletter">↗</button>
          </form>
          {subscribed && (
            <div className="nl-success">✦ Thank you for subscribing to the Fine Drops edit.</div>
          )}
        </div>
      </div>

      <div className="cp">
        <span>© 2026 Fine Drops Luxury Store. All rights reserved.</span>
        <span>
          Privacy Policy <span className="cp-dot">·</span> Terms of Service <span className="cp-dot">·</span> Authenticity Verified
        </span>
      </div>
    </footer>
  );
}

/* --------------------------------------------------------------------------
   DEDICATED ADMIN LOGIN PAGE (/admin/login)
   -------------------------------------------------------------------------- */

export function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@finedrops.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (
        (email.trim().toLowerCase() === 'admin@finedrops.com' || email.trim().toLowerCase() === 'admin') &&
        (password === 'admin123' || password === 'admin')
      ) {
        localStorage.setItem('fineDropsAdminAuth', 'true');
        if (onLoginSuccess) onLoginSuccess();
        navigate('/admin');
      } else {
        setError('Invalid administrator email or password. Please use the demo credentials below.');
      }
      setLoading(false);
    }, 400);
  };

  const handleDemoLogin = () => {
    setEmail('admin@finedrops.com');
    setPassword('admin123');
    setError('');
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('fineDropsAdminAuth', 'true');
      if (onLoginSuccess) onLoginSuccess();
      navigate('/admin');
      setLoading(false);
    }, 250);
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="logo-mark"><Flame /></div>
          <h1>FINE DROPS</h1>
          <p>ADMIN STUDIO MANAGEMENT</p>
          <span className="admin-login-badge">Staff & Executive Access</span>
        </div>

        {error && <div className="admin-auth-error">{error}</div>}

        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">Admin Email / Username</label>
            <div className="admin-input-wrapper">
              <input
                id="admin-email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@finedrops.com"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Secure Password</label>
            <div className="admin-input-wrapper">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Authenticating...' : 'Sign In to Admin Studio ↗'}
          </button>

          <button
            type="button"
            className="admin-demo-button"
            onClick={handleDemoLogin}
            title="1-Click demo authentication"
          >
            ⚡ 1-Click Quick Demo Sign In
          </button>
        </form>

        <div className="admin-login-footer">
          <p style={{ margin: '0 0 10px', fontSize: '11px', color: '#8d9ab5' }}>
            Demo credentials: <code style={{ color: '#d4af37' }}>admin@finedrops.com</code> / <code style={{ color: '#d4af37' }}>admin123</code>
          </p>
          <Link to="/">
            ← Return to Fine Drops Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   ADMIN STUDIO DASHBOARD (/admin)
   -------------------------------------------------------------------------- */

function AdminDashboard({ onLogout }) {
  const [active, setActive] = useState('Overview');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All status');
  const [adminNavOpen, setAdminNavOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([
    { id: '#ESS8421', customer: 'Ananya Mehta', product: 'Dior Sauvage', total: 14999, status: 'Processing', date: '10 Nov 2026' },
    { id: '#ESS8420', customer: 'Rohan Kapoor', product: 'YSL Libre', total: 15999, status: 'Shipped', date: '10 Nov 2026' },
    { id: '#ESS8419', customer: 'Ishita Rao', product: 'Chanel Chance', total: 13999, status: 'Delivered', date: '09 Nov 2026' },
    { id: '#ESS8418', customer: 'Kabir Shah', product: 'Tom Ford Oud Wood', total: 24999, status: 'Processing', date: '09 Nov 2026' },
    { id: '#ESS8417', customer: 'Meera Nair', product: 'Gucci Bloom', total: 11999, status: 'Delivered', date: '08 Nov 2026' },
    { id: '#ESS8416', customer: 'Aditya Birla', product: 'Bleu de Chanel', total: 16999, status: 'Shipped', date: '08 Nov 2026' },
    { id: '#ESS8415', customer: 'Pooja Hegde', product: 'Burberry Her', total: 12999, status: 'Delivered', date: '07 Nov 2026' }
  ]);

  const [inventoryList, setInventoryList] = useState(() => {
    return products.map((product, index) => ({
      ...product,
      stock: [8, 24, 4, 12, 31, 7, 18, 3, 14, 5, 22, 9, 16, 2, 6, 11][index] || 10
    }));
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    setInventoryList((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    setEditingProduct(null);
  };

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Order ID,Customer,Product,Date,Total,Status"]
        .concat(orders.map((o) => `${o.id},"${o.customer}","${o.product}",${o.date},${o.total},${o.status}`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fine-drops-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'All status' || order.status === status;
    return matchesSearch && matchesStatus;
  });

  const nav = ['Overview', 'Orders', 'Products', 'Customers', 'Analytics'];

  const handleSignOut = () => {
    localStorage.removeItem('fineDropsAdminAuth');
    if (onLogout) onLogout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      {/* Mobile overlay for admin sidebar */}
      {adminNavOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setAdminNavOpen(false)} />
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${adminNavOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link className="admin-brand" to="/">
            <span className="logo-mark"><Flame /></span>
            <span>
              <b>FINE DROPS</b>
              <small>ADMIN STUDIO</small>
            </span>
          </Link>
          {adminNavOpen && (
            <button
              onClick={() => setAdminNavOpen(false)}
              style={{ color: '#fff', fontSize: '20px', padding: '0 8px 30px' }}
              aria-label="Close admin navigation"
            >
              ×
            </button>
          )}
        </div>

        <div className="admin-nav-label">Workspace</div>
        <nav>
          {nav.map((item) => (
            <button
              className={active === item ? 'active' : ''}
              key={item}
              onClick={() => {
                setActive(item);
                setAdminNavOpen(false);
              }}
            >
              <span className="admin-nav-icon">
                {item === 'Overview' ? '⌂' : item === 'Orders' ? '◈' : item === 'Products' ? '◇' : item === 'Customers' ? '◎' : '◌'}
              </span>
              {item}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/" target="_blank" rel="noopener noreferrer">
            View storefront <span>↗</span>
          </Link>
          <button className="admin-logout-button" onClick={handleSignOut}>
            Sign Out of Admin Studio
          </button>
          <span>© 2026 Fine Drops Admin Studio</span>
        </div>
      </aside>

      {/* Admin Main Area */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-menu"
              aria-label="Toggle admin navigation"
              onClick={() => setAdminNavOpen(!adminNavOpen)}
            >
              ☰
            </button>
            <div>
              <span className="admin-breadcrumb">Admin / {active}</span>
              <h1>{active === 'Overview' ? 'Good morning, Aanya.' : active}</h1>
            </div>
          </div>

          <div className="admin-profile">
            <Link to="/" className="btn o" style={{ fontSize: '10px', padding: '6px 12px', minHeight: '34px' }}>
              Storefront ↗
            </Link>
            <button className="admin-notification" aria-label="Notifications" title="2 unread alerts">
              🔔
              <i />
            </button>
            <span className="admin-avatar">AS</span>
            <span>
              <b>Aanya Shah</b>
              <small>Administrator</small>
            </span>
            <button
              onClick={handleSignOut}
              style={{ fontSize: '11px', color: '#ef4444', marginLeft: '6px', textDecoration: 'underline' }}
              title="Sign Out"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Overview Tab */}
        {active === 'Overview' && (
          <>
            <section className="admin-welcome">
              <div>
                <span className="eyebrow eyebrow-dark">STORE PERFORMANCE <span /></span>
                <h2>Your store, at a glance.</h2>
                <p>Real-time analytics and inventory updates across Fine Drops boutique.</p>
              </div>
              <button className="admin-primary" onClick={handleDownloadCSV}>
                Download report <span>↓</span>
              </button>
            </section>

            <section className="admin-stat-grid">
              <div className="admin-stat">
                <span>Net revenue</span>
                <strong>₹2,48,620</strong>
                <em className="up">↑ 18.4% <small>vs last month</small></em>
                <div className="sparkline">
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </div>
              </div>

              <div className="admin-stat">
                <span>Total orders</span>
                <strong>186</strong>
                <em className="up">↑ 12.8% <small>vs last month</small></em>
                <div className="sparkline sand">
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </div>
              </div>

              <div className="admin-stat">
                <span>Average order value</span>
                <strong>₹1,336</strong>
                <em className="up">↑ 5.2% <small>vs last month</small></em>
                <div className="sparkline copper">
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </div>
              </div>

              <div className="admin-stat">
                <span>Returning customers</span>
                <strong>34.8%</strong>
                <em className="down">↓ 2.1% <small>vs last month</small></em>
                <div className="sparkline brown">
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </div>
              </div>
            </section>

            <section className="admin-content-grid">
              <div className="admin-panel admin-sales">
                <div className="admin-panel-head">
                  <div>
                    <span className="admin-kicker">REVENUE OVERVIEW</span>
                    <h3>Sales performance</h3>
                  </div>
                  <select aria-label="Sales period">
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This year</option>
                  </select>
                </div>

                <div className="sales-chart">
                  <div className="chart-y">
                    <span>₹30k</span>
                    <span>₹20k</span>
                    <span>₹10k</span>
                    <span>₹0</span>
                  </div>
                  <div className="chart-area">
                    <div className="chart-grid">
                      <i /><i /><i /><i />
                    </div>
                    <svg viewBox="0 0 700 220" preserveAspectRatio="none" aria-label="Sales performance curve">
                      <defs>
                        <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0" stopColor="#bfc7d6" stopOpacity=".35" />
                          <stop offset="1" stopColor="#bfc7d6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 178 C42 164 56 170 90 142 S142 158 178 128 S224 145 270 104 S320 118 360 90 S410 122 452 75 S506 98 548 65 S604 84 640 36 S680 54 700 24 V220 H0Z" fill="url(#salesFill)" />
                      <path d="M0 178 C42 164 56 170 90 142 S142 158 178 128 S224 145 270 104 S320 118 360 90 S410 122 452 75 S506 98 548 65 S604 84 640 36 S680 54 700 24" fill="none" stroke="#3b50f7" strokeWidth="3" />
                    </svg>
                    <div className="chart-x">
                      <span>12 Oct</span>
                      <span>18 Oct</span>
                      <span>24 Oct</span>
                      <span>30 Oct</span>
                      <span>05 Nov</span>
                      <span>10 Nov</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-panel admin-products">
                <div className="admin-panel-head">
                  <div>
                    <span className="admin-kicker">MERCHANDISING</span>
                    <h3>Top fragrances</h3>
                  </div>
                  <button className="admin-text-button" onClick={() => setActive('Products')}>
                    View all ↗
                  </button>
                </div>

                <div className="top-product-list">
                  {products.slice(0, 5).map((product, index) => (
                    <div className="top-product" key={product.id}>
                      <span className="top-product-number">0{index + 1}</span>
                      <div className="mini-bottle">
                        <BottleArt product={product} />
                      </div>
                      <div>
                        <b>{product.n}</b>
                        <small>{product.b}</small>
                      </div>
                      <strong>{[38, 31, 24, 19, 16][index]} sold</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="admin-panel admin-orders">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-kicker">RECENT ACTIVITY</span>
                  <h3>Latest orders</h3>
                </div>
                <button className="admin-text-button" onClick={() => setActive('Orders')}>
                  Manage orders ↗
                </button>
              </div>
              <AdminOrderTable orders={orders.slice(0, 5)} onStatusChange={updateOrderStatus} />
            </section>
          </>
        )}

        {/* Orders Tab */}
        {active === 'Orders' && (
          <section className="admin-panel admin-page-panel">
            <AdminToolbar
              title="Order fulfillment"
              query={query}
              setQuery={setQuery}
              status={status}
              setStatus={setStatus}
              action="Export CSV"
              onAction={handleDownloadCSV}
            />
            <AdminOrderTable orders={filteredOrders} onStatusChange={updateOrderStatus} />
          </section>
        )}

        {/* Products Tab */}
        {active === 'Products' && (
          <section className="admin-panel admin-page-panel">
            <AdminToolbar
              title="Fragrance inventory"
              query={query}
              setQuery={setQuery}
              action="Add fragrance"
              onAction={() => setAddingProduct(true)}
            />
            <div className="admin-product-table">
              {inventoryList
                .filter((p) => `${p.n} ${p.b}`.toLowerCase().includes(query.toLowerCase()))
                .map((product) => (
                  <div className="admin-product-row" key={product.id}>
                    <div className="mini-bottle">
                      <BottleArt product={product} />
                    </div>
                    <div>
                      <b>{product.n}</b>
                      <small>{product.b} · {product.s}</small>
                    </div>
                    <span>{money(product.p)}</span>
                    <span className={product.stock < 6 ? 'stock-low' : 'stock-good'}>
                      {product.stock} units in stock {product.stock < 6 && '(!)'}
                    </span>
                    <button
                      className="admin-row-action"
                      onClick={() => setEditingProduct({ ...product })}
                    >
                      Edit
                    </button>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Customers Tab */}
        {active === 'Customers' && (
          <section className="admin-panel admin-page-panel">
            <AdminToolbar
              title="Customer directory"
              query={query}
              setQuery={setQuery}
              action="Export list"
              onAction={() => alert("Customer directory exported.")}
            />
            <div className="customer-grid">
              {[
                'Ananya Mehta',
                'Rohan Kapoor',
                'Ishita Rao',
                'Kabir Shah',
                'Meera Nair',
                'Nikhil Verma',
                'Tara Sutaria',
                'Vikram Singhania'
              ].map((name, index) => (
                <div className="customer-card" key={name}>
                  <span className="customer-avatar">
                    {name.split(' ').map((p) => p[0]).join('')}
                  </span>
                  <div>
                    <b>{name}</b>
                    <small>{['Luxury collector', 'Fragrance enthusiast', 'New customer', 'VIP Tier'][index % 4]}</small>
                  </div>
                  <strong>{[12, 8, 4, 17, 6, 3, 9, 21][index]} orders</strong>
                  <span className="customer-arrow">→</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analytics Tab */}
        {active === 'Analytics' && (
          <section className="admin-panel admin-page-panel analytics-page">
            <AdminToolbar title="Analytics & conversion" action="Download report" onAction={handleDownloadCSV} />
            <div className="analytics-cards">
              <div>
                <span>Conversion rate</span>
                <strong>4.86%</strong>
                <em className="up">↑ 0.8% vs last month</em>
              </div>
              <div>
                <span>Cart abandonment</span>
                <strong>18.2%</strong>
                <em className="up">↓ 3.4% improvement</em>
              </div>
              <div>
                <span>Customer lifetime value</span>
                <strong>₹8,940</strong>
                <em className="up">↑ 11.6% growth</em>
              </div>
            </div>

            <div className="insight-box">
              <span className="insight-icon">✦</span>
              <div>
                <b>Merchandising observation</b>
                <p>
                  Warm woody fragrances (Oud Wood, Tobacco Vanille, Sauvage) are outperforming the catalogue average by 24% this month in regional orders across Delhi NCR, Mumbai, and Bangalore. Consider highlighting them in seasonal campaigns.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditingProduct(null)}>
          <div className="admin-modal-card">
            <h3>Edit Fragrance: {editingProduct.n}</h3>
            <form className="admin-modal-form" onSubmit={handleSaveProductEdit}>
              <label>
                Price (INR)
                <input
                  type="number"
                  value={editingProduct.p}
                  onChange={(e) => setEditingProduct({ ...editingProduct, p: Number(e.target.value) })}
                />
              </label>

              <label>
                Current Inventory Stock
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                />
              </label>

              <div className="admin-modal-actions">
                <button type="button" className="btn o" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {addingProduct && (
        <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && setAddingProduct(false)}>
          <div className="admin-modal-card">
            <h3>Add New Fragrance</h3>
            <form
              className="admin-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newP = {
                  id: inventoryList.length,
                  n: formData.get('name'),
                  b: formData.get('brand'),
                  c: formData.get('conc') || 'Eau de Parfum',
                  s: formData.get('size') || '100ml',
                  p: Number(formData.get('price')),
                  o: 0,
                  cat: 'unisex',
                  family: 'Boutique Blend',
                  bd: 'New',
                  col: '#2a3a5a',
                  lb: 'NEW',
                  f: 1,
                  sh: 0,
                  rating: 5.0,
                  reviewsCount: 1,
                  stock: Number(formData.get('stock') || 10),
                  desc: formData.get('desc') || 'A new bespoke addition to the Fine Drops collection.'
                };
                setInventoryList([newP, ...inventoryList]);
                setAddingProduct(false);
              }}
            >
              <label>
                Fragrance Name
                <input name="name" required placeholder="e.g. Amber Musc" />
              </label>

              <label>
                Perfume House / Brand
                <input name="brand" required placeholder="e.g. Fine Drops Atelier" />
              </label>

              <label>
                Price (INR)
                <input name="price" type="number" required placeholder="14999" />
              </label>

              <label>
                Initial Stock
                <input name="stock" type="number" defaultValue="15" />
              </label>

              <div className="admin-modal-actions">
                <button type="button" className="btn o" onClick={() => setAddingProduct(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Add to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminToolbar({ title, query = '', setQuery, status, setStatus, action, onAction }) {
  return (
    <div className="admin-panel-head admin-toolbar">
      <div>
        <span className="admin-kicker">FINE DROPS ADMIN</span>
        <h2>{title}</h2>
      </div>

      <div className="admin-toolbar-actions">
        {setQuery && (
          <label className="admin-search">
            ⌕
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter list..."
            />
          </label>
        )}

        {setStatus && (
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter order status">
            <option>All status</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        )}

        <button className="admin-primary" onClick={onAction}>
          {action} <span>↗</span>
        </button>
      </div>
    </div>
  );
}

function AdminOrderTable({ orders, onStatusChange }) {
  return (
    <div className="admin-order-table">
      <div className="admin-order-head">
        <span>Order</span>
        <span>Customer</span>
        <span>Product</span>
        <span>Date</span>
        <span>Total</span>
        <span>Status</span>
      </div>
      {orders.map((order) => (
        <div className="admin-order-row" key={order.id}>
          <b>{order.id}</b>
          <span>{order.customer}</span>
          <span>{order.product}</span>
          <span>{order.date}</span>
          <strong>{money(order.total)}</strong>
          {onStatusChange ? (
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className={`order-status ${order.status.toLowerCase()}`}
              style={{ border: '0', cursor: 'pointer', outline: 'none' }}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          ) : (
            <span className={`order-status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Main App Component & Routing
   -------------------------------------------------------------------------- */

export default function App() {
  const [cart, setCart] = useState({});
  const [wishlist, setWishlist] = useState({});
  const [bagOpen, setBagOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountInitialTab, setAccountInitialTab] = useState('choose');
  const [quizOpen, setQuizOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return localStorage.getItem('fineDropsAdminAuth') === 'true';
  });
  const navigate = useNavigate();

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const add = (product) => {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] || 0) + 1
    }));
    showToast(`Added ${product.n} to shopping bag.`);
  };

  const remove = (id, delta) => {
    setCart((current) => {
      const nextQty = (current[id] || 0) + delta;
      if (nextQty <= 0) {
        const copy = { ...current };
        delete copy[id];
        return copy;
      }
      return { ...current, [id]: nextQty };
    });
  };

  const toggleWishlist = (id) => {
    const product = products.find((p) => p.id === id);
    setWishlist((current) => {
      const next = !current[id];
      if (next && product) {
        showToast(`Saved ${product.n} to wishlist.`);
      }
      return { ...current, [id]: next };
    });
  };

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const wishlistCount = Object.values(wishlist).filter(Boolean).length;

  const handleOpenAccount = (tab = 'choose') => {
    setAccountInitialTab(tab);
    setAccountOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuth(true);
    showToast('Administrator session verified.');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('fineDropsAdminAuth');
    setIsAdminAuth(false);
    showToast('Logged out of Admin Studio.');
  };

  return (
    <>
      <ScrollToHash />
      <ToastContainer toasts={toasts} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              onAdd={add}
              cart={cart}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
              onBag={() => setBagOpen(true)}
              onMenu={() => setMenuOpen(true)}
              onAccount={handleOpenAccount}
              onQuiz={() => setQuizOpen(true)}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              onAdd={add}
              count={count}
              wishlistCount={wishlistCount}
              onBag={() => setBagOpen(true)}
              onMenu={() => setMenuOpen(true)}
              onAccount={handleOpenAccount}
            />
          }
        />
        <Route
          path="/admin/login"
          element={<AdminLogin onLoginSuccess={handleAdminLoginSuccess} />}
        />
        <Route
          path="/admin"
          element={
            isAdminAuth ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
            )
          }
        />
      </Routes>

      {/* Mobile Bottom Navigation Dock */}
      <MobileBottomDock
        count={count}
        wishlistCount={wishlistCount}
        onBag={() => setBagOpen(true)}
        onAccount={handleOpenAccount}
        onQuiz={() => setQuizOpen(true)}
      />

      {/* Slide-out Bag Drawer */}
      {bagOpen && (
        <div
          className="ov open dr"
          onClick={(e) => e.target === e.currentTarget && setBagOpen(false)}
        >
          <Bag
            cart={cart}
            onClose={() => setBagOpen(false)}
            onRemove={remove}
            onAdd={add}
          />
        </div>
      )}

      {/* Slide-out Mobile Menu Drawer */}
      {menuOpen && (
        <MobileMenu
          onClose={() => setMenuOpen(false)}
          onAccount={handleOpenAccount}
          onQuiz={() => setQuizOpen(true)}
        />
      )}

      {/* Account, Track Order & Portals Modal */}
      {accountOpen && (
        <AccountModal
          onClose={() => setAccountOpen(false)}
          initialTab={accountInitialTab}
          isAdminAuth={isAdminAuth}
          onAdminLogout={handleAdminLogout}
          wishlist={wishlist}
          onAdd={add}
          onWishlist={toggleWishlist}
        />
      )}

      {/* Scent Match Quiz Modal */}
      {quizOpen && (
        <ScentQuizModal
          onClose={() => setQuizOpen(false)}
          onSelectProduct={(p) => {
            navigate(`/product/${p.id}`);
          }}
        />
      )}
    </>
  );
}
