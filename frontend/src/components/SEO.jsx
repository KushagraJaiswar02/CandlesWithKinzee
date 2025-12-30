import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = 'CandlesWithKinzee'; // You can make this dynamic or load from env
    const siteUrl = window.location.origin;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />

            {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:type' content='website' />
            <meta property='og:url' content={url || siteUrl} />
            {image && <meta property='og:image' content={image} />}

            {/* Twitter tags */}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:title' content={title} />
            <meta name='twitter:description' content={description} />
            {image && <meta name='twitter:image' content={image} />}
        </Helmet>
    );
};

export default SEO;
