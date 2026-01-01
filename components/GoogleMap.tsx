'use client';

export default function GoogleMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-64 bg-beige-100 rounded-xl flex items-center justify-center border border-gray-200">
        <div className="text-center">
          <p className="text-gray-600 mb-2 text-sm">Carte Google Maps</p>
          <p className="text-xs text-gray-500">
            Configurez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY dans .env.local
          </p>
        </div>
      </div>
    );
  }

  const address = encodeURIComponent('Adresse à confirmer');
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${address}`;

  return (
    <iframe
      width="100%"
      height="400"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={embedUrl}
      className="rounded-xl"
    />
  );
}

