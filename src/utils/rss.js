const FEED_URL = 'https://futuretech.media/category/technoxian/feed/gn';
const FALLBACK_PROXY = 'https://api.allorigins.win/raw?url=';

const hashString = (value) => {
  if (!value) return Math.floor(Math.random() * 1_000_000);
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const formatDate = (dateString) => {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString || '';
  return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const extractText = (htmlString) => {
  if (!htmlString) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body.textContent?.trim() || '';
};

const extractFirstImage = (htmlString) => {
  if (!htmlString) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const img = doc.querySelector('img');
  return img?.getAttribute('src') || '';
};

const parseItem = (itemNode, index) => {
  const title = itemNode.querySelector('title')?.textContent?.trim() || 'Untitled';
  const link = itemNode.querySelector('link')?.textContent?.trim() || '';
  const guid = itemNode.querySelector('guid')?.textContent?.trim();
  const pubDate = itemNode.querySelector('pubDate')?.textContent?.trim() || '';
  const description = itemNode.querySelector('description')?.textContent || '';
  const contentEncoded = itemNode.getElementsByTagName('content:encoded')[0]?.textContent || '';

  const contentHtml = contentEncoded || description;
  const primaryImage = extractFirstImage(contentHtml);
  const fallbackBody = extractText(description) || extractText(contentHtml);

  return {
    id: hashString(guid || link || `${title}-${index}`),
    title,
    link,
    category: 'Technoxian',
    date: formatDate(pubDate),
    desc: fallbackBody.slice(0, 180) + (fallbackBody.length > 180 ? '…' : ''),
    body: fallbackBody,
    contentHtml,
    featuredImage: primaryImage,
    source: 'FutureTech',
  };
};

const fetchXml = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Feed request failed with ${res.status}`);
  }
  return res.text();
};

export const fetchTechnoxianFeed = async () => {
  let xml;
  try {
    xml = await fetchXml(FEED_URL);
  } catch (primaryErr) {
    // CORS or network issues: try proxy
    const proxied = `${FALLBACK_PROXY}${encodeURIComponent(FEED_URL)}`;
    xml = await fetchXml(proxied);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Unable to parse feed XML');
  }

  const items = Array.from(doc.querySelectorAll('channel > item'));
  return items.map((node, idx) => parseItem(node, idx));
};

export const NEWS_FEED_URL = FEED_URL;

