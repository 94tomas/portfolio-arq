import React, { useState } from 'react';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className='w-full fixed top-0 left-0 z-50'>
            <div className='w-full max-w-7xl mx-auto px-4'>
                <div className='flex items-center justify-between'>
                    <div>
                        <a href="/" className='text-2xl'>
                            <span className='text-primary font-bold text-2xl'>3D</span>
                            Arquitectura
                        </a>
                    </div>
                    {/* mobile menu button */}
                    <div className='md:hidden py-5 z-50 relative'>
                        <button 
                            onClick={handleMenuToggle} 
                            className='text-white text-2xl cursor-pointer p-2 hover:opacity-80 transition-opacity'
                            aria-label="Toggle menu"
                            type="button"
                        >
                            {isMenuOpen ? (
                                <svg className='w-8 h-8 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <title>close</title>
                                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                </svg>
                            ) : (
                                <svg className='w-8 h-8 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <title>menu</title>
                                    <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {/* desktop menu */}
                    <nav className='hidden md:block py-8'>
                        <ul className='flex items-center justify-end gap-4 text-white'>
                            <li>
                                <a href="#hero" className='hover:text-primary transition-colors'>Inicio</a>
                            </li>
                            <li>
                                <a href="#about" className='hover:text-primary transition-colors'>Acerca de mi</a>
                            </li>
                            <li>
                                <a href="#proyects" className='hover:text-primary transition-colors'>Proyectos</a>
                            </li>
                            <li>
                                <a href="#contact" className='hover:text-primary transition-colors'>Contactame</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            {/* mobile menu overlay */}
            {isMenuOpen && (
                <div 
                    className='fixed inset-0 bg-black/90 backdrop-blur-md z-[45] md:hidden'
                    onClick={handleMenuToggle}
                >
                    <nav className='h-full flex items-center justify-center' onClick={(e) => e.stopPropagation()}>
                        <ul className='flex flex-col items-center justify-center gap-8 text-white text-2xl'>
                            <li>
                                <a 
                                    href="#hero" 
                                    onClick={handleLinkClick}
                                    className='hover:text-primary transition-colors block py-2'
                                >
                                    Inicio
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#about" 
                                    onClick={handleLinkClick}
                                    className='hover:text-primary transition-colors block py-2'
                                >
                                    Acerca de mi
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#proyects" 
                                    onClick={handleLinkClick}
                                    className='hover:text-primary transition-colors block py-2'
                                >
                                    Proyectos
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#contact" 
                                    onClick={handleLinkClick}
                                    className='hover:text-primary transition-colors block py-2'
                                >
                                    Contactame
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;