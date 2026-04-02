import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

const Landing = () => {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()

  // Parallax transforms
  const videoY = useTransform(scrollY, [0, 600], [0, 150])
  const textY = useTransform(scrollY, [0, 600], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 600], [1, 1.1])

  // Feature cards parallax
  const card1Y = useTransform(scrollY, [200, 700], [60, 0])
  const card2Y = useTransform(scrollY, [200, 700], [90, 0])
  const card3Y = useTransform(scrollY, [200, 700], [120, 0])
  const cardsOpacity = useTransform(scrollY, [200, 500], [0, 1])

  return (
    <div ref={containerRef} className="bg-kirana-dark">

      {/* ── HERO SECTION ── */}
      <div className="relative h-screen overflow-hidden">

        {/* Background video with parallax */}
        <motion.div
          style={{ y: videoY, scale }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/kirana.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>

        {/* Hero text with parallax */}
        <motion.div
          style={{ y: textY, opacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        >
          {/* Logo badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <span className="text-5xl">🌾</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
          >
            Never Run Out of
            <br />
            <span className="text-kirana-brown">Stock Again</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/80 mb-10 max-w-xl"
          >
            AI-powered inventory predictions for your kirana store.
            Weather-aware. Festival-smart. Always ahead.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="bg-kirana-brown text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-kirana-orange transition-colors shadow-lg"
              >
                Get Started Free
              </motion.button>
            </Link>
            <Link to="/login?demo=true">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="border-2 border-white/60 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                View Demo →
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1"
            >
              <div className="w-1.5 h-3 bg-white/60 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <div className="bg-kirana-light py-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-kirana-dark mb-4">
              Built for Indian Shop Owners
            </h2>
            <p className="text-kirana-earth text-lg max-w-xl mx-auto">
              KiranaIQ understands Indian festivals, local weather,
              and your store's unique sales patterns.
            </p>
          </motion.div>

          {/* Feature cards with staggered parallax */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌤️',
                title: 'Weather-Aware',
                desc: 'Cold wave coming? We predict chai patti demand spikes before you run out.',
                y: card1Y,
                delay: 0
              },
              {
                icon: '🎉',
                title: 'Festival Smart',
                desc: 'Diwali, Eid, Pongal — we alert you 45 days early so you never miss a demand surge.',
                y: card2Y,
                delay: 0.1
              },
              {
                icon: '📊',
                title: 'Sales Trends',
                desc: 'Your 30-day sales history trains our prediction engine to know your store inside out.',
                y: card3Y,
                delay: 0.2
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                style={{ y: feature.y, opacity: cardsOpacity }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: feature.delay,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 border border-kirana-earth/20 shadow-sm cursor-default"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-kirana-dark mb-2">{feature.title}</h3>
                <p className="text-kirana-earth leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS SECTION ── */}
      <div className="bg-kirana-brown py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '30+', label: 'Indian Festivals Tracked' },
            { value: '45', label: 'Days Advance Warning' },
            { value: '3', label: 'Data Sources Combined' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <p className="text-5xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-white/70 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA SECTION ── */}
      <div className="bg-kirana-light py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl font-bold text-kirana-dark mb-4">
            Ready to never run out of stock?
          </h2>
          <p className="text-kirana-earth text-lg mb-8">
            Join kirana store owners who predict smarter.
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="bg-kirana-brown text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-kirana-orange transition-colors"
            >
              Create Free Account →
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* ── FOOTER ── */}
      <div className="bg-kirana-dark py-8 px-6 text-center">
        <p className="text-white/40 text-sm">
          🌾 KiranaIQ — Built for Bharat
        </p>
      </div>

    </div>
  )
}

export default Landing