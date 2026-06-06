import type { Usuario }from '../lib/UserApi'
import { UsuarioCard } from './UsuarioCard'
import { motion } from "framer-motion";

interface Props {
  users: Usuario[]
}

export const UserList = ({ users }: Props) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
    >
      {users.map((user) => (
        <motion.div
          key={user.id_usuario}
          variants={cardVariants}
          transition={{
            duration: 0.3,
          }}
        >
          <UsuarioCard user={user} />
        </motion.div>
      ))}
    </motion.div>
  )
}
