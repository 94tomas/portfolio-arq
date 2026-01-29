import React from 'react';

const Header: React.FC = () => {
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
                    <nav className='py-8'>
                        <ul className='flex items-center justify-end gap-4 text-white'>
                            <li>
                                <a href="#home">Home</a>
                            </li>
                            <li>
                                <a href="#about">About</a>
                            </li>
                            <li>
                                <a href="#services">Services</a>
                            </li>
                            <li>
                                <a href="#contact">Contact</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;