import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, MapPin } from 'lucide-react';
import { fetchPartners } from '../utils/api';
import { useLocationPrefix } from '../hooks/useLocationPrefix';

const PartnersView = () => {
  const { locationCode: locationCodeFromParams } = useParams();
  const { locationPrefix } = useLocationPrefix();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchPartners()
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.partners) ? res.partners : [];
        setPartners(list);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load partners');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames(undefined, { type: 'region' });
    } catch {
      return null;
    }
  }, []);

  const activePartners = useMemo(() => {
    const list = partners
      .filter((p) => p?.isActive)
      .map((p) => {
        const countryCode = p?.countryCode ? String(p.countryCode).toUpperCase().trim() : null;
        const countryName = (countryCode && regionNames?.of(countryCode)) || countryCode || '';
        const title = p?.academyName || p?.name || p?.partnerName || 'Partner';
        const website = p?.partnerWebsite || p?.website || '';
        const id = p?._id || `${countryCode || 'xx'}-${title}`;
        return { ...p, id, title, countryCode, countryName, website };
      });

    // If this is a location-prefixed /:locationCode/partners page, prefer to show that location first.
    const loc = locationCodeFromParams ? String(locationCodeFromParams).toUpperCase().trim() : null;
    if (!loc) return list;
    const matching = list.filter((p) => p?.countryCode === loc);
    const rest = list.filter((p) => p?.countryCode !== loc);
    return [...matching, ...rest];
  }, [partners, regionNames, locationCodeFromParams]);

  const homePath = useMemo(() => {
    // locationPrefix is like "/AE" or "".
    return locationPrefix ? `${locationPrefix}/` : '/';
  }, [locationPrefix]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1600px] py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">All Partners</h1>
            <p className="text-slate-600 mt-2">
              Browse regional chapters and partner organizations.
            </p>
          </div>
          <Link
            to={homePath}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">
            Loading partners…
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 rounded-xl p-6 text-red-700">
            {error}
          </div>
        ) : activePartners.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">
            No partners found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activePartners.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-lg font-bold text-slate-900 truncate">{p.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">
                        {p.countryName || p.countryCode || '—'}
                      </span>
                    </div>
                  </div>
                  {p.countryCode ? (
                    <span className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                      {p.countryCode}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.website ? (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition-colors"
                    >
                      Visit website <ExternalLink size={16} />
                    </a>
                  ) : null}

                  {p.countryCode ? (
                    <Link
                      to={`/${p.countryCode}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm hover:bg-slate-50 transition-colors"
                      title={`Open ${p.countryName || p.countryCode}`}
                    >
                      Open chapter
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersView;

