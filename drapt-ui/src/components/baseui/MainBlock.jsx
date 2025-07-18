import { motion } from "framer-motion";

export function MainBlock({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
        >
            <div className="p-2 flex flex-col gap-3 mx-auto max-w-7xl mb-[12px]">
                {children}
            </div>
        </motion.div>
    );
}
