import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className='w-full py-6'>
            <div className='w-full max-w-7xl mx-auto px-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-white/40 text-sm md:text-base'>Copyright © {new Date().getFullYear()} - Todos los derechos reservados</span>
                    {/* <a href="#">Sitio web creado por <span className='text-primary'>OHdev</span></a> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;