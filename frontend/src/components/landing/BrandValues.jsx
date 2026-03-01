/* eslint-disable */
import React from 'react';
import { motion } from 'framer-motion';

const values = [
    {
        title: "Handcrafted Quality",
        description: "Each candle is meticulously hand-poured in small batches to ensure exceptional quality and attention to detail.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        )
    },
    {
        title: "Premium Materials",
        description: "We use only 100% natural soy wax, lead-free cotton wicks, and phthalate-free premium fragrance oils.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
        )
    },
    {
        title: "Long-lasting Fragrance",
        description: "Expertly blended scents that fill your space with a calm, inviting aroma from the first light to the final flicker.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        )
    }
];

const BrandValues = () => {
    return (
        <section className="bg-white py-24 px-6 border-y border-borderSubtle">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="w-16 h-16 rounded-full bg-soft text-charcoal flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-flame group-hover:text-white transition-all duration-500 ease-out">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-serif text-charcoal font-medium mb-3 group-hover:text-flame transition-colors duration-300">
                                {value.title}
                            </h3>
                            <p className="text-charcoal/60 font-light leading-relaxed text-[15px] max-w-xs">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandValues;
