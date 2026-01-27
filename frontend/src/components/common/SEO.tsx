import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
}

export const SEO = ({
    title,
    description,
    name = 'UniFlow',
    type = 'website'
}: SEOProps) => {
    const siteTitle = 'UniFlow - Your College Life, Organized';
    const metaTitle = title ? `${title} | ${name}` : siteTitle;
    const metaDescription = description || 'UniFlow is the #1 finance app for students. Track expenses, split bills with roommates, and master your money with AI-powered budgeting.';

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{metaTitle}</title>
            <meta name='description' content={metaDescription} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
        </Helmet>
    );
};
