import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        className="w-10 h-10 border-4 border-kirana-cream border-t-kirana-brown rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export default Loader