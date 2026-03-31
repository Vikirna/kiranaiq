import { motion } from 'framer-motion'
import { fadeUp, springPop } from '../../lib/variants'

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      variants={fadeUp}
      {...springPop}
      className="bg-white rounded-2xl p-5 border border-kirana-earth/20 shadow-sm cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
          Live
        </span>
      </div>
      <p className="text-3xl font-bold text-kirana-dark">{value}</p>
      <p className="text-sm text-kirana-earth mt-1">{title}</p>
    </motion.div>
  )
}

export default StatsCard