'use client';

import { motion } from 'framer-motion';

export default function VideoEmbed({
  youtubeId = 'dQw4w9WgXcQ',
  title = 'Demo video',
  className = '',
  width = 560,
  height = 315,
}) {
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: '100%',
        maxWidth: width,
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <iframe
        src={src}
        title={title}
        className="h-full w-full border border-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </motion.div>
  );
}
