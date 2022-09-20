enum MetaType {
    Production = 1,
    Development = 4
}

const chainMetas = {
    [MetaType.Production]: {
        rootUrl: "nounlets.tessera.co",
        title: "Nounlets",
        description: "Buy fractions of a Noun",
        social: {
            graphic:
                "https://pbs.twimg.com/profile_images/1560444183948804096/-2oi18u7_400x400.jpg",
            twitter: "@tessera",
        },
    },
    // TODO: CHANGE PROD STUFF
    [MetaType.Development]: {
        rootUrl: "https://dev-nounlets.tessera.co",
        title: "Nounlets",
        description: "Buy fractions of a Noun",
        social: {
            graphic:
                "https://pbs.twimg.com/profile_images/1560444183948804096/-2oi18u7_400x400.jpg",
            twitter: "@tessera",
        },
    }

};


const metaSettings = chainMetas[parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1') as MetaType];

export default metaSettings;
