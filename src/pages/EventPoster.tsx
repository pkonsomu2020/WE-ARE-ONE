import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '@/data/events';
import { toPng } from 'html-to-image';

const POSTER_WIDTH = 1080;
const POSTER_HEIGHT = 1080;
const CIRCLE_SIZE = 400; // px (display size). We'll export at 2x for crispness.

const EventPoster: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = getEventById(id);
  const navigate = useNavigate();

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!event) return;
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#101522]">
        <div className="text-center">
          <div className="mb-4">Event not found</div>
          <button
            onClick={() => navigate('/events')}
            className="px-4 py-2 bg-ngo-orange text-white rounded"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;
    const dataUrl = await toPng(posterRef.current, { pixelRatio: 2, cacheBust: true });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${event.id}-attending.png`;
    a.click();
  };

  const sharePoster = async () => {
    if (!posterRef.current) return;
    const dataUrl = await toPng(posterRef.current, { pixelRatio: 2, cacheBust: true });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${event.id}-attending.png`, { type: 'image/png' });
    type ShareDataWithFiles = { files?: File[]; title?: string; text?: string };
    const navAny = navigator as Navigator & { canShare?: (data?: ShareDataWithFiles) => boolean; share?: (data?: ShareDataWithFiles) => Promise<void> };
    const shareData: ShareDataWithFiles = { files: [file], title: event.title, text: `I will be attending ${event.title}!` };
    if (navAny.canShare && navAny.canShare(shareData) && navAny.share) {
      await navAny.share(shareData);
    } else {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${event.id}-attending.png`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-900 text-white rounded">Back</button>
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" capture="user" onChange={onPick} />
            <button onClick={downloadPoster} className="px-4 py-2 bg-ngo-orange text-white rounded">Download</button>
            <button onClick={sharePoster} className="px-4 py-2 bg-white border rounded">Share</button>
          </div>
        </div>

        {/* Poster canvas */}
        <div className="flex items-center justify-center">
          <div
            ref={posterRef}
            style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
            className="relative bg-white overflow-hidden shadow-2xl"
          >
            {/* Background template */}
            <img
              src="/sample-img.png"
              alt="Poster Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Circular photo anchored to right side, vertically centered */}
            <div
              className="absolute"
              style={{ right: 80, top: '50%', transform: 'translateY(-50%)' }}
            >
              <div
                className="rounded-full overflow-hidden ring-8 ring-white shadow-2xl"
                style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
              >
                {photoUrl ? (
                  <img src={photoUrl} className="w-full h-full object-cover" alt="Your photo" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl">
                    Add Photo
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPoster;



