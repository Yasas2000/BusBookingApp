import React from 'react';
import Hero from './hero/Hero';
import Search from '../search/Search';
import Category from './category/Category.jsx';


const HomeContainer = () => {
    return (
        <>{/* HomeContainer component */}
            <Hero />
            <Search />
        </>
    );
};

export default HomeContainer;