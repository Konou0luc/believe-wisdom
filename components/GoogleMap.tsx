'use client';

interface GoogleMapProps {
  height?: number;
}

export default function GoogleMap({ height = 450 }: GoogleMapProps) {
  // URL embed Google Maps pour CS Les Lumières
  const embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14158.04573960265!2d1.124115440609637!3d6.226684653605475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10215b99356e6957%3A0xcf3f65c76d9f021c!2sCS%20Les%20Lumi%C3%A8res!5e0!3m2!1sfr!2stg!4v1768255608002!5m2!1sfr!2stg';

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200">
    <iframe
        src={embedUrl}
      width="100%"
        height={height}
      style={{ border: 0 }}
        allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
    />
    </div>
  );
}

