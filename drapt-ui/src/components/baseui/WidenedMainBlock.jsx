import { motion } from "framer-motion";

export default function WidenedMainBlock({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
        >
            <div className="p-2 flex flex-col gap-3 mx-auto w-full mb-[12px]">
                {children}
            </div>
        </motion.div>
    );
}
