export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
}

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

export const springPop = {
  whileHover: { scale: 1.02, y: -2 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
}

export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1, x: 0,
    transition: { duration: 0.4, ease: [0.87, 0, 0.13, 1] }
  },
  exit: { opacity: 0, x: -20 }
}

export const cardHover = {
  whileHover: {
    y: -4,
    borderColor: '#C07841',
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
  }
}