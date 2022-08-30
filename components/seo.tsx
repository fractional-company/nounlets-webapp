import React from "react";
import Head from "next/head";
import metaSettings from "../lib/utils/meta";

interface SocialTagsProps {
    openGraphType: string,
    schemaType?: string,
    url: string,
    title: string,
    description: string,
    image: string,
    createdAt?: string,
    updatedAt?: string,
}

const socialTags = ({
                        openGraphType,
                        url,
                        title,
                        description,
                        image,
                        createdAt,
                        updatedAt,
                    }: SocialTagsProps) => {
    return [
        {name: "twitter:card", content: "summary_large_image"},
        {
            name: "twitter:site",
            content:
                metaSettings &&
                metaSettings.social &&
                metaSettings.social.twitter,
        },
        {name: "twitter:title", content: title},
        {name: "twitter:description", content: description},
        {
            name: "twitter:creator",
            content:
                metaSettings &&
                metaSettings.social &&
                metaSettings.social.twitter,
        },
        {name: "twitter:image:src", content: image},
        {name: "twitter:card", content: "summary_large_image"},
        {name: "og:title", content: title},
        {name: "og:type", content: openGraphType},
        {name: "og:url", content: url},
        {name: "og:image", content: image},
        {name: "og:description", content: description},
        {
            name: "og:site_name",
            content: metaSettings && metaSettings.title,
        },
        {
            name: "og:published_time",
            content: createdAt || new Date().toISOString(),
        },
        {
            name: "og:modified_time",
            content: updatedAt || new Date().toISOString(),
        },
    ];
};

const SEO = (props: SocialTagsProps) => {
    const { title, description, image } = props;
    return (
        <Head>
            <title>{title} | Nounlets</title>
            <meta name="description" content={description} />
            <meta itemProp="name" content={title} />
            <meta itemProp="description" content={description} />
            <meta itemProp="image" content={image} />
            {socialTags(props).map(({ name, content }) => {
                return <meta key={name} name={name} content={content} />;
            })}
            {/*<script*/}
            {/*    type="application/ld+json"*/}
            {/*    dangerouslySetInnerHTML={{*/}
            {/*        __html: JSON.stringify({*/}
            {/*            "@context": "https://schema.org",*/}
            {/*            "@type": schemaType,*/}
            {/*            name: title,*/}
            {/*            about: description,*/}
            {/*            url: url,*/}
            {/*        }),*/}
            {/*    }}*/}
            {/*/>*/}
        </Head>
    );
};

SEO.defaultProps = {
    url: "/",
    openGraphType: "website",
    type: "website",
    title: metaSettings && metaSettings.title,
    description: metaSettings && metaSettings.description,
    image: metaSettings && metaSettings.social && metaSettings.social.graphic,
};

export default SEO;
